import os

file_path = r"d:\repositorio_geral\app_gestao_contratos\src\components\CompetidoresSeccion.tsx"

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Inspect line 27 (0-indexed 26)
if len(lines) > 26:
    line27 = lines[26]
    if "O BENCHMARK MÁXIMO" in line27 and "position: 'absolute'" in line27:
        print("Found pattern on line 27")
        # Split by the tag transition </div><div
        if "</div><div style" in line27:
            parts = line27.split("</div><div style")
            lines[26] = parts[0] + "</div>\n"
            print("Updated line 27")
            
            # Remove lines 28 to 34 (indices 27 to 33 inclusive)
            # Lines list: 
            # 27: <div style... (index 26) -> updated
            # 28: <iframe (index 27) -> remove
            # 34: </div> (index 33) -> remove
            for i in range(27, 34):
                if i < len(lines):
                    print(f"Removing line {i+1}: {lines[i].strip()}")
                    lines[i] = ""
                    
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print("Successfully updated file.")
        else:
            print("Could not split line 27 accurately.")
    else:
         print("Pattern 'O BENCHMARK MÁXIMO' or 'absolute' not on line 27.")
else:
    print("File too short.")
