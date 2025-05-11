import React, { useEffect, useRef, useState } from 'react';
import './EditPage.css';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../components/socket';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function EditorPage() {
  const [clients, setClients] = useState([]);
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const { username, language } = location.state || {};

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  useEffect(() => {
    if (!location.state) return;

    const init = async () => {
      socketRef.current = await initSocket();

      const handleError = (e) => {
        console.log('socket error => ', e);
        toast.error("Socket connection failed");
        navigate("/");
      };

      socketRef.current.on('connect_error', handleError);
      socketRef.current.on('connect_failed', handleError);

      socketRef.current.emit('join', {
        roomId,
        username,
        language
      });

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined`);
        }
        setClients(clients);

        if (codeRef.current) {
          socketRef.current.emit('send-code', {
            socketId,
            code: codeRef.current
          });
        }
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });

      socketRef.current.on('request-code', ({ socketId }) => {
        if (codeRef.current) {
          socketRef.current.emit('send-code', {
            socketId,
            code: codeRef.current
          });
        }
      });

      socketRef.current.on('sync-code', ({ code, language: syncLanguage }) => {
        if (code) {
          codeRef.current = code;
        }
      });

      socketRef.current.on('code-change', ({ code }) => {
        if (code !== null) {
          codeRef.current = code;
          if (editorRef.current) {
            editorRef.current.setValue(code);
          }
        }
      });
      
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off('joined');
        socketRef.current.off('disconnected');
        socketRef.current.off('connect_error');
        socketRef.current.off('connect_failed');
        socketRef.current.off('request-code');
        socketRef.current.off('sync-code');
      }
    };
  }, [roomId, navigate, location.state]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Room ID");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  const onCodeChange = (code) => {
  codeRef.current = code;
  setCode(code);
};


  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-2 bg-dark text-light d-flex flex-column h-100" style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}>
          <img
            className="img-fluid mx-auto"
            src="/images/CodeSync.png"
            alt="Codesync"
            style={{ maxWidth: '150px', marginTop: "0px" }}
          />

          <hr style={{ marginTop: "0" }} />

          <div className="d-flex flex-column overflow-auto">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <div className="mt-auto">
            <div className="text-center mb-2">
              <span className="badge bg-secondary">
                {language?.toUpperCase()}
              </span>
            </div>
            <hr />
            <button onClick={copyRoomId} className="btn btn-success btn-block">Copy Room ID</button>
            <button onClick={leaveRoom} className="btn btn-danger mt-2 mb-2 px-3 btn-block">Leave Room</button>
          </div>
        </div>

        <div className="col-md-10 text-light d-flex flex-column h-100">
                <Editor
          socketRef={socketRef}
          roomId={roomId}
          language={language}
          onCodeChange={onCodeChange}
          editorRef={editorRef}
        />

        </div>
      </div>
    </div>
  );
}

export default EditorPage;