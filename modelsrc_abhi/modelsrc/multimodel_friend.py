import os
import json
import warnings
from typing import List

from dotenv import load_dotenv
from langchain_groq.chat_models import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# ---------- Environment & Warnings ----------
os.environ["TOKENIZERS_PARALLELISM"] = "false"
warnings.filterwarnings("ignore")
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ---------- Constants ----------
MODEL_NAME = "llama-3.1-8b-instant"

# ---------- Prompt Template ----------
prompt_template = """
You are "{friend_name}", the user's emotionally intelligent best friend. 
Your primary mission is to make the user feel truly *seen*, *heard*, and *understood*. 
You respond with warmth, empathy, humor, and authenticity — like a best friend who can handle laughter, tears, rants, and vulnerable truths.

### Mode
The user has selected the **{mode}** mode. 
This defines your vibe and style for this conversation:
- **Caring**: gentle, nurturing, patient, validating feelings.
- **Chill**: casual, relaxed, “hang out” vibes, less formal.
- **Flirty**: playful, light teasing, but respectful and supportive.
- **Funny**: lots of humor, jokes, memes, light-hearted responses.
- **Deep**: thoughtful, introspective, soulful conversations.
- **Hype**: uplifting, motivational, full of positive energy.
- **Real Talk**: brutally honest but still kind and supportive.

Adapt your tone, language, and energy to match the selected mode naturally.

### Core Principles
- Always sound human, warm, and approachable — not like a robot or therapist.
- Validate emotions first before responding or giving advice.
- Don’t lecture; keep the conversation flowing like a natural chat.
- Use occasional emojis, casual language, or humor where appropriate.
- Ask open-ended questions to invite the user to open up.
- Share comforting or relatable thoughts to make the user feel less alone.
- Respect boundaries and keep it safe, supportive, and fun.

### Conversation History
Below is the ongoing chat between you and the user. Continue the conversation naturally, staying in character and maintaining emotional continuity.

{context}

User: {query}

{friend_name}:
"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["query", "mode", "friend_name", "context"]
)

# ---------- Initialize LLM ----------
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name=MODEL_NAME,
)

chain = LLMChain(llm=llm, prompt=prompt)

# ---------- FastAPI Integration Helper ----------
_FRIEND_CHAIN = chain if GROQ_API_KEY else None

def _ensure_friend_chain():
    """Lazy-initialize and cache the friend chain.

    This avoids re-creating the model on every request.
    """
    global _FRIEND_CHAIN
    if _FRIEND_CHAIN is not None:
        return _FRIEND_CHAIN

    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY missing. Set it in environment or .env")

    friend_llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name=MODEL_NAME,
    )
    _FRIEND_CHAIN = LLMChain(llm=friend_llm, prompt=prompt)
    return _FRIEND_CHAIN


def get_friend_response(query: str, mode: str, friend_name: str) -> str:
    """Public function used by the FastAPI app to get a best-friend style response.

    Args:
        query: User's input message/question.
        mode: Conversation mode determining tone/style.
        friend_name: Persona name of the AI friend.

    Returns:
        The model-generated friend response as a string.
    """
    friend_chain = _ensure_friend_chain()

    formatted = prompt.format(
        query=query,
        mode=mode,
        friend_name=friend_name,
        context="",
    )

    # Use underlying LLM directly for the pre-rendered prompt
    response = friend_chain.llm.invoke(formatted)
    return response.content.strip()

# ---------- Main CLI ----------
def main():
    if not GROQ_API_KEY:
        print("❌ GROQ_API_KEY missing. Set it in .env first.")
        return

    print("\n🌞 Welcome to your AI best friend chat!\n")
    friend_name = input("Enter your best friend's name (e.g., Sunny, Alex): ").strip() or "Sunny"

    print("\nChoose a mode for your friend:")
    print("1. Caring\n2. Chill\n3. Flirty\n4. Funny\n5. Deep\n6. Hype\n7. Real Talk")
    mode_choice = input("Enter your choice (1-7): ").strip()
    mode_map = {
        "1": "Caring", "2": "Chill", "3": "Flirty",
        "4": "Funny", "5": "Deep", "6": "Hype", "7": "Real Talk"
    }
    mode = mode_map.get(mode_choice, "Caring")

    print(f"\nYou're now chatting with {friend_name} ({mode} mode). Type 'exit' to end.\n")

    context = ""  # Stores all previous messages

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print(f"\n{friend_name}: Aww, okay. I'm really glad we talked today. Take care, okay? 🧡\n")
            break

        # Combine conversation context
        formatted_prompt = prompt.format(
            query=user_input,
            mode=mode,
            friend_name=friend_name,
            context=context
        )

        try:
            response = llm.invoke(formatted_prompt)
            reply = response.content.strip()
        except Exception as e:
            print(f"⚠️ Error from model: {e}")
            continue

        print(f"{friend_name}: {reply}\n")

        # Append both sides to context
        context += f"User: {user_input}\n{friend_name}: {reply}\n"

if __name__ == "__main__":
    main()
