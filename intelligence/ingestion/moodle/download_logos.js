const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = {
    'capital_one.svg': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Capital_One_logo.svg',
    'walmart.svg': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Walmart_logo_%282008%29.svg',
    'caesars.svg': 'https://upload.wikimedia.org/wikipedia/en/f/f6/Caesars_Entertainment_logo_2020.svg',
    'progressive.svg': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_of_the_Progressive_Corporation.svg',
    'patriots.svg': 'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg'
};

const destDir = path.join('d:', 'repositorio_geral', 'app_gestao_contratos', 'public', 'logos');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

function download(name, url) {
    return new Promise((resolve, reject) => {
        const dest = path.join(destDir, name);
        const file = fs.createWriteStream(dest);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        https.get(url, options, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${name}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${name}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {}); // Delete the file async if error
            console.log(`Erro download ${name}: ${err.message}`);
            reject(err);
        });
    });
}

async function run() {
    for (const [name, url] of Object.entries(urls)) {
        try {
            await download(name, url);
        } catch (err) {
            console.error(err);
        }
    }
    console.log("Done.");
}

run();
