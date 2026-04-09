import os
import hashlib
import json
import re
from concurrent.futures import ThreadPoolExecutor
from client import default_moodle
from supabase import create_client, Client

SUPABASE_URL = "https://fhvexkhqwudxxkbahxbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodmV4a2hxd3VkeHhrYmFoeGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY3MzI5NCwiZXhwIjoyMDkxMjQ5Mjk0fQ.god6rwZ-wirdP5lfqy4Fa6uPDItz8Vd_Dt-NAWrXl0g"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
categories_map = {}

def generate_hash(text: str) -> str:
    if not text: return ""
    return hashlib.sha256(str(text).strip().encode()).hexdigest()

def apply_etl_to_course(course_name: str):
    """Extrai Tag (se houver) e limpa o nome do curso."""
    match = re.match(r"^\[(.*?)\]\s*(.*)", str(course_name))
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None, str(course_name).strip()

def resolve_category_hierarchy(category_id: int):
    """Encontra Nivel 1 (Macro), Nivel 2 (Modality) e Nivel 3 (Degree)."""
    macro = modality = degree = "Indefinido"
    
    current = categories_map.get(category_id)
    if not current: return macro, modality, degree
    
    path_str = current.get('path', '')
    path_ids = [int(p) for p in str(path_str).strip('/').split('/') if p] if path_str else []
    
    if len(path_ids) >= 1: macro = categories_map.get(path_ids[0], {}).get('name', 'Indefinido')
    if len(path_ids) >= 2: modality = categories_map.get(path_ids[1], {}).get('name', 'Indefinido')
    if len(path_ids) >= 3: degree = categories_map.get(path_ids[2], {}).get('name', 'Indefinido')
    
    return macro, modality, degree

def sync_course_users(course):
    course_id = course.get('id')
    course_name = course.get('fullname')
    category_id = course.get('categoryid', 0)
    
    course_tag, clean_course_name = apply_etl_to_course(course_name)
    macro, modality, degree = resolve_category_hierarchy(category_id)
    
    users = default_moodle.get_enrolled_users(course_id)
    
    if isinstance(users, dict) and users.get('error'): return 0

    students_to_upsert = []
    for user in users:
        cpf_bruto = ""
        for cf in user.get('customfields', []):
            if cf.get('shortname') == 'cpf':
                cpf_bruto = cf.get('value', '')
                break
                
        roles = user.get('roles', [])
        is_teacher = any("teacher" in str(r.get('shortname')).lower() or "coord" in str(r.get('shortname')).lower() for r in roles)
        
        if is_teacher: continue
             
        full_name = f"{user.get('firstname', '')} {user.get('lastname', '')}"
        moodle_role = roles[0].get('shortname', 'student') if roles else 'student'

        student_data = {
            "ies_id": "8f399f2a-e9fc-4560-9111-64d56d194567",
            "external_id_moodle": str(user.get('id')),
            "full_name_hash": generate_hash(full_name),
            "cpf_hash": generate_hash(cpf_bruto) if cpf_bruto else None,
            "email_hash": generate_hash(user.get('email', '')),
            "moodle_role": moodle_role,
            "course_name": course_name,
            "clean_course_name": clean_course_name,
            "course_tag": course_tag,
            "macro_category": macro,
            "modality": modality,
            "degree": degree,
            "moodle_last_access": user.get('lastaccess', 0),
            "current_status": "Ativo",
            "raw_moodle_data": user
        }
        students_to_upsert.append(student_data)

    if students_to_upsert:
        try:
            supabase.table("students").upsert(students_to_upsert, on_conflict="external_id_moodle").execute()
            return len(students_to_upsert)
        except Exception as e:
            print(f"⚠️ Erro no Sync do curso {course_id} | {e}")
            return 0
    return 0

def run_full_sync():
    print("🚀 ETL: Baixando Árvore de Categorias...")
    cats = default_moodle.request('core_course_get_categories')
    if isinstance(cats, list):
        for c in cats:
            categories_map[c.get('id')] = c
    else:
        print("Aviso: Falha ao baixar categorias.")

    print("🚀 Iniciando Sincronização e ETL ARKOS 360...")
    courses = default_moodle.get_courses()
    
    if not isinstance(courses, list):
        print(f"❌ Falha ao listar cursos: {courses}")
        return

    print(f"📊 {len(courses)} cursos encontrados. Processando ETL Completo!")
    
    test_courses = courses[:100]

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(sync_course_users, test_courses))
        
    print(f"\n✅ SUCESSO ETL! Total processado: {sum(results)}.")

if __name__ == "__main__":
    run_full_sync()
