const startBroadcast = document.getElementById('start-broadcast'),
  stopBroadcast = document.getElementById('stop-broadcast'),
  config = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] },
  { RTCPeerConnection, RTCSessionDescription } = window,
  socket = io(),
  peerConnection = new RTCPeerConnection();

socket.on('request', async ({ viewer }) => {
  callUser(viewer);
});

socket.on('answer', async ({ viewer, answer }) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log('on answer', peerConnection.connectionState, peerConnection);
  callUser(viewer);
});

const callUser = async (viewer) => {
  console.log('on request', peerConnection.connectionState);
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  socket.emit('offer', { viewer, offer });
  console.log('emitted offer', peerConnection.connectionState);
};

const setUpLocalStream = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const localVideo = document.getElementById('local-video');
  localVideo.srcObject = localStream;

  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
};

const createRoom = (requestedRoom) => {
  return fetch('http://localhost:3000/createroom', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestedRoom })
  });
};

const beginBroadcast = async (room) => {
  const requestedRoom = document.getElementById('requested-room').value;
  try {
    const response = await createRoom(requestedRoom);
    if (response.status === 201) {
      socket.emit('broadcast', { requestedRoom });
    } else if (status === 403) {
      console.warn('room already exists!');
    }
  } catch (e) {
    console.error('Error creating room', e);
  }
};

startBroadcast.addEventListener('click', (event) => {
  startBroadcast.disabled = true;
  stopBroadcast.disabled = false;
  beginBroadcast();
});

setUpLocalStream();