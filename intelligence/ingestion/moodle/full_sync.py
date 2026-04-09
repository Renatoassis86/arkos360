import os
import hashlib
import json
from concurrent.futures import ThreadPoolExecutor
from client import default_moodle
from supabase import create_client, Client

SUPABASE_URL = "https://fhvexkhqwudxxkbahxbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodmV4a2hxd3VkeHhrYmFoeGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY3MzI5NCwiZXhwIjoyMDkxMjQ5Mjk0fQ.god6rwZ-wirdP5lfqy4Fa6uPDItz8Vd_Dt-NAWrXl0g"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_hash(text: str) -> str:
    """Gera Hash SHA-256 para anonimização (OE1)."""
    if not text:
        return ""
    return hashlib.sha256(str(text).strip().encode()).hexdigest()

def sync_course_users(course):
    """Sincroniza alunos de um curso específico extraindo TODO o payload."""
    course_id = course.get('id')
    course_name = course.get('fullname')
    
    users = default_moodle.get_enrolled_users(course_id)
    
    if isinstance(users, dict) and users.get('error'):
        return 0

    students_to_upsert = []
    for user in users:
        # Extração Segura de CPF (OE1)
        cpf_bruto = ""
        for cf in user.get('customfields', []):
            if cf.get('shortname') == 'cpf':
                cpf_bruto = cf.get('value', '')
                break
                
        # Captura das roles
        roles = user.get('roles', [])
        is_teacher = any("teacher" in str(r.get('shortname')).lower() or "coord" in str(r.get('shortname')).lower() for r in roles)
        
        # Ignorar apenas pessoas que com certeza são professores/administradores da Instituição
        if is_teacher:
             continue
             
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
            "moodle_last_access": user.get('lastaccess', 0),
            "current_status": "Ativo",
            "raw_moodle_data": user # Salva Tudo! Todo o JSON do Moodle.
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
    print("🚀 Iniciando Sincronização Granular ARKOS 360 (Extraindo TUDO para Lakehouse)...")
    courses = default_moodle.get_courses()
    
    if not isinstance(courses, list):
        print(f"❌ Falha ao listar cursos: {courses}")
        return

    print(f"📊 {len(courses)} cursos encontrados. Iniciando extração do Data Lake...")

    # Vamos processar os primeiros 100 cursos para termos um volume interessante de imediato.
    test_courses = courses[:100]

    total_synced = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(sync_course_users, test_courses))
        total_synced = sum(results)

    print(f"\n✅ SUCESSO! Total de perfis unificados (USR) sincronizados nesse lote: {total_synced}.")

if __name__ == "__main__":
    run_full_sync()
