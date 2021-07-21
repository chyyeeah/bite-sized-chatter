# Facade
Facade is a live stream application for individuals to broadcast themselves to viewers.
My goal for this project is to explore the [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) by creating a functional web application.

## Technologies used
- HTML
- Nodejs
- Express
- WebSockets (socket.io)
- WebRTC

## Lessons learned
- When the peer finally sets the answer as their RTCPeerConnection's remote description, it doesn't end there. The whole offer/answer cycle continues again and continues until the connection is broken.
![Process flow](https://raw.githubusercontent.com/chyyeeah/facade/images/img/process_flow.png)

## Future development
- Add more styling
- Deploy application
  - connect to STUN server
- Display how many viewers are in the room
- Add ability for viewers to send a message for all in the broadcast to see
- Allow broadcaster to kick off viewers
- Record broadcast