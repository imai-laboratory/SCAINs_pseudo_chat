import os
import datetime
import json
import ast
import re
from time import sleep
from unittest import result
import openai
import logging
import prompts
import utils
import time

openai.api_key = os.getenv("OPENAI_API_KEY")

logging.basicConfig(format = '%(asctime)s - %(levelname)s - %(name)s -   %(message)s',
                    datefmt = '%m/%d/%Y %H:%M:%S',
                    level = logging.DEBUG)
logger = logging.getLogger(__name__)

class Extractor():
    def __init__(self, params, encoding, dialogue, dialogue_id):
        self.params = params
        self.encoding = encoding
        self.dialogue = dialogue
        self.dialogue_id = dialogue_id
        self.results = []
        self.n_total_token = 0
        return

    def openai_api_completion(self, prompt):
        params = self.params
        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            completion = openai.ChatCompletion.create(
                model=params.GPT_MODEL_COMPLETION,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=params.MAX_TOKENS,
                temperature=params.TEMPERATURE,
                stop=params.STOP_WORDS
            )
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            completion = openai.Completion.create(
                model=params.GPT_MODEL_COMPLETION,
                prompt=prompt,
                max_tokens=params.MAX_TOKENS,
                temperature=params.TEMPERATURE,
                stop=params.STOP_WORDS
            )
        else:
            logger.error("GPT model name is inappropriate")
            exit()

        # Save log
        dt_now = datetime.datetime.now()
        log_filename = "./log/" + dt_now.strftime("%Y%m%d_%H%M%S") + ".txt"
        dict_log = {"prompt": prompt}
        dict_log.update(completion)
        json_log = json.dumps(dict_log, indent=4, ensure_ascii=False)
        with open(log_filename, "w") as f:
            f.write(json_log)

        return completion

class SCAINExtractor(Extractor):
    def extract(self):
        for idx, sentence in enumerate(self.dialogue):
            if idx <= 2:
                continue
            full_dialogue = self.dialogue[:idx+1]
            logger.debug("------ full dialogue: ")
            logger.debug(full_dialogue)
            omitted_dialogue = self.dialogue[:idx-2] + self.dialogue[idx:idx+1]
            #知識文の挿入
            #omitted_dialogue = self.dialogue[:idx-2] + self.summary(self.dialogue[idx-2:idx]) + self.dialogue[idx:idx+1]
            logger.debug("------ ommited dialogue: ")
            logger.debug(omitted_dialogue)
            core_sentence = sentence
            for speaker in self.params.SPEAKERS:
                core_sentence = core_sentence.removeprefix(speaker)
            logger.debug("------ core sentence: ")
            logger.debug(core_sentence)
            # time.sleep(3)
            full_summary = self.rephrasing(full_dialogue, core_sentence)
            logger.debug("------ full summary: ")
            logger.debug(full_summary)
            # time.sleep(3)
            omitted_summary = self.rephrasing(omitted_dialogue, core_sentence)
            logger.debug("------ omitted summary: ")
            logger.debug(omitted_summary)

            similarity = self.calc_similarity(full_summary, omitted_summary)
            result = [self.dialogue_id, idx, full_summary, omitted_summary, similarity]
            self.results.append(result)

        return self.n_total_token

    # D-SCAINs
    def distance_extract(self):
        relative_position = 4
        row = 6
        self.results.append([self.dialogue_id])
        for idx, sentence in enumerate(self.dialogue):
            if idx <= row - 2:
                continue
            full_dialogue = self.dialogue[:idx+1]
            logger.debug("------ full dialogue: ")
            logger.debug(full_dialogue)
            core_sentence = sentence
            for speaker in self.params.SPEAKERS:
                core_sentence = core_sentence.removeprefix(speaker)
            logger.debug("------ core sentence: ")
            logger.debug(core_sentence)
            full_summary = self.rephrasing(full_dialogue, core_sentence)
            logger.debug("------ full summary: ")
            logger.debug(full_summary)

            min_similarity_index = -1
            min_similarity = 10000
            for j in range(relative_position):
                omitted_dialogue = self.dialogue[:idx-j-2] + self.dialogue[idx-j:idx+1]
                logger.debug("------ ommited dialogue: ")
                logger.debug(omitted_dialogue)
                omitted_summary = self.rephrasing(omitted_dialogue, core_sentence)
                logger.debug("------ omitted summary: ")
                logger.debug(omitted_summary)
                similarity = self.calc_similarity(full_summary, omitted_summary)
                result = [self.dialogue_id, idx+1, full_summary, omitted_summary, similarity]
                self.results.append(result)
                time.sleep(3)

            #     if similarity < min_similarity:
            #         min_similarity = similarity
            #         min_similarity_index = j
            #
            # omitted_dialogue = self.dialogue[:idx - min_similarity_index - 2] + self.dialogue[idx - min_similarity_index:idx + 1]
            # result = ["相対位置：" + str(min_similarity_index + 1), idx + 1, full_summary, omitted_summary, min_similarity]
            # self.results.append(result)
            #
            # if min_similarity < 0.90:
            #     opinion_in_omitted = ["omitted_op: ", self.opinon(omitted_dialogue, core_sentence)]
            #     opinion_in_full = ["full_op: ", self.opinon(full_dialogue, core_sentence)]
            #     self.results.append(opinion_in_omitted)
            #     self.results.append(opinion_in_full)

        return self.n_total_token

    def rephrasing(self, dialogue, sentence):
        # time.sleep(3)
        params = self.params

        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            prompt = prompts.rephrase_chat_ja(dialogue, sentence)
            #prompt = prompts.rephrase_chat_en(dialogue, sentence)
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            prompt = prompts.summary_comp_ja(dialogue, sentence)
        else:
            logger.error("GPT model name is inappropriate")
            exit()

        if params.USE_DUMMY == 1:
            response = utils.dummy_completion(prompt, encoding=self.encoding)
        else:
            response = self.openai_api_completion(prompt)

        total_tokens = response.get("usage").get("total_tokens")
        self.n_total_token += total_tokens

        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            rephrased_statement = response.get("choices")[0].get("message").get("content")
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            rephrased_statement = response.get("choices")[0].get("text")
        else:
            logger.error("GPT model name is inappropriate")
            exit()

        return rephrased_statement

    def summary(self, dialogue):
        # time.sleep(3)
        params = self.params

        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            prompt = prompts.summary_ja(dialogue)
            #prompt = prompts.rephrase_chat_en(dialogue, sentence)
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            prompt = prompts.summary_ja(dialogue)
        else:
            logger.error("GPT model name is inappropriate")
            exit()

        if params.USE_DUMMY == 1:
            response = utils.dummy_completion(prompt, encoding=self.encoding)
        else:
            response = self.openai_api_completion(prompt)

        total_tokens = response.get("usage").get("total_tokens")
        self.n_total_token += total_tokens

        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            summary_statement = response.get("choices")[0].get("message").get("content")
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            summary_statement = response.get("choices")[0].get("text")
        else:
            logger.error("GPT model name is inappropriate")
            exit()
        summary=[]
        summary.append(summary_statement)
        return summary

    # ToDo: GPT呼び出しの本当は関数統一したい
    # 3人目のGPTが発言する
    def opinon(self, dialogue, sentence):
        # time.sleep(3)
        params = self.params

        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            prompt = prompts.add_opinion_ja(dialogue, sentence)
            #prompt = prompts.rephrase_chat_en(dialogue, sentence)
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            prompt = prompts.add_opinion_ja(dialogue, sentence)
        else:
            logger.error("GPT model name is inappropriate")
            exit()

        if params.USE_DUMMY == 1:
            response = utils.dummy_completion(prompt, encoding=self.encoding)
        else:
            response = self.openai_api_completion(prompt)

        total_tokens = response.get("usage").get("total_tokens")
        self.n_total_token += total_tokens

        if params.GPT_MODEL_COMPLETION == "gpt-3.5-turbo":
            opinion = response.get("choices")[0].get("message").get("content")
        elif params.GPT_MODEL_COMPLETION == "text-davinci-003":
            opinion = response.get("choices")[0].get("text")
        else:
            logger.error("GPT model name is inappropriate")
            exit()

        return opinion

    def calc_similarity(self, sentence1, sentence2):
        params = self.params

        if params.USE_DUMMY == 1:
            similarity = 1
        else:
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

class ImportantExtractor(Extractor):
    def evaluate(self):
        important_sentences = self.detect_important_sentences(self.dialogue)
        result = [self.dialogue_id] + important_sentences # [self.dialogue_id, important_sentence_id[1], important_sentence_id[2]]
        self.results.append(result)
        return self.n_total_token

    def detect_important_sentences(self, dialogue):
        params = self.params
        prompt = prompts.important_chat_ja(dialogue)

        if params.USE_DUMMY == 1:
            response = utils.dummy_completion(prompt, encoding=self.encoding)
        else:
            response = self.openai_api_completion(prompt)

        total_tokens = response.get("usage").get("total_tokens")
        self.n_total_token += total_tokens
        important_sentences_str = response.get("choices")[0].get("message").get("content")
        important_sentences_list = list(ast.literal_eval(important_sentences_str))
        return important_sentences_list