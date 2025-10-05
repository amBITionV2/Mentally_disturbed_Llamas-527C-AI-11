import { useEffect, useRef, useState } from "react";

const AvatarTherapist = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const pcRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const backendURL = "http://10.10.0.94:5000";
  const initializingRef = useRef(false);
  const hasGreetedRef = useRef(false);

  const removeGreenScreen = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (g > 90 && g > r * 1.3 && g > b * 1.3) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (isInitialized) {
      const animate = () => {
        removeGreenScreen();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isInitialized]);

const speakText = async (text) => {
  if (!sessionId) {
    console.error("❌ No session ID available - cannot speak yet");
    return;
  }

  console.log('🎤 Attempting to speak:', text);
  console.log('🎤 Using session ID:', sessionId);

  try {
    const response = await fetch(`${backendURL}/send_task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        text: text,
        task_type: "repeat"
      })
    });
    
    console.log('🎤 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Avatar speech sent successfully:', result);
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to send speech:', response.status, errorText);
    }
  } catch (err) {
    console.error('❌ Failed to send text to avatar:', err);
  }
};

useEffect(() => {
  const handleMessage = (event) => {
    console.log('📨 Raw event received:', event);
    console.log('📨 Event data:', event.data);
    
    try {
      // Handle both string and object data
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      console.log('📨 Parsed data:', data);
      
      if (data.type === 'speak' && data.text) {
        console.log('🗣️ Speaking text:', data.text);
        speakText(data.text);
      } else {
        console.log('⚠️ Message received but not a speak command:', data);
      }
    } catch (err) {
      console.error('❌ Error parsing message:', err);
      console.error('❌ Raw data was:', event.data);
    }
  };

  // Add listeners for React Native WebView
  window.addEventListener('message', handleMessage);
  document.addEventListener('message', handleMessage);

  console.log('✅ Message listeners added, sessionId:', sessionId);

  return () => {
    window.removeEventListener('message', handleMessage);
    document.removeEventListener('message', handleMessage);
    console.log('🧹 Message listeners removed');
  };
}, [sessionId]);

  const initAvatar = async () => {
    // Prevent duplicate initialization
    if (initializingRef.current) {
      console.log("Already initializing, skipping...");
      return;
    }

    initializingRef.current = true;

    try {
      setIsLoading(true);
      
      console.log("Creating session...");
      const createRes = await fetch(`${backendURL}/create_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      const createData = await createRes.json();
      const { session_id, sdp, ice_servers2 } = createData;
      
      if (!session_id) {
        throw new Error("No session_id in response");
      }
      
      if (!sdp || !sdp.sdp) {
        throw new Error("No SDP data in response");
      }
      
      console.log("Session created:", session_id);
      setSessionId(session_id);

      const iceServers = ice_servers2 || [];
      const pc = new RTCPeerConnection({
        iceServers: iceServers
      });
      
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          setIsInitialized(true);
          setIsLoading(false);
        }
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          try {
            await fetch(`${backendURL}/ice_candidate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                session_id,
                candidate: event.candidate
              })
            });
          } catch (err) {
            console.error("Failed to send ICE candidate:", err);
          }
        }
      };

      await pc.setRemoteDescription({
        type: sdp.type,
        sdp: sdp.sdp
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await fetch(`${backendURL}/start_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id,
          sdp: answer.sdp
        })
      });

      // Send greeting only once
      if (!hasGreetedRef.current) {
        hasGreetedRef.current = true;
        setTimeout(async () => {
          try {
            console.log("Sending greeting...");
            await fetch(`${backendURL}/send_task`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                session_id,
                text: "Hi, I'm Rancho, your therapist. How can I help you today?",
                task_type: "repeat"
              })
            });
          } catch (err) {
            console.error("Failed to send greeting:", err);
          }
        }, 3000);
      }

    } catch (err) {
      console.error("Avatar init error:", err);
      setIsLoading(false);
      initializingRef.current = false;
    }
  };

  useEffect(() => {
    initAvatar();

    // Cleanup on unmount
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes borderDance {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 
              0 0 20px rgba(42, 96, 234, 0.5),
              0 0 40px rgba(42, 96, 234, 0.3);
          }
          50% {
            box-shadow: 
              0 0 30px rgba(107, 154, 255, 0.7),
              0 0 50px rgba(107, 154, 255, 0.4);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #000;
          overflow: hidden;
        }

        .dancing-border {
          background: linear-gradient(
            90deg,
            #2a60ea,
            #6b9aff,
            #2a60ea,
            #6b9aff,
            #2a60ea
          );
          background-size: 300% 300%;
          animation: borderDance 3s ease-in-out infinite, glowPulse 2s ease-in-out infinite;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #6b9aff, transparent);
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 6s ease-in infinite;
        }

        .loader-circle {
          width: 100px;
          height: 100px;
          border: 4px solid rgba(42, 96, 234, 0.1);
          border-top: 4px solid #2a60ea;
          border-right: 4px solid #6b9aff;
          border-radius: 50%;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        .avatar-placeholder {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2a60ea 0%, #6b9aff 100%);
          border-radius: 50%;
          position: relative;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(42, 96, 234, 0.6);
        }

        .avatar-placeholder::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(90deg, #2a60ea, #6b9aff, #2a60ea);
          background-size: 200% 100%;
          border-radius: 50%;
          z-index: -1;
          animation: shimmer 2s linear infinite;
          opacity: 0.5;
        }

        .loading-text {
          animation: slideIn 0.6s ease-out;
          background: linear-gradient(90deg, #6b9aff, #2a60ea, #6b9aff);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite, slideIn 0.6s ease-out;
        }

        .progress-bar {
          width: 200px;
          height: 4px;
          background: rgba(42, 96, 234, 0.2);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2a60ea, #6b9aff);
          border-radius: 2px;
          animation: shimmer 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(42, 96, 234, 0.5);
        }
      `}</style>
      
      <div style={{ 
        width: "100%",
        height: "100%",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#000",
        overflow: "hidden"
      }}>
        <div 
          className={isLoading ? "" : "dancing-border"}
          style={{ 
            width: "100%",
            height: "100%",
            padding: isLoading ? 0 : 3,
            borderRadius: 12
          }}
        >
          <div style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#000",
            position: "relative",
            borderRadius: isLoading ? 0 : 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {isLoading && (
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "30px",
                zIndex: 10,
                backgroundColor: "#000"
              }}>
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${4 + Math.random() * 4}s`
                    }}
                  />
                ))}

                <div className="avatar-placeholder">
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)"
                  }} />
                  <div style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "30px",
                    borderRadius: "30px 30px 0 0",
                    background: "rgba(255, 255, 255, 0.2)"
                  }} />
                </div>

                <div className="loader-circle" />

                <div className="loading-text" style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  textAlign: "center",
                  padding: "0 20px",
                  letterSpacing: "1px"
                }}>
                  Loading Rancho
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "100%" }} />
                </div>

                <div style={{
                  color: "rgba(107, 154, 255, 0.7)",
                  fontSize: "14px",
                  textAlign: "center",
                  fontWeight: "500"
                }}>
                  Establishing connection...
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ 
                display: "none"
              }}
            />
            
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: isLoading ? "none" : "block",
                backgroundColor: "#000"
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AvatarTherapist;