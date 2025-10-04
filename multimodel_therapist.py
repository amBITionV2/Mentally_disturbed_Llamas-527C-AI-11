# sunny_cli_manual.py

import os
import json
import warnings
from typing import List

from dotenv import load_dotenv

# LangChain imports
from langchain_groq.chat_models import ChatGroq
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema import Document

# Speech
import pyttsx3

# ---------- Environment & Warnings ----------
os.environ["TOKENIZERS_PARALLELISM"] = "false"
warnings.filterwarnings("ignore")
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ---------- Constants ----------
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DATA_PATH = "combined_dataset_fixed.json"
FAISS_INDEX_PATH = "faiss_index"
MODEL_NAME = "llama-3.1-8b-instant"

# ---------- Prompt ----------
prompt_template = """
You are "Sunny", a compassionate, empathetic, and non-judgmental virtual therapist.
Treat the dialogue as a real, human-like therapy session.

You receive sensor and facial data that reflect the user’s emotional and physical state. 
Use this data to gently acknowledge their condition before proceeding to your response.

Context from similar past sessions:
{context}

User emotional and physiological parameters:
{parameters}

User message:
{query}

Sunny:
1. Begin by empathetically acknowledging the user’s current state based on their parameters (mood, stress, fatigue, and recovery).
   - For example:
     - If mood = sad and stress is high → “I can sense you’re feeling low and a bit stressed right now.”
     - If fatigue is high but recovery is improving → “It seems you’ve been tired lately, but you’re slowly getting back on track.”
   - Keep it natural and warm — not robotic.

2. Then, interpret and respond to the user’s message ({query}) thoughtfully and conversationally.
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


# ---------- LLM + Retrieval Manually Combined ----------
def get_custom_chain(vectorstore):
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name=MODEL_NAME,
    )
    chain = LLMChain(
        llm=llm,
        prompt=prompt
    )

    def run(query: str, parameters: dict, context: str):
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        docs = retriever.get_relevant_documents(query)
        retrieved_context = "\n\n".join([d.page_content for d in docs])
        return chain.run(
            query=query,
            parameters=json.dumps(parameters),
            context=retrieved_context or context
        )

    return run


# ---------- Speech ----------
def speak_text(text: str):
    try:
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"[Warning] Unable to speak text: {e}")


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

        speak_option = input("Do you want Sunny to speak the reply? (y/n): ").strip().lower()
        if speak_option == "y":
            speak_text(reply)


if __name__ == "__main__":
    main()
