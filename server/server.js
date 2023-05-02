const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

io.on('connection', socket => {
    console.log('connected');
    
    socket.on('joined-room', nickname => {
        console.log(nickname);
    });
});