(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get('room');

  const { RTCPeerConnection, RTCSessionDescription } = window;
  const peerConnection = new RTCPeerConnection();
  peerConnection.ontrack = (event) => {
    console.log(event);
    const remoteVideo = document.getElementById('remote-video');
    remoteVideo.srcObject = event.streams[0];
    console.log('srcObject', remoteVideo.srcObject);
  };

  try {
    const response = await fetch('http://localhost:3000/validateroom', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room })
    });

    let socket;

    if (response.status === 200) {
      socket = io();
      // request
      socket.emit('request', { room });
      socket.on('offer', async ({ host, offer }) => {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
          socket.emit('answer', { host, answer });
          console.log('answer emitted');
        } catch (e) {
          console.error(e);
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
})();