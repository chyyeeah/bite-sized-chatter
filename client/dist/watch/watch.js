(async () => {
  // const splitPathname = window.location.pathname.split('/');
  // const room = splitPathname[splitPathname.length - 2];
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get('room');

  try {
    const response = await fetch('http://localhost:3000/validateroom', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room })
    });

    let socket;

    if (response.status === 200) {
      socket = io();
      socket.emit('join', { room });
      const videoNode = document.createElement('video');
      document.getElementById('viewing-area').appendChild(videoNode);
      socket.on('view', async ({ offer }) => {
        console.log('hit');
        const { RTCPeerConnection, RTCSessionDescription } = window;
        const peerConnection = new RTCPeerConnection();
        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      });
      socket.emit('watch', { room });
    }
  } catch (e) {
    console.error(e);
  }
})();