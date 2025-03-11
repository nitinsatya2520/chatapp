import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './VideoCall.css';

const socket = io('http://localhost:5000'); // Replace with your server URL

const VideoMeeting = () => {
  const videoGrid = useRef(null);
  const peersRef = useRef([]);
  
  useEffect(() => {
    const roomId = 'kns-group-meeting';
    const myVideo = document.createElement('video');
    myVideo.muted = true;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      addVideoStream(myVideo, stream);

      socket.emit('join-room', { roomId, userId: socket.id });

      socket.on('user-connected', (userId) => {
        const peer = createPeer(userId, socket.id, stream);
        peersRef.current.push(peer);
      });

      socket.on('signal', ({ from, signal }) => {
        const item = peersRef.current.find(peer => peer.peerId === from);
        if (item) {
          item.peer.signal(signal);
        }
      });

      socket.on('user-disconnected', (userId) => {
        const item = peersRef.current.find(peer => peer.peerId === userId);
        if (item) {
          item.peer.destroy();
        }
      });
    });

    return () => socket.disconnect();
  }, []);

  function createPeer(userId, callerId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socket.emit('signal', { to: userId, from: callerId, signal });
    });

    const video = document.createElement('video');
    peer.on('stream', (userStream) => {
      addVideoStream(video, userStream);
    });

    return { peerId: userId, peer };
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.current.append(video);
  }

  return <div ref={videoGrid} className="video-grid"></div>;
};

export default VideoMeeting;
