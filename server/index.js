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
  socket.on('broadcast', ({ room, offer }) => {
    rooms.set(room, offer);
  });

  socket.on('join', ({ room }) => {
    console.log('inside join', room);
    socket.join(room);
  });

  socket.on('watch', ({ room }) => {
    console.log('inside watch');
    socket.to(room).emit('view', rooms.get(room));
  })
});

app.post('/createroom', (req, res) => {
  console.log(req.body);
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