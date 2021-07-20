const startBroadcast = document.getElementById('start-broadcast');
const stopBroadcast = document.getElementById('stop-broadcast')
let socket;

const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();


navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
  .then((stream) => {
    const localVideo = document.getElementById('local-video');
    localVideo.srcObject = stream;
    stream.getTracks().forEach((track) => {
      console.log('stream', stream);
      peerConnection.addTrack(track, stream);
    });
  });

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

      socket.emit('broadcast', { requestedRoom });

      socket.on('request', async ({ viewer }) => {
        const offer = await peerConnection.createOffer({ offerToReceiveVideo: true });
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit('offer', { viewer, offer });
      });

      socket.on('answer', async ({ answer }) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('answer received');
      });
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