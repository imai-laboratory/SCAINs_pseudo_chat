def generate_answer(dialogue, agent):
    joined_dialogue = "\n".join(dialogue)
    prompt = f"以下の会話文に続くように{agent}として発言をしてください。\n\n会話文：{joined_dialogue}"
    return prompt
