import json

filename = "PP2"
txt_file = "./dat/" + filename + ".txt"
js_file = "../front/src/assets/data/" + filename + ".js"
username = "B"

def txt_to_js(txt_file, js_file):
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
        file.write("const sampleData = ")
        file.write(json.dumps(js_data, ensure_ascii=False, indent=4))
        file.write("\n\nexport default sampleData")

# テキストをJavaScript配列に変換して保存
txt_to_js(txt_file, js_file)