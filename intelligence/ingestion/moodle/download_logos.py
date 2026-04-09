import urllib.request
import os

urls = {
    'capital_one.svg': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Capital_One_logo.svg',
    'walmart.svg': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Walmart_logo_%282008%29.svg',
    'caesars.svg': 'https://upload.wikimedia.org/wikipedia/en/f/f6/Caesars_Entertainment_logo_2020.svg',
    'progressive.svg': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_of_the_Progressive_Corporation.svg',
    'patriots.svg': 'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg'
}

dest_dir = r'd:\repositorio_geral\app_gestao_contratos\public\logos'

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for name, url in urls.items():
    dest = os.path.join(dest_dir, name)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(dest, 'wb') as f:
                f.write(response.read())
        print(f'Downloaded {name}')
    except Exception as e:
        print(f'Failed {name}: {e}')
print("Done.")
