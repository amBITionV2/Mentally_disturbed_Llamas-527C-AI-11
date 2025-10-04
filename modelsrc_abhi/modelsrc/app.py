from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
import logging

# Import the core functions from existing modules
# Ensure these files exist in the same directory as this app file:
# - multimodel_therapist.py with get_therapist_response(...)
# - multimodel_friend.py with get_friend_response(...)
from modelsrc.multimodel_therapist import get_therapist_response
from modelsrc.multimodel_friend import get_friend_response

# ------------------------------------------------------------------------------
# App Initialization and Configuration
# ------------------------------------------------------------------------------

# Create FastAPI app instance
app = FastAPI(title="Multi-Model Chat API", version="1.0.0")

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("multi_model_chat_api")


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


# ------------------------------------------------------------------------------
# Run Instructions
# ------------------------------------------------------------------------------
# Save this file as app.py (or ensure the module is named 'app' exposing 'app' variable).
# Then run the server with:
#   uvicorn app:app --reload
#
# The server will expose:
# - GET  /health
# - POST /therapist
# - POST /friend
