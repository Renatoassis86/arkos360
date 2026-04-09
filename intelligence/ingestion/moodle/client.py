import requests
import json
from typing import Dict, List, Any

class MoodleClient:
    """
    Cliente de Integração ARKOS 360 para Moodle LMS.
    Extrai dados de engajamento digital para o cálculo do SED.
    """
    
    def __init__(self, url: str, token: str):
        self.url = url
        self.token = token
        self.format = 'json'

    def request(self, wsfunction: str, params: Dict[str, Any] = {}) -> Any:
        """Executa uma chamada Genérica ao WebService do Moodle."""
        payload = {
            **params,
            'wstoken': self.token,
            'moodlewsrestformat': self.format,
            'wsfunction': wsfunction
        }
        
        try:
            response = requests.post(self.url, data=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": True, "message": str(e)}

    def get_courses(self) -> List[Dict[str, Any]]:
        """Retorna lista de cursos ativos."""
        return self.request('core_course_get_courses')

    def get_enrolled_users(self, course_id: int) -> List[Dict[str, Any]]:
        """Retorna alunos matriculados em um curso específico."""
        return self.request('core_enrol_get_enrolled_users', {'courseid': course_id})

    def get_user_last_access(self, user_id: int) -> Dict[str, Any]:
        """Exemplo de extração de metadados do usuário."""
        return self.request('core_user_get_users', {'criteria[0][key]': 'id', 'criteria[0][value]': str(user_id)})

# Singleton ou instância padrão baseada no TCC/Tmp
MOODLE_URL = 'https://ead.cidadeviva.org/webservice/rest/server.php'
MOODLE_TOKEN = '71edd081c7e0c5bb83f872b60af80227'

default_moodle = MoodleClient(MOODLE_URL, MOODLE_TOKEN)

if __name__ == "__main__":
    print("📡 Testando conexão com Moodle ARKOS...")
    courses = default_moodle.get_courses()
    if isinstance(courses, list):
        print(f"✅ Conexão bem sucedida! Total de cursos encontrados: {len(courses)}")
    else:
        print(f"❌ Erro na conexão: {courses}")
