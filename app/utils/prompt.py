import random
from app.utils.utils import join_dialogue

def generate_answer(dialogue, agent):
    try:
        # Ensure each item in the dialogue list is a dictionary with expected keys
        if not all(isinstance(entry, dict) and 'person' in entry and 'content' in entry for entry in dialogue):
            raise ValueError("Each item in dialogue must be a dictionary with 'person' and 'content' keys")

        joined_dialogue = join_dialogue(dialogue)
        prompt = f"以下の会話文に続くように{agent}として1~2文程度で発言をしてください。\n\n会話文：\n{joined_dialogue}"
        return prompt
    except Exception as e:
        print(f"Error generating answer: {e}")
        raise


def topic11(dialogue, agent, prompt_variations=None):
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


def topic11_to_b(dialogue):
    joined_dialogue = join_dialogue(dialogue)
    prompt = (f"以下の会話文に続くようにAさんとして1文程度で簡潔に、Bさんに話を振る発言をしてください。\n"
              f"条件1：「Bさん」という単語は必ず入れてください。\n"
              f"条件2：会話文の話題を突然変えないでください。\n\n"
              f"会話文：\n{joined_dialogue}")
    return prompt


def rephrase_chat_ja(dialogue, sentence):
    joined_dialogue = "\n".join(dialogue)
    prompt = (
        f"会話文中のある発言を具体的に言い換えます．\nAとBの2人の会話文が入力された後に，言い換えの対象となる発言が指定されます．\n"
        f"指定された発言を，会話文中の言葉を使って指示語を含まないようにより具体的に言い換えます．\n\n# 会話文\n{joined_dialogue}\n\n# 言い換える発言\n"
        f"{sentence}\n\n# 具体的な発言\n"
    )
    return prompt
