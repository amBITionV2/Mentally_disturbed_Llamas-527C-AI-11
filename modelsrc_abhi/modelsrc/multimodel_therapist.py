# sunny_cli_manual.py

import os
import json
import warnings
from typing import List

from dotenv import load_dotenv

# LangChain imports - MODERN LCEL
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document

# Speech
import pyttsx3

# ---------- Environment & Warnings ----------
os.environ["TOKENIZERS_PARALLELISM"] = "false"
warnings.filterwarnings("ignore")
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ---------- Constants ----------
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
# Resolve paths relative to this file so it works no matter the CWD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "combined_dataset_fixed.json")
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "faiss_index")
MODEL_NAME = "llama-3.1-8b-instant"

# ---------- Prompt ----------
prompt_template = """
You are "Sunny", a compassionate, empathetic, and non-judgmental virtual therapist.
Treat the dialogue as a real, human-like therapy session.

You receive sensor and facial data that reflect the user's emotional and physical state. 
Use this data to gently acknowledge their condition before proceeding to your response.

Context from similar past sessions:
{context}

User emotional and physiological parameters:
{parameters}

User message:
{query}

Sunny:
1. Begin by empathetically acknowledging the user's current state based on their parameters (mood, stress, fatigue, and recovery).
   - For example:
     - If mood = sad and stress is high → "I can sense you're feeling low and a bit stressed right now."
     - If fatigue is high but recovery is improving → "It seems you've been tired lately, but you're slowly getting back on track."
   - Keep it natural and warm — not robotic.

2. Then, interpret and respond to the user's message ({query}) thoughtfully and conversationally.
   - Offer emotional validation.
   - Ask gentle, open-ended questions if appropriate.
   - Provide coping suggestions or reflections related to their context.

3. Keep the tone warm, conversational, and human-like — like a supportive therapist who genuinely cares.
"""


prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "query", "parameters"]
)

# ---------- Data & Index Utilities ----------
def load_json_data(filepath: str) -> List[Document]:
    with open(filepath, "r") as f:
        data = json.load(f)
    docs: List[Document] = []
    for i, row in enumerate(data):
        content = row.get("text", json.dumps(row))
        docs.append(Document(page_content=content, metadata={"id": i}))
    return docs


def build_faiss_index(docs: List[Document]):
    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)
    return vectorstore


def load_faiss_index():
    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    return FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)


# ---------- LLM + Retrieval with LCEL ----------
def get_custom_chain(vectorstore):
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name=MODEL_NAME,
    )
    
    # Modern LCEL chain
    chain = prompt | llm | StrOutputParser()

    def run(query: str, parameters: dict, context: str):
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        docs = retriever.invoke(query)
        retrieved_context = "\n\n".join([d.page_content for d in docs])
        
        return chain.invoke({
            "query": query,
            "parameters": json.dumps(parameters),
            "context": retrieved_context or context
        })

    return run


# ---------- FastAPI Integration Helper ----------
_THERAPIST_CHAIN = None

def _ensure_chain():
    """Lazy-initialize and cache the therapist chain with FAISS retriever.

    This avoids reloading the vector store and model on every request.
    """
    global _THERAPIST_CHAIN
    if _THERAPIST_CHAIN is not None:
        return _THERAPIST_CHAIN

    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY missing. Set it in environment or .env")

    if os.path.exists(FAISS_INDEX_PATH):
        vs = load_faiss_index()
    else:
        docs = load_json_data(DATA_PATH)
        vs = build_faiss_index(docs)

    _THERAPIST_CHAIN = get_custom_chain(vs)
    return _THERAPIST_CHAIN


def get_therapist_response(query: str, stress: float, mood: str, fatigue: float, recovery: float, fer_mood: str) -> str:
    """Public function used by the FastAPI app to get a therapist-style response.

    Args:
        query: User's input message/question.
        stress: Stress level as float.
        mood: Self-reported mood label.
        fatigue: Fatigue level as float.
        recovery: Recovery level as float.
        fer_mood: Facial emotion recognition mood label.

    Returns:
        The model-generated therapist response as a string.
    """
    chain = _ensure_chain()

    parameters = {
        "mood": mood,
        "fatigue": float(fatigue),
        "recovery": float(recovery),
        "stress": float(stress),
        "fer_mood": fer_mood,
    }

    # Context can be replaced with conversation history if available
    context = "[]"
    return chain(query, parameters, context)


# ---------- Main CLI ----------
def main():
    if not GROQ_API_KEY:
        print("GROQ_API_KEY missing. Set it in .env first.")
        return

    # Load or build vectorstore
    if os.path.exists(FAISS_INDEX_PATH):
        vs = load_faiss_index()
    else:
        docs = load_json_data(DATA_PATH)
        vs = build_faiss_index(docs)

    # Create custom chain
    chain = get_custom_chain(vs)

    # Manual parameters
    print("Enter your parameters (values 0-1 for numbers):")
    mood_val = float(input("Mood (0-1): "))
    fatigue = float(input("Fatigue (0-1): "))
    recovery = float(input("Recovery (0-1): "))
    stress = float(input("Stress (0-1): "))
    fer_mood = input("FER Mood (happy/sad/neutral): ").strip().lower()

    parameters = {
        "mood_val": mood_val,
        "fatigue": fatigue,
        "recovery": recovery,
        "stress": stress,
        "fer_mood": fer_mood
    }

    context = "[]"  # Placeholder

    print("\nType your messages to Sunny. Type 'exit' to quit.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Ending session. Take care!")
            break

        reply = chain(user_input, parameters, context)
        print(f"Sunny: {reply}\n")


if __name__ == "__main__":
    main()