# Facade
Facade is a live stream application for individuals to broadcast themselves to viewers.
My goal for this project is to explore the [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) by creating a functional web application.

## Technologies used
- HTML
- Nodejs
- Express
- WebSockets (socket.io)
- WebRTC

## High level process flow (WebRTC)
![Process flow](https://raw.githubusercontent.com/chyyeeah/facade/images/img/process_flow.png)

## Lessons learned
- When the peer finally sets the answer as their RTCPeerConnection's remote description, it doesn't end there. The whole offer/answer cycle continues again and continues until the connection is broken.
- When a viewer is using Chrome and accesses the link to enter the broadcaster's room, the video cannot be autoplayed per Chrome's [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) in September 2017. The viewer will manually have to show the video controls to play the video and start viewing the livestream. A viable solution would be to convert my web application into a single page application in order to fulfill this autoplay criteria: `User has interacted with the domain (click, tap, etc.).`

## Future development
- [x] Allow for multiple viewers
- [ ] Add more styling
- [ ] Deploy application
  - [ ] connect to STUN server
- [ ] Display how many viewers are in the room
- [ ] Add ability for viewers to send a message for all in the broadcast to see
- [ ] Allow broadcaster to kick off viewers
- [ ] Record broadcast
