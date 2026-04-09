// Native fetch used

const MOODLE_TOKEN = "71edd081c7e0c5bb83f872b60af80227";
const MOODLE_URL = "https://ead.cidadeviva.org/webservice/rest/server.php";

async function moodleRequest(wsfunction, params = {}) {
    const payload = new URLSearchParams({
        ...params,
        wstoken: MOODLE_TOKEN,
        moodlewsrestformat: 'json',
        wsfunction: wsfunction
    });

    const resp = await fetch(MOODLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
    });
    return await resp.json();
}

async function run() {
    try {
        console.log("📡 [1] Buscando cursos...");
        const courses = await moodleRequest('core_course_get_courses');
        
        // Pick top course that has a valid ID
        const firstCourse = courses.find(c => c.id > 1);
        const courseId = firstCourse ? String(firstCourse.id) : "2";

        console.log(`📡 [2] Buscando participantes do curso ID ${courseId}...`);
        const users = await moodleRequest('core_enrol_get_enrolled_users', { courseid: courseId });
        const realUser = users.find(u => u.username !== 'admin') || users[0];

        if (realUser) {
            console.log("\n✅ [RESULTADO] Estrutura Bruta do Primeiro Aluno Encontrado:\n");
            console.log(JSON.stringify(realUser, null, 2));
            
            console.log("\n📡 Exibindo todos os campos customfields encontrados para esse aluno:");
            if(realUser.customfields) {
               console.log(realUser.customfields);
            } else {
               console.log("Nenhum customfield relatado.");
            }
        } else {
            console.log("❌ Nenhum aluno encontrado para o curso.");
        }
    } catch (e) {
        console.error("❌ Erro:", e);
    }
}

run();
