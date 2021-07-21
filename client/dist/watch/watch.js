const searchParams = new URLSearchParams(window.location.search),
  room = searchParams.get('room'),
  remoteVideo = document.getElementById('remote-video'),
  { RTCPeerConnection, RTCSessionDescription } = window,
  config = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] },
  socket = io(),
  peerConnection = new RTCPeerConnection();

const title = document.createElement('h1');
title.innerText = `${room}`;
document.getElementById('title').appendChild(title);

peerConnection.ontrack = (event) => remoteVideo.srcObject = event.streams[0];

socket.on('offer', async ({ host, offer }) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    // console.log('received offer', peerConnection.connectionState);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit('answer', { host, answer });
    // console.log('emitted answer', peerConnection.connectionState);
  } catch (e) {
    console.error(e);
  }
});

const validateRoom = (room) => {
  return fetch('http://localhost:3000/validateroom', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room })
  });
};

const joinBroadcast = async (room) => {
  try {
    const response = await validateRoom(room);
    if (response.status === 200) {
      socket.emit('request', { room });
      // console.log('emitted request');
    }
  } catch (e) {
    console.error('Error validating room', e);
  }
};

joinBroadcast(room);