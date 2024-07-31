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
