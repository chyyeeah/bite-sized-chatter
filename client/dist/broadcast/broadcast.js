const startBroadcast = document.getElementById('start-broadcast');
const stopBroadcast = document.getElementById('stop-broadcast')
let socket;
const beginBroadcast = async () => {
  const requestedRoom = document.getElementById('requested-room').value;
  console.log(requestedRoom);

  try {
    const response = await fetch('http://localhost:3000/createroom', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedRoom })
    });
    const status = response.status;
    if (status === 201) {
      socket = io();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      const localVideo = document.getElementById('local-video');
      localVideo.srcObject = stream;


      const { RTCPeerConnection, RTCSessionDescription } = window;
      const peerConnection = new RTCPeerConnection();
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

      socket.emit('broadcast', { room: requestedRoom, offer });
    } else if (status === 403) {
      console.warn('room already exists!');
    } else {
      throw new Error('Error processing request.');
    }
  } catch (e) {
    console.error(e);
  }
};

startBroadcast.addEventListener('click', (event) => {
  startBroadcast.disabled = true;
  stopBroadcast.disabled = false;
  beginBroadcast();
});