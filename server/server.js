const io = require('socket.io')(8000, {
    cors: {
        origin: ['http://localhost:3000'],
    }
})

io.on('connection', socket => {
    console.log('New user connected to socket ID: ' + socket.id);
    socket.on('send-message', data => {
        io.emit('receive-message', data);
        console.log(data);
    })
})