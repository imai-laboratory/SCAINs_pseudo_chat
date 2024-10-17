import random
from app.utils.utils import join_dialogue

def generate_answer(dialogue, agent, language='ja'):
    try:
        joined_dialogue = join_dialogue(dialogue)
        if language == 'en':
            prompt = f"As {agent}, please continue the following conversation with 1-2 sentences.\n\nDialogue:\n{joined_dialogue}"
        else:
            prompt = f"以下の会話文に続くように{agent}として1~2文程度で発言をしてください。\n\n会話文：\n{joined_dialogue}"
        return prompt
    except Exception as e:
        print(f"Error generating answer: {e}")
        raise


def topic11(dialogue, agent, language='ja'):
    if language == 'en':
        joined_dialogue = join_dialogue(dialogue)
        prompt = (f"The conversation is about the following topic:\n"
                  f"Dialogue:\n{joined_dialogue}\n\n"
                  f"As {agent}, please make a concise statement in one sentence.")
    else:
        joined_dialogue = join_dialogue(dialogue)
        prompt = (f"以下の会話に続くように議論してください。\n"
                  f"会話文：\n{joined_dialogue}\n\n"
                  f"{agent}として1文程度で簡潔に発言をしてください。")

    return prompt


def rephrase_chat(dialogue, sentence, language='ja'):
    joined_dialogue = "\n".join(dialogue)

    if language == 'en':
        prompt = (
            f"Rephrase a specific statement in a conversation to make it more concrete.\n"
            f"After a conversation between two people is input, the statement to be rephrased is specified.\n"
            f"Rephrase the specified statement to be more concrete, avoiding the use of demonstratives, while using words from the conversation.\n\n"
            f"# Conversation\n"
            f"{joined_dialogue}\n\n"
            f"# Statement to Rephrase\n"
            f"{sentence}\n\n"
            f"# Concrete Statement\n"
        )
    else:
        prompt = (
            f"会話文中のある発言を具体的に言い換えます。\n2人の会話文が入力された後に、言い換えの対象となる発言が指定されます。\n"
            f"指定された発言を、会話文中の言葉を使ってより具体的に言い換えてください。\n"
            f"もし指示語が含まれていたら必ず会話文中の言葉で言い換えてください。\n"
            f"# 会話文\n"
            f"{joined_dialogue}\n\n"
            f"# 言い換える発言\n"
            f"{sentence}\n\n"
            f"# 具体的な発言\n"
        )

    return prompt
