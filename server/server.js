var io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});
var playerRooms = new Map();
var rooms = new Map();
var nicknames = new Map(); // socket.id, nickname
var currentRoomID = 0;
io.on('connection', function (socket) {
    console.log('connected');
    socket.on('joining-room', function (nickname) {
        console.log(nickname);
        nicknames.set(socket.id, nickname);
        if (playerRooms.get(socket.id) !== undefined) {
            // Already in a room.
            socket.emit('joined-room', playerRooms.get(socket.id));
            return;
        }
        if (rooms.get(currentRoomID) === undefined || rooms.get(currentRoomID).length === 4) {
            // Creating new room.
            currentRoomID++;
            rooms.set(currentRoomID, []);
        }
        // Joining room.
        socket.join(currentRoomID);
        rooms.get(currentRoomID).push(socket.id);
        playerRooms.set(socket.id, currentRoomID);
        console.log(rooms.get(currentRoomID));
        socket.emit('joined-room', currentRoomID);
        // Informing players of change.
        io.in(currentRoomID).emit('player-change', rooms.get(currentRoomID).map(function (id) { return nicknames.get(id); }));
    });
    socket.on('leaving-room', function () {
        var roomID = playerRooms.get(socket.id);
        if (roomID === undefined) {
            return;
        }
        // Leaving room.
        socket.leave(roomID);
        rooms.set(roomID, rooms.get(roomID).filter(function (id) { return id !== socket.id; })); // Remove player from room.
        playerRooms.delete(socket.id);
        io.in(roomID).emit('player-change', rooms.get(currentRoomID).map(function (id) { return nicknames.get(id); }));
    });
    socket.on('start-game', function () {
        var roomID = playerRooms.get(socket.id);
        console.log('starting game in room ' + roomID);
        io.in(roomID).emit('started-game'); // TODO
    });
});
