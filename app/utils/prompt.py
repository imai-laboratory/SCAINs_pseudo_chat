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


def topic11(dialogue, agent, language='ja', prompt_variations=None):
    if language == 'en':
        if prompt_variations is None:
            prompt_variations = [
                "Please provide a new perspective related to the current topic.",
                "Add a different opinion or viewpoint to deepen the discussion based on the previous conversation.",
                "Present a unique perspective or new idea related to the current theme.",
                "Contribute to the discussion by offering a slightly different viewpoint."
            ]

        selected_variation = random.choice(prompt_variations)
        joined_dialogue = join_dialogue(dialogue)

        prompt = (f"The conversation is about the following topic:\n\nTopic: "
                  f"\"Why do you think a man in a hoodie is talking to a man holding a pipe?\"\n"
                  f"{selected_variation}\n\nDialogue:\n{joined_dialogue}\n\n"
                  f"As {agent}, please make a concise statement in one sentence.")
    else:
        if prompt_variations is None:
            prompt_variations = [
                "今の話題に関連する新たな視点を提供してください。",
                "これまでの会話に異なる意見や視点を追加して、議論を深めるように発言してください。",
                "今のテーマに関するユニークな観点や新しいアイデアを提示してください。",
                "議論を発展させるために、少し異なる視点から発言を行ってください。"
            ]

        selected_variation = random.choice(prompt_variations)
        joined_dialogue = join_dialogue(dialogue)

        prompt = (f"入力された画像に対して、以下のテーマに沿って議論しています。\n\n テーマ: "
                  f"「なぜフード付きのスウェットシャツを着た男性とパイプを持った男性が話していると思いますか？」\n"
                  f"{selected_variation}\n\n会話文：\n{joined_dialogue}\n\n"
                  f"{agent}として1文程度で簡潔に発言をしてください。")

    return prompt


def rephrase_chat(dialogue, sentence, language='ja'):
    joined_dialogue = "\n".join(dialogue)

    if language == 'en':
        prompt = (
            f"Rephrase a particular statement in a dialogue into a more specific statement.\n"
            f"A dialogue between two speakers is written and one of the statements is assigned to be rephrased.\n"
            f"Rephrase the assigned statement into a more specific statement using the words in the dialogue.\n\n"
            f"# Dialogue\n{joined_dialogue}\n\n"
            f"# Statement to be rephrased\n"
            f"{sentence}\n\n"
            f"# rephrased statement\n"
        )
    else:
        prompt = (
            f"会話文中のある発言を具体的に言い換えます．\n2人の会話文が入力された後に，言い換えの対象となる発言が指定されます．\n"
            f"指定された発言を，会話文中の言葉を使って指示語を含まないようにより具体的に言い換えます．\n\n# 会話文\n{joined_dialogue}\n\n# 言い換える発言\n"
            f"{sentence}\n\n# 具体的な発言\n"
        )

    return prompt
