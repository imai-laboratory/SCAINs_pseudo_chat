def generate_answer(dialogue, agent):
    try:
        # Ensure each item in the dialogue list is a dictionary with expected keys
        if not all(isinstance(entry, dict) and 'person' in entry and 'content' in entry for entry in dialogue):
            raise ValueError("Each item in dialogue must be a dictionary with 'person' and 'content' keys")

        # Join the dialogue entries into a single string
        joined_dialogue = "\n".join([f"{entry['person']}: {entry['content']}" for entry in dialogue])
        prompt = f"以下の会話文に続くように{agent}として1~2文程度で発言をしてください。\n\n会話文：\n{joined_dialogue}"
        return prompt
    except Exception as e:
        raise


def topic11(dialogue, agent):
    joined_dialogue = "\n".join([f"{entry['person']}: {entry['content']}" for entry in dialogue])
    prompt = (f"入力された画像に対して、以下のテーマに沿って議論しています。\n\n テーマ: "
              f"「なぜフード付きのスウェットシャツを着た男性とパイプを持った男性が話していると思いますか？」\n"
              f"このテーマに沿って、以下の会話文に続くように{agent}として1~2文程度で簡潔に発言をしてください。\n\n会話文：\n{joined_dialogue}")
    return prompt


def topic11_to_b(dialogue):
    joined_dialogue = "\n".join([f"{entry['person']}: {entry['content']}" for entry in dialogue])
    prompt = (f"以下の会話文に続くようにAさんとして1文程度で簡潔に、Bさんに話を振る発言をしてください。\n\n"
              f"会話文：\n{joined_dialogue}")
    return prompt


def rephrase_chat_ja(dialogue, sentence):
    joined_dialogue = "\n".join(dialogue)
    prompt = (
        f"会話文中のある発言を具体的に言い換えます．\nAとBの2人の会話文が入力された後に，言い換えの対象となる発言が指定されます．\n"
        f"指定された発言を，会話文中の言葉を使ってより具体的に言い換えます．\n\n# 会話文\n{joined_dialogue}\n\n# 言い換える発言\n"
        f"{sentence}\n\n# 具体的な発言\n"
    )
    return prompt
