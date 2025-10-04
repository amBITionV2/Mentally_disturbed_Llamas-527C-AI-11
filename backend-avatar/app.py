import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True)

API_KEY = os.getenv("HEYGEN_API_KEY")
BASE_URL = "https://api.heygen.com/v1/streaming"

if not API_KEY:
    print("WARNING: HEYGEN_API_KEY not found in environment variables!")
else:
    print(f"API Key loaded: {API_KEY[:10]}...")

@app.route("/create_session", methods=["POST"])
def create_session():
    try:
        if not API_KEY:
            return jsonify({"error": "HEYGEN_API_KEY not set in environment variables"}), 500
        
        url = f"{BASE_URL}.new"
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "quality": "high"
        }
        
        print(f"Sending request to: {url}")
        print(f"Payload: {payload}")
        
        response = requests.post(url, headers=headers, json=payload)
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            data = response_data.get("data", {})
            return jsonify({
                "session_id": data.get("session_id"),
                "sdp": data.get("sdp"),
                "access_token": data.get("access_token"),
                "ice_servers": data.get("ice_servers"),
                "ice_servers2": data.get("ice_servers2"),
                "url": data.get("url")
            })
        else:
            return jsonify({
                "error": "Failed to create session",
                "status_code": response.status_code,
                "response_text": response.text
            }), response.status_code
            
    except Exception as e:
        print(f"Exception in create_session: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/start_session", methods=["POST"])
def start_session():
    try:
        data = request.get_json(force=True) or {}
        session_id = data.get("session_id")
        sdp_answer = data.get("sdp")

        if not session_id or not sdp_answer:
            return jsonify({"error": "session_id and sdp are required"}), 400

        url = f"{BASE_URL}.start"
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "session_id": session_id,
            "sdp": {
                "type": "answer",
                "sdp": sdp_answer
            }
        }
        
        print(f"Sending answer to: {url}")
        print(f"Session ID: {session_id}")

        response = requests.post(url, headers=headers, json=payload)
        
        print(f"Start session response status: {response.status_code}")
        print(f"Start session response: {response.text}")
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Failed to start session",
                "status_code": response.status_code,
                "response_text": response.text
            }), response.status_code
            
    except Exception as e:
        print(f"Exception in start_session: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/ice_candidate", methods=["POST"])
def ice_candidate():
    try:
        data = request.get_json(force=True) or {}
        session_id = data.get("session_id")
        candidate = data.get("candidate")

        if not session_id or not candidate:
            return jsonify({"error": "session_id and candidate are required"}), 400

        url = f"{BASE_URL}.ice"
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "session_id": session_id,
            "candidate": candidate
        }

        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Failed to send ICE candidate",
                "status_code": response.status_code,
                "response_text": response.text
            }), response.status_code
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/send_task", methods=["POST"])
def send_task():
    try:
        data = request.get_json(force=True) or {}
        session_id = data.get("session_id")
        text = data.get("text")
        task_type = data.get("task_type", "talk")

        if not session_id or not text:
            return jsonify({"error": "session_id and text are required"}), 400

        url = f"{BASE_URL}.task"
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "session_id": session_id,
            "text": text,
            "task_type": task_type
        }
        
        print(f"Sending task to: {url}")
        print(f"Text: {text}")

        response = requests.post(url, headers=headers, json=payload)
        
        print(f"Task response status: {response.status_code}")
        print(f"Task response: {response.text}")
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Failed to send task",
                "status_code": response.status_code,
                "response_text": response.text
            }), response.status_code
            
    except Exception as e:
        print(f"Exception in send_task: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/stop_session", methods=["POST"])
def stop_session():
    try:
        data = request.get_json(force=True) or {}
        session_id = data.get("session_id")

        if not session_id:
            return jsonify({"error": "session_id is required"}), 400

        url = f"{BASE_URL}.stop"
        headers = {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "session_id": session_id
        }

        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({
                "error": "Failed to stop session",
                "status_code": response.status_code,
                "response_text": response.text
            }), response.status_code
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)