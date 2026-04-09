import urllib.request
import urllib.parse
import json

MOODLE_URL = 'https://ead.cidadeviva.org/webservice/rest/server.php'
MOODLE_TOKEN = '71edd081c7e0c5bb83f872b60af80227'

def moodle_request(wsfunction, params={}):
    payload = {
        **params,
        'wstoken': MOODLE_TOKEN,
        'moodlewsrestformat': 'json',
        'wsfunction': wsfunction
    }
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(MOODLE_URL, data=data, method='POST')
    try:
        with urllib.request.urlopen(req) as f:
            return json.loads(f.read().decode('utf-8'))
    except Exception as e:
        return {"error": True, "message": str(e)}

def main():
    print("📡 Buscando cursos do Moodle...")
    courses = moodle_request('core_course_get_courses')
    
    if isinstance(courses, dict) and (courses.get('error') or courses.get('exception')):
        print("❌ Erro na API Moodle:", courses)
        return

    print(f"✅ Encontrados {len(courses)} cursos. Gravando nomes para análise...")
    
    # Adicionando metadados importantes para análise
    course_list = []
    for c in courses:
        course_list.append({
            'id': c.get('id'),
            'fullname': c.get('fullname'),
            'shortname': c.get('shortname'),
            'categoryid': c.get('categoryid')
        })
        
    with open('moodle_courses_dump.json', 'w', encoding='utf-8') as f:
        json.dump(course_list, f, ensure_ascii=False, indent=2)
        
    print("✅ Salvo em moodle_courses_dump.json")

if __name__ == '__main__':
    main()
