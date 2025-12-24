# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, Field
# from typing import Literal
# import logging

# # Import the core functions from existing modules
# # Ensure these files exist in the same directory as this app file:
# # - multimodel_therapist.py with get_therapist_response(...)
# # - multimodel_friend.py with get_friend_response(...)
# from multimodel_therapist import get_therapist_response
# from multimodel_friend import get_friend_response

# # ------------------------------------------------------------------------------
# # App Initialization and Configuration
# # ------------------------------------------------------------------------------

# # Create FastAPI app instance
# app = FastAPI(title="Multi-Model Chat API", version="1.0.0")

# # Configure basic logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("multi_model_chat_api")


# # ------------------------------------------------------------------------------
# # Request Models (Pydantic)
# # ------------------------------------------------------------------------------

# class TherapistRequest(BaseModel):
#     """
#     Request schema for /therapist endpoint.
#     """
#     query: str = Field(..., description="User's input message or question")
#     stress: float = Field(..., ge=0.0, description="Stress level as a float (e.g., 0.0 to 1.0 or any chosen scale)")
#     mood: str = Field(..., description="Self-reported mood (string label)")
#     fatigue: float = Field(..., ge=0.0, description="Fatigue level as a float")
#     recovery: float = Field(..., ge=0.0, description="Recovery level as a float")
#     fer_mood: str = Field(..., description="Facial emotion recognition mood label")


# class FriendRequest(BaseModel):
#     """
#     Request schema for /friend endpoint.
#     """
#     query: str = Field(..., description="User's input message or question")
#     mode: str = Field(..., description="Friend reply mode (e.g., casual, supportive, tough-love)")
#     friend_name: str = Field(..., description="Name of the friend persona")


# # ------------------------------------------------------------------------------
# # Health Check
# # ------------------------------------------------------------------------------

# @app.get("/health")
# def health():
#     """
#     Lightweight health probe for liveness/readiness checks.
#     """
#     return {"status": "ok"}


# # ------------------------------------------------------------------------------
# # API Endpoints
# # ------------------------------------------------------------------------------

# @app.post("/therapist")
# def therapist_endpoint(payload: TherapistRequest):
#     """
#     Wraps multimodel_therapist.get_therapist_response to produce a therapist-style response.

#     Request JSON:
#     {
#       "query": str,
#       "stress": float,
#       "mood": str,
#       "fatigue": float,
#       "recovery": float,
#       "fer_mood": str
#     }

#     Response JSON:
#     {
#       "response": str
#     }
#     """
#     try:
#         logger.info("Received /therapist request")
#         response_text = get_therapist_response(
#             query=payload.query,
#             stress=payload.stress,
#             mood=payload.mood,
#             fatigue=payload.fatigue,
#             recovery=payload.recovery,
#             fer_mood=payload.fer_mood,
#         )
#         return {"response": response_text}
#     except Exception as e:
#         # Log full traceback for debugging, return sanitised message to client
#         logger.exception("Error in /therapist endpoint")
#         raise HTTPException(status_code=500, detail=f"Therapist generation failed: {str(e)}")


# @app.post("/friend")
# def friend_endpoint(payload: FriendRequest):
#     """
#     Wraps multimodel_friend.get_friend_response to produce a best-friend style response.

#     Request JSON:
#     {
#       "query": str,
#       "mode": str,
#       "friend_name": str
#     }

#     Response JSON:
#     {
#       "response": str
#     }
#     """
#     try:
#         logger.info("Received /friend request")
#         response_text = get_friend_response(
#             query=payload.query,
#             mode=payload.mode,
#             friend_name=payload.friend_name,
#         )
#         return {"response": response_text}
#     except Exception as e:
#         # Log full traceback for debugging, return sanitised message to client
#         logger.exception("Error in /friend endpoint")
#         raise HTTPException(status_code=500, detail=f"Friend generation failed: {str(e)}")


# # ------------------------------------------------------------------------------
# # Run Instructions
# # ------------------------------------------------------------------------------
# # Save this file as app.py (or ensure the module is named 'app' exposing 'app' variable).
# # Then run the server with:
# #   uvicorn app:app --reload
# #
# # The server will expose:
# # - GET  /health
# # - POST /therapist
# # - POST /friend







#################################################################################3






from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict
import logging
import re

# Import the core functions from existing modules
# Ensure these files exist in the same directory as this app file:
# - multimodel_therapist.py with get_therapist_response(...)
# - multimodel_friend.py with get_friend_response(...)
from multimodel_therapist import get_therapist_response
from multimodel_friend import get_friend_response

# ------------------------------------------------------------------------------
# App Initialization and Configuration
# ------------------------------------------------------------------------------

# Create FastAPI app instance
app = FastAPI(title="Multi-Model Chat API", version="2.0.0")

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("multi_model_chat_api")

# ------------------------------------------------------------------------------
# Global Memory Store for Session Context
# ------------------------------------------------------------------------------

session_memory: Dict[str, any] = {
    "last_therapist_suggestion": None,
    "last_user_message": None,
    "completed_checklist_items": [],
    "conversation_history": [],
    "therapist_checklist": [],
}


# ------------------------------------------------------------------------------
# Request Models (Pydantic)
# ------------------------------------------------------------------------------

class TherapistRequest(BaseModel):
    """
    Request schema for /therapist endpoint.
    """
    query: str = Field(..., description="User's input message or question")
    stress: float = Field(..., ge=0.0, description="Stress level as a float (e.g., 0.0 to 1.0 or any chosen scale)")
    mood: str = Field(..., description="Self-reported mood (string label)")
    fatigue: float = Field(..., ge=0.0, description="Fatigue level as a float")
    recovery: float = Field(..., ge=0.0, description="Recovery level as a float")
    fer_mood: str = Field(..., description="Facial emotion recognition mood label")


class FriendRequest(BaseModel):
    """
    Request schema for /friend endpoint.
    """
    query: str = Field(..., description="User's input message or question")
    mode: str = Field(..., description="Friend reply mode (e.g., casual, supportive, tough-love)")
    friend_name: str = Field(..., description="Name of the friend persona")


class SessionRequest(BaseModel):
    """
    Request schema for /session endpoint - agent collaboration workflow.
    """
    query: str = Field(..., description="User's input message or question")
    stress: float = Field(..., ge=0.0, description="Stress level as a float")
    mood: str = Field(..., description="Self-reported mood (string label)")
    fatigue: float = Field(..., ge=0.0, description="Fatigue level as a float")
    recovery: float = Field(..., ge=0.0, description="Recovery level as a float")
    fer_mood: str = Field(..., description="Facial emotion recognition mood label")
    friend_name: str = Field(default="Alex", description="Name of the friend persona")
    friend_mode: str = Field(default="supportive", description="Friend reply mode")


# ------------------------------------------------------------------------------
# Helper Functions
# ------------------------------------------------------------------------------

def extract_checklist(therapist_response: str) -> List[str]:
    """
    Extract checklist items from therapist response.
    Looks for numbered lists, bullet points, or action items.
    """
    checklist = []
    
    # Pattern 1: Numbered lists (1. item, 2. item)
    numbered_pattern = r'^\s*\d+[\.)]\s*(.+)$'
    
    # Pattern 2: Bullet points (- item, * item, • item)
    bullet_pattern = r'^\s*[-*•]\s*(.+)$'
    
    # Pattern 3: Action items or suggestions
    action_keywords = ['try', 'practice', 'consider', 'focus on', 'take time', 'engage in']
    
    lines = therapist_response.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check numbered lists
        numbered_match = re.match(numbered_pattern, line, re.MULTILINE)
        if numbered_match:
            checklist.append(numbered_match.group(1).strip())
            continue
        
        # Check bullet points
        bullet_match = re.match(bullet_pattern, line, re.MULTILINE)
        if bullet_match:
            checklist.append(bullet_match.group(1).strip())
            continue
        
        # Check for action-oriented sentences
        lower_line = line.lower()
        if any(keyword in lower_line for keyword in action_keywords):
            checklist.append(line)
    
    return checklist[:5]  # Limit to top 5 items


def generate_joint_plan(therapist_response: str, friend_response: str, checklist: List[str]) -> str:
    """
    Generate a coordinated plan combining therapist diagnosis and friend's motivational support.
    """
    plan_parts = []
    
    plan_parts.append("🎯 Your Coordinated Wellbeing Plan:")
    plan_parts.append("")
    
    if checklist:
        plan_parts.append("📋 Action Items:")
        for idx, item in enumerate(checklist, 1):
            plan_parts.append(f"  {idx}. {item}")
        plan_parts.append("")
    
    plan_parts.append("💭 Therapeutic Guidance:")
    plan_parts.append(f"  Your therapist has identified key areas to focus on and provided strategies for emotional regulation and stress management.")
    plan_parts.append("")
    
    plan_parts.append("🤝 Friend Support:")
    plan_parts.append(f"  Your friend is here to check in on your progress, keep you motivated, and provide encouragement as you work through these steps.")
    plan_parts.append("")
    
    plan_parts.append("📊 Next Steps:")
    plan_parts.append("  - Review the therapist's guidance carefully")
    plan_parts.append("  - Start with the first action item")
    plan_parts.append("  - Check in with your friend about your progress")
    plan_parts.append("  - Update us on what's working and what needs adjustment")
    
    return "\n".join(plan_parts)


# ------------------------------------------------------------------------------
# Health Check
# ------------------------------------------------------------------------------

@app.get("/health")
def health():
    """
    Lightweight health probe for liveness/readiness checks.
    """
    return {"status": "ok"}


# ------------------------------------------------------------------------------
# Memory Management Endpoints
# ------------------------------------------------------------------------------

@app.get("/memory")
def get_memory():
    """
    Retrieve current session memory for debugging/monitoring.
    """
    return {
        "last_therapist_suggestion": session_memory.get("last_therapist_suggestion"),
        "last_user_message": session_memory.get("last_user_message"),
        "completed_checklist_items": session_memory.get("completed_checklist_items", []),
        "therapist_checklist": session_memory.get("therapist_checklist", []),
        "conversation_count": len(session_memory.get("conversation_history", []))
    }


@app.post("/memory/reset")
def reset_memory():
    """
    Clear session memory.
    """
    global session_memory
    session_memory = {
        "last_therapist_suggestion": None,
        "last_user_message": None,
        "completed_checklist_items": [],
        "conversation_history": [],
        "therapist_checklist": [],
    }
    return {"status": "memory_reset", "message": "Session memory has been cleared"}


# ------------------------------------------------------------------------------
# API Endpoints
# ------------------------------------------------------------------------------

@app.post("/therapist")
def therapist_endpoint(payload: TherapistRequest):
    """
    Wraps multimodel_therapist.get_therapist_response to produce a therapist-style response.

    Request JSON:
    {
      "query": str,
      "stress": float,
      "mood": str,
      "fatigue": float,
      "recovery": float,
      "fer_mood": str
    }

    Response JSON:
    {
      "response": str
    }
    """
    try:
        logger.info("Received /therapist request")
        response_text = get_therapist_response(
            query=payload.query,
            stress=payload.stress,
            mood=payload.mood,
            fatigue=payload.fatigue,
            recovery=payload.recovery,
            fer_mood=payload.fer_mood,
        )
        return {"response": response_text}
    except Exception as e:
        # Log full traceback for debugging, return sanitised message to client
        logger.exception("Error in /therapist endpoint")
        raise HTTPException(status_code=500, detail=f"Therapist generation failed: {str(e)}")


@app.post("/friend")
def friend_endpoint(payload: FriendRequest):
    """
    Wraps multimodel_friend.get_friend_response to produce a best-friend style response.

    Request JSON:
    {
      "query": str,
      "mode": str,
      "friend_name": str
    }

    Response JSON:
    {
      "response": str
    }
    """
    try:
        logger.info("Received /friend request")
        response_text = get_friend_response(
            query=payload.query,
            mode=payload.mode,
            friend_name=payload.friend_name,
        )
        return {"response": response_text}
    except Exception as e:
        # Log full traceback for debugging, return sanitised message to client
        logger.exception("Error in /friend endpoint")
        raise HTTPException(status_code=500, detail=f"Friend generation failed: {str(e)}")


@app.post("/session")
def session_endpoint(payload: SessionRequest):
    """
    Agent-agent collaboration workflow endpoint.
    
    This endpoint orchestrates interaction between therapist and friend agents:
    1. Therapist provides diagnosis, emotional support, and action items
    2. Friend agent receives therapist's checklist and provides motivational support
    3. Both responses are coordinated into a joint wellbeing plan
    
    Request JSON:
    {
      "query": str,
      "stress": float,
      "mood": str,
      "fatigue": float,
      "recovery": float,
      "fer_mood": str,
      "friend_name": str (optional),
      "friend_mode": str (optional)
    }
    
    Response JSON:
    {
      "therapist": str,
      "friend": str,
      "joint_plan": str,
      "checklist": List[str],
      "session_context": dict
    }
    """
    try:
        logger.info("Received /session request for agent collaboration")
        
        # Update session memory with current user message
        session_memory["last_user_message"] = payload.query
        session_memory["conversation_history"].append({
            "role": "user",
            "message": payload.query,
            "stress": payload.stress,
            "mood": payload.mood,
            "fatigue": payload.fatigue,
            "recovery": payload.recovery,
            "fer_mood": payload.fer_mood
        })
        
        # Step 1: Get therapist response with full context
        logger.info("Step 1: Calling therapist agent")
        therapist_response = get_therapist_response(
            query=payload.query,
            stress=payload.stress,
            mood=payload.mood,
            fatigue=payload.fatigue,
            recovery=payload.recovery,
            fer_mood=payload.fer_mood,
        )
        
        # Step 2: Extract checklist/action items from therapist response
        logger.info("Step 2: Extracting checklist from therapist response")
        checklist = extract_checklist(therapist_response)
        session_memory["therapist_checklist"] = checklist
        session_memory["last_therapist_suggestion"] = therapist_response
        
        # Step 3: Build context for friend agent
        logger.info("Step 3: Building context for friend agent")
        friend_context = f"""Your friend just spoke with a therapist. Here's what the therapist suggested:

{therapist_response}

Key action items the therapist recommended:
"""
        if checklist:
            for idx, item in enumerate(checklist, 1):
                friend_context += f"\n{idx}. {item}"
        else:
            friend_context += "\n(The therapist provided guidance but no specific checklist items)"
        
        friend_context += f"\n\nNow, respond to your friend's original message: '{payload.query}'"
        friend_context += "\n\nYour role is to:"
        friend_context += "\n- Acknowledge what the therapist said"
        friend_context += "\n- Motivate them to follow through on the suggestions"
        friend_context += "\n- Ask about their progress or readiness to start"
        friend_context += "\n- Be supportive, warm, and encouraging"
        friend_context += "\n- Check in on how they're feeling about the plan"
        
        # Step 4: Get friend response with therapist context
        logger.info("Step 4: Calling friend agent with therapist context")
        friend_response = get_friend_response(
            query=friend_context,
            mode=payload.friend_mode,
            friend_name=payload.friend_name,
        )
        
        # Step 5: Generate joint coordinated plan
        logger.info("Step 5: Generating joint plan")
        joint_plan = generate_joint_plan(therapist_response, friend_response, checklist)
        
        # Update conversation history
        session_memory["conversation_history"].append({
            "role": "therapist",
            "message": therapist_response,
            "checklist": checklist
        })
        session_memory["conversation_history"].append({
            "role": "friend",
            "message": friend_response
        })
        
        logger.info("Session collaboration complete")
        
        return {
            "therapist": therapist_response,
            "friend": friend_response,
            "joint_plan": joint_plan,
            "checklist": checklist,
            "session_context": {
                "total_interactions": len(session_memory["conversation_history"]),
                "completed_items": len(session_memory.get("completed_checklist_items", [])),
                "pending_items": len(checklist) - len(session_memory.get("completed_checklist_items", []))
            }
        }
        
    except Exception as e:
        # Log full traceback for debugging, return sanitised message to client
        logger.exception("Error in /session endpoint")
        raise HTTPException(
            status_code=500, 
            detail=f"Session collaboration failed: {str(e)}"
        )


# ------------------------------------------------------------------------------
# Run Instructions
# ------------------------------------------------------------------------------
# Save this file as app.py (or ensure the module is named 'app' exposing 'app' variable).
# Then run the server with:
#   uvicorn app:app --reload
#
# The server will expose:
# - GET  /health
# - GET  /memory
# - POST /memory/reset
# - POST /therapist
# - POST /friend
# - POST /session (NEW - Agent collaboration workflow)