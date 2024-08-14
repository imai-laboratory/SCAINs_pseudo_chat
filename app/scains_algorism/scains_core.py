import concurrent
import concurrent.futures as futures

import openai

import app.utils.prompt as prompts
import app.utils.utils as utils
from app.utils.params import DefaultParams


class ScainsCore:
    def __init__(self, dialogue):
        self.params = DefaultParams()
        self.dialogue = dialogue
        self.results = {}
        return

    def openai_api_completion(self, prompt):
        params = self.params
        completion = openai.ChatCompletion.create(
            model=params.GPT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=params.MAX_OUTPUT_TOKENS,
            temperature=params.TEMPERATURE,
            stop=params.STOP_WORDS
        )

        return completion


class SCAINExtractor(ScainsCore):
    # D-SCAINs
    def distance_extract(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            full_dialogue = self.dialogue
            core_sentence = None
            full_dialogue_idx = len(self.dialogue)
            print("full_dialogue_idx:", full_dialogue_idx)
            for speaker in self.params.SPEAKERS:
                if self.dialogue[-1].startswith(speaker):
                    core_sentence = self.dialogue[-1].removeprefix(speaker)
                    break
            print("core_sentence", core_sentence)
            full_summary = self.rephrasing(full_dialogue, core_sentence)
            print("full_summary", full_summary)
            # 並列処理で省略されたダイアログを処理
            for j in range(self.params.RELATIVE_POSITION):
                omitted_dialogue = self.dialogue[:- j - 3] + self.dialogue[-1 - j:]
                futures.append(
                    executor.submit(self.process_omitted_dialogue, full_dialogue_idx, j, full_summary, omitted_dialogue, core_sentence)
                )

            scains_indexes = []

            # 並列処理の結果を取得
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                if result is not None:
                    scains_indexes.extend(result)
            scains_indexes = sorted(set(scains_indexes), reverse=False)

            if not scains_indexes:
                return None

            return {
                "core_index": full_dialogue_idx,
                "scains_index": scains_indexes
            }

    def rephrasing(self, dialogue, sentence):
        prompt = prompts.rephrase_chat_ja(dialogue, sentence)
        response = self.openai_api_completion(prompt)
        rephrased_statement = response.get("choices")[0].get("message").get("content")

        return rephrased_statement

    def process_omitted_dialogue(self, full_dialogue_idx, idx, full_summary, omitted_dialogue, core_sentence):
        omitted_summary = self.rephrasing(omitted_dialogue, core_sentence)
        similarity = self.calc_similarity(full_summary, omitted_summary)
        print("omitted_summary", omitted_summary)
        print("similarity", similarity)
        if similarity < self.params.SCAIN_THRESHOLD:
            return [full_dialogue_idx - idx - 2, full_dialogue_idx - idx - 1]

        return None

    def calc_similarity(self, sentence1, sentence2):
        params = self.params

        embedding1 = openai.Embedding.create(
            input=sentence1,
            model=params.GPT_MODEL_EMBEDDING
        )["data"][0]["embedding"]
        embedding2 = openai.Embedding.create(
            input=sentence2,
            model=params.GPT_MODEL_EMBEDDING
        )["data"][0]["embedding"]
        similarity = utils.cosine_similarity(embedding1, embedding2)

        return similarity
