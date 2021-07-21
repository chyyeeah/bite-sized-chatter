const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const uuid = require('uuid');
const PORT = 3000;
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const rooms = new Map();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('client/dist')));
app.use('/broadcast', express.static(path.resolve('client/dist/broadcast')));
app.use('/watch', express.static(path.resolve('client/dist/watch')));

io.use((socket, next) => {
  socket.room = socket.handshake.auth.room;
  next();
});

io.on('connection', (socket) => {
  socket.on('broadcast', ({ requestedRoom }) => {
    rooms.set(requestedRoom, {
      host: socket.id,
      viewers: []
    });
    console.log(rooms);
    console.log(socket.id);
  });

  socket.on('request', ({ room }) => {
    const { host } = rooms.get(room);
    socket.to(host).emit('request', { viewer: socket.id });
  });

  socket.on('offer', ({ viewer, offer }) => {
    socket.to(viewer).emit('offer', { host: socket.id, offer });
  });

  socket.on('answer', ({ host, answer }) => {
    socket.to(host).emit('answer', { viewer: socket.id, answer });
  });

  // socket.on('webrtc_ice_candidate', ({ peer, label, candidate}) => {
  //   console.log('peer', peer);
  //   socket.to(peer).emit({ peer: socket.id, label, candidate });
  // });
});

app.post('/createroom', (req, res) => {
  const { requestedRoom } = req.body;
  if (rooms.has(requestedRoom)) {
    res.sendStatus(403);
  } else {
    res.sendStatus(201);
  }
});

app.post('/validateroom', (req, res) => {
  console.log(req.body);
  const { room } = req.body;
  if (rooms.has(room)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

httpServer.listen(
  PORT,
  () => console.log(`listening on http://localhost:${PORT}`)
);