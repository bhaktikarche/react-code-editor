import React, { useState } from 'react';
import './Home.css';
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("javascript");
  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Room Id is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required!");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username, language },
    });
    toast.success("Room is created");
  };

  return (
    <>
      <div className="container-main">
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-12 col-md-6">
              <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
                <div className="card-body text-center bg-dark">
                  <img
                    className="img-fluid mx-auto d-block"
                    src="\images\teamscript.png"
                    alt="TeamScript"
                    style={{ maxWidth: '150px' }}
                  />

                  <h4 className='text-light'>Enter the Room Id</h4>
                  <div className="form-group">
                    <input
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      type="text"
                      className="form-control mb-2"
                      placeholder="Room Id"
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      className="form-control mb-2"
                      placeholder="Username"
                    />
                  </div>

                  <div className="form-group">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="form-control mb-2"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                  </div>

                  <button onClick={joinRoom} className='btn btn-success btn-lg btn-block'>Join</button>

                  <p className='mt-3 text-light'>Don't have a room Id? {" "} 
                    <span className='text-success p-2' style={{cursor: 'pointer'}}
                    onClick={generateRoomId}
                    >
                      New Room</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
        }}
      />
    </>
  );
}

export default Home;