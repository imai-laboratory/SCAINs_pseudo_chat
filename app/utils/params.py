class DefaultParams:
    def __init__(self):
        self.GPT_MODEL = "gpt-4o-mini"
        self.GPT_MODEL_EMBEDDING = "text-embedding-ada-002"
        self.MAX_OUTPUT_TOKENS = 200
        self.TEMPERATURE = 0
        self.STOP_WORDS = "\n"
        self.SCAIN_THRESHOLD = 0.90
        self.RELATIVE_POSITION = 4
        self.SPEAKERS = ["user: "]  # 基本的にはuserのみ
        return
