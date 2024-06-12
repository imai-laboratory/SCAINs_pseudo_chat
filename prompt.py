def generate_answer(dialogue, agent):
    try:
        # Ensure each item in the dialogue list is a dictionary with expected keys
        if not all(isinstance(entry, dict) and 'person' in entry and 'content' in entry for entry in dialogue):
            raise ValueError("Each item in dialogue must be a dictionary with 'person' and 'content' keys")

        # Join the dialogue entries into a single string
        joined_dialogue = "\n".join([f"{entry['person']}: {entry['content']}" for entry in dialogue])
        prompt = f"以下の会話文に続くように{agent}として発言をしてください。\nただし×で示されたセリフは{agent}が聞き逃した発言とする。\n\n会話文：{joined_dialogue}"
        return prompt
    except Exception as e:
        raise
