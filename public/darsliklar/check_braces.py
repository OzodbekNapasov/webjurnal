with open("pages/telegram_darslik.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

js_content = "".join(lines[2383:3179])
if "<!--" in js_content:
    print("Found '<!--' in JS content!")
    # Find all line numbers where it occurs
    for idx, line in enumerate(lines[2383:3179]):
        if "<!--" in line:
            print(f"Line {idx+2384}: {line.strip()}")
else:
    print("No '<!--' found in JS content.")
