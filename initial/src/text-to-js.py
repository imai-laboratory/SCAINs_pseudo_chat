import json

# 話者user
username = "B"
# ファイル名
filename = "PP59"

txt_file = "./dat/" + filename + ".txt"
js_file = "../front/src/assets/data/" + filename + ".js"


def txt_to_js():
    with open(txt_file, "r", encoding="utf-8") as file:
        lines = file.readlines()
        js_data = []

        for index, line in enumerate(lines):
            line = line.strip()
            if line:
                person, content = line.split(": ", 1)
                person = "user" if person == username else person
                data = {
                    "index": index + 1,
                    "content": content,
                    "person": person
                }
                js_data.append(data)

    with open(js_file, "w", encoding="utf-8") as file:
        file.write(f"const {filename} = ")
        file.write(json.dumps(js_data, ensure_ascii=False, indent=4) + ";")
        file.write(f"\n\nexport default {filename};")


# テキストをJavaScript配列に変換して保存
txt_to_js()
