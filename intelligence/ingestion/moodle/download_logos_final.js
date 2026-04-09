const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = {
    'ups.svg': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/UPS_Logo_Shield_2017.svg',
    'oakland_as.svg': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Oakland_A%27s_cap_logo.svg'
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
            fs.unlink(dest, () => {});
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
