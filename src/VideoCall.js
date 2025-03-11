import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';
import './VideoCall.css';

const socket = io('http://localhost:5000');

function VideoCall({ username }) {
  const [stream, setStream] = useState(null);
  const [myPeer, setMyPeer] = useState(null);
  const [peerSignal, setPeerSignal] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const myVideoRef = useRef();
  const peerVideoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      })
      .catch(error => console.error('Error accessing media devices:', error));
  }, []);

  const initiateCall = (recipient) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { signalData: data, recipient });
    });

    peer.on('stream', (peerStream) => {
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = peerStream;
      }
    });

    setMyPeer(peer);
  };

  const acceptCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data });
    });

    peer.on('stream', (peerStream) => {
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = peerStream;
      }
    });

    setMyPeer(peer);
    peer.signal(peerSignal); // Connect with offer signal
  };

  const endCall = () => {
    if (myPeer) {
      myPeer.destroy();
      setMyPeer(null);
      setCallAccepted(false);
      setIncomingCall(false);
    }
  };

  useEffect(() => {
    socket.on('incomingCall', ({ signal }) => {
      setPeerSignal(signal);
      setIncomingCall(true);
    });

    socket.on('callAccepted', ({ signal }) => {
      myPeer?.signal(signal);
    });
  }, [myPeer]);

  return (
    <div className="video-call-container">
      <h1>Video Call</h1>

      <div className="video-section">
        <video ref={myVideoRef} autoPlay muted playsInline />
        {callAccepted && <video ref={peerVideoRef} autoPlay playsInline />}
      </div>

      {!callAccepted && !incomingCall && (
        <button onClick={initiateCall}>Start Call</button>
      )}

      {incomingCall && !callAccepted && (
        <div>
          <h2>Incoming Call...</h2>
          <button onClick={acceptCall}>Accept</button>
          <button onClick={endCall}>Reject</button>
        </div>
      )}

      {callAccepted && <button onClick={endCall}>End Call</button>}
    </div>
  );
}

export default VideoCall;
