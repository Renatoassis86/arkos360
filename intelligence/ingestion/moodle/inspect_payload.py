import json
from client import default_moodle

def inspect():
    print("📡 Iniciando Inspeção Profunda de Payload Moodle...")
    courses = default_moodle.get_courses()
    
    if not courses:
        print("❌ Nenhum curso encontrado.")
        return

    # Pegamos um curso com ID maior (para evitar o ID 1 que geralmente é a Home)
    valid_course = next((c for c in courses if c['id'] > 1), courses[0])
    c_id = valid_course['id']
    print(f"📘 Analisando Curso: {valid_course['fullname']} (ID: {c_id})")
    
    users = default_moodle.get_enrolled_users(c_id)
    if not users:
        print("❌ Nenhum usuário matriculado encontrado neste curso.")
        return

    print(f"✅ Usuário encontrado: {users[0].get('fullname')}")
    print("\n--- ESTRUTURA DO PAYLOAD ---\n")
    print(json.dumps(users[0], indent=2, ensure_ascii=False))
    
    # Verificação Adicional: Custom Fields (Importante para CPF/Identidade)
    print("\n--- CAMPOS CUSTOMIZADOS (IMPORTANTE PARA OE1) ---")
    if 'customfields' in users[0]:
        print(json.dumps(users[0]['customfields'], indent=2, ensure_ascii=False))
    else:
        print("Nenhum campo customizado encontrado na raiz do usuário.")

if __name__ == "__main__":
    inspect()
