from numpy import dot
from numpy.linalg import norm


def cosine_similarity(vector1, vector2):
    return dot(vector1, vector2)/(norm(vector1)*norm(vector2))

def join_dialogue(dialogue):
    return "\n".join([f"{entry['person']}: {entry['content']}" for entry in dialogue])