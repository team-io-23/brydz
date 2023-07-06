"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCorrectBid = void 0;
// TODO - sockety do jednego ładnego pliku a nie w każdym komponencie osobno
var server_utils_1 = require("./server-utils");
var express = require('express');
var PORT = 8000;
var server = express()
    .listen(PORT, function () { return console.log("Listening on ".concat(PORT)); });
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
var ZERO_BID = {
    value: '0',
    trump: 'none',
    bidder: -1
};
var playerRooms = new Map();
var rooms = new Map();
var nicknames = new Map(); // socket.id, nickname
var currentRoomID = 0;
var currentTricks = new Map(); // roomID, played cards
var currentTurns = new Map(); // roomID, 0 - North, 1 - East, 2 - South, 3 - West
var currentTrumps = new Map(); // roomID, trump suit
var biddingHistory = new Map(); // roomID, bids
var results = new Map(); // roomID, scores
var currentHands = new Map(); // roomID, hands
var currentDummy = new Map(); // roomID, dummy player
var showDummy = new Map(); // roomID, show dummy cards
var currentSeats = new Map(); // roomID, seats
function initRoom(roomID) {
    rooms.set(roomID, []);
    currentTricks.set(roomID, []);
    currentTurns.set(roomID, 0);
    currentTrumps.set(roomID, 'Spades'); // TODO - testing
    biddingHistory.set(roomID, [ZERO_BID]);
    results.set(roomID, { teamOne: 0, teamTwo: 0 });
    currentHands.set(roomID, []);
    currentDummy.set(roomID, -1);
    showDummy.set(roomID, false);
    currentSeats.set(roomID, [-1, -1, -1, -1]);
    dealCards(roomID);
}
function dealCards(roomID) {
    var cards = shuffleArray(server_utils_1.allCards);
    var hands = [[], [], [], []];
    for (var i = 0; i < 52; i++) {
        hands[i % 4].push(cards[i]);
    }
    // Sort each hand
    for (var i = 0; i < 4; i++) {
        hands[i].sort(server_utils_1.cardComparator);
    }
    currentHands.set(roomID, [
        { cards: hands[0], player: 0 },
        { cards: hands[1], player: 1 },
        { cards: hands[2], player: 2 },
        { cards: hands[3], player: 3 }
    ]);
}
function sendCards(socket) {
    var roomID = playerRooms.get(socket.id);
    var playerID = rooms.get(roomID).indexOf(socket.id);
    var dummyID = currentDummy.get(roomID);
    var show = showDummy.get(roomID);
    var hands = (0, server_utils_1.hideCards)(currentHands.get(roomID), playerID, dummyID, show);
    socket.emit('hand-update', hands);
}
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
function getWinner(roomID) {
    var trump = currentTrumps.get(roomID);
    var cards = currentTricks.get(roomID);
    var highest;
    for (var i = 0; i < cards.length; i++) {
        var rank = server_utils_1.cardValues.get(cards[i].rank);
        var highestRank = void 0;
        if (highest !== undefined) {
            highestRank = server_utils_1.cardValues.get(highest.rank);
        }
        if (highest === undefined) {
            // First card in a trick.
            highest = cards[i];
        }
        else if (cards[i].suit === trump) {
            // Trump suit card
            if (rank > highestRank) {
                highest = cards[i];
            }
        }
        else {
            if (highest.suit !== trump && cards[i].suit === highest.suit && rank > highestRank) {
                // Normal card
                highest = cards[i];
            }
        }
    }
    // We made it around the table - last player is saved in currentTurns now.
    // We need to add 1 mod 4 to get to the first player.
    var firstPlayer = (currentTurns.get(roomID) + 1) % 4;
    var winner = (firstPlayer + cards.indexOf(highest)) % 4;
    return winner;
}
function checkCorrectBid(bid, bidHistory) {
    // TODO - lastBid will be used to check for turn order
    var lastLegitBid = (0, server_utils_1.findLastLegitBid)(bidHistory);
    var lastBid = bidHistory[bidHistory.length - 1];
    if (bid === undefined || lastBid === undefined) {
        return false;
    }
    if (bid.value === "pass") {
        return true;
    }
    if (bid.value === "X") {
        // We can only double our opponents.
        return lastLegitBid.bidder % 2 !== bid.bidder % 2;
    }
    if (bid.value === "XX") {
        // We can only redouble our opponents and only if they doubled.
        return lastLegitBid.bidder % 2 !== bid.bidder % 2 && (0, server_utils_1.isDoubled)(bidHistory);
    }
    var trumpValue = server_utils_1.trumpValues.get(bid.trump);
    var currentTrumpValue = server_utils_1.trumpValues.get(lastLegitBid.trump);
    if (bid.value > lastLegitBid.value || (bid.value === lastLegitBid.value && trumpValue > currentTrumpValue)) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkCorrectBid = checkCorrectBid;
function checkForThreePasses(roomID) {
    var bids = biddingHistory.get(roomID);
    if (bids.length < 3) {
        return false;
    }
    var passes = 0;
    for (var i = bids.length - 1; i >= bids.length - 3; i--) {
        if (bids[i].value === 'pass') {
            passes++;
        }
    }
    return passes === 3;
}
function updateTakenSeats() {
    var newSeats = [];
    rooms.forEach(function (value, key) {
        newSeats.push(value.length);
    });
    io.emit('seatstaken-change', newSeats);
}
io.on('connection', function (socket) {
    console.log('connected');
    socket.on('entered', function (nickname) {
        nicknames.set(socket.id, nickname);
    });
    socket.on('get-roomlist', function () {
        io.emit('roomlist-change', Array.from(rooms.keys()));
        updateTakenSeats();
    });
    socket.on('joining-room', function (joinedRoomID) {
        if (rooms.get(joinedRoomID).length >= 4) {
            console.log("the room is full");
            socket.emit('room-is-full');
            return;
        }
        if (playerRooms.get(socket.id) !== undefined) {
            // Already in a room.
            socket.emit('joined-room', playerRooms.get(socket.id));
            return;
        }
        // Joining room.
        socket.join(joinedRoomID);
        rooms.get(joinedRoomID).push(socket.id);
        playerRooms.set(socket.id, joinedRoomID);
        socket.emit('joined-room', joinedRoomID);
        // Informing players of change.
        io.in(joinedRoomID).emit('player-change', rooms.get(joinedRoomID).map(function (id) { return nicknames.get(id); }));
        io.in(joinedRoomID).emit('seat-change', currentSeats.get(joinedRoomID));
        updateTakenSeats();
    });
    socket.on('creating-room', function () {
        // Create room.
        currentRoomID++;
        initRoom(currentRoomID);
        // Join newly created room
        socket.join(currentRoomID);
        rooms.get(currentRoomID).push(socket.id);
        playerRooms.set(socket.id, currentRoomID);
        socket.emit('created-room', currentRoomID);
        // Sending info
        io.emit('roomlist-change', Array.from(rooms.keys()));
        io.in(currentRoomID).emit('player-change', rooms.get(currentRoomID).map(function (id) { return nicknames.get(id); }));
        updateTakenSeats();
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
        updateTakenSeats();
    });
    socket.on('choose-seat', function (seat) {
        var roomID = playerRooms.get(socket.id);
        var playerID = rooms.get(roomID).indexOf(socket.id);
        var seats = currentSeats.get(roomID);
        if (seats.includes(playerID) || seats[seat] !== -1) {
            // Player is already in seat or seat is taken.
            return;
        }
        seats[seat] = playerID;
        currentSeats.set(roomID, seats);
        io.in(roomID).emit('seat-change', seats);
    });
    socket.on('leave-seat', function () {
        var roomID = playerRooms.get(socket.id);
        var playerID = rooms.get(roomID).indexOf(socket.id);
        var seats = currentSeats.get(roomID);
        if (!seats.includes(playerID)) {
            // Player is not in a seat.
            return;
        }
        seats[seats.indexOf(playerID)] = -1;
        currentSeats.set(roomID, seats);
        io.in(roomID).emit('seat-change', seats);
    });
    socket.on('start-game', function () {
        var roomID = playerRooms.get(socket.id);
        // Set players in their seats order.
        var seats = currentSeats.get(roomID);
        var players = rooms.get(roomID);
        for (var i = 0; i < 4; i++) {
            if (seats[i] === -1) {
                // Not all seats are filled.
                // return; // TODO - uncomment this
            }
        }
        console.log(players);
        var orderedPlayers = [players[seats[0]], players[seats[1]], players[seats[2]], players[seats[3]]];
        console.log(orderedPlayers);
        rooms.set(roomID, orderedPlayers);
        io.in(roomID).emit('started-game', rooms.get(roomID).map(function (id) { return nicknames.get(id); }));
        io.in(roomID).emit('hand-update', currentHands.get(roomID));
    });
    socket.on('play-card', function (played) {
        // TODO - check for valid card and turn order
        var card = played.card;
        var player = played.player;
        var roomID = playerRooms.get(socket.id);
        currentTricks.get(roomID).push(card);
        var currentSuit = currentTricks.get(roomID)[0].suit;
        io.in(roomID).emit('card-played', card, currentSuit, player);
        showDummy.set(roomID, true); // Dummy will be shown after the first card is played.
        // Update hands
        var hands = currentHands.get(roomID);
        hands[player].cards = hands[player].cards.filter(function (c) { return c.rank !== card.rank || c.suit !== card.suit; });
        currentHands.set(roomID, hands);
        sendCards(socket);
        if (currentTricks.get(roomID).length === 4) {
            // Trick is over.
            var winnerIndex = getWinner(roomID);
            var newScore = void 0;
            if (winnerIndex % 2 === 0) {
                // Team 1 won the trick.
                newScore = {
                    'teamOne': results.get(roomID).teamOne + 1,
                    'teamTwo': results.get(roomID).teamTwo
                };
            }
            else {
                // Team 2 won the trick.
                newScore = {
                    'teamOne': results.get(roomID).teamOne,
                    'teamTwo': results.get(roomID).teamTwo + 1
                };
            }
            var thisTrick = currentTricks.get(roomID);
            results.set(roomID, newScore);
            currentTricks.set(roomID, []);
            currentTurns.set(roomID, winnerIndex);
            io.in(roomID).emit('trick-over', results.get(roomID), { cards: thisTrick, winner: winnerIndex });
            io.in(roomID).emit('set-turn', winnerIndex); // Sending info about trick winner.
            return;
        }
        var currentTurn = (currentTurns.get(roomID) + 1) % 4;
        currentTurns.set(roomID, currentTurn);
        io.in(roomID).emit('set-turn', currentTurn);
    });
    socket.on('bid', function (bid) {
        // TODO - doubles/redoubles
        var roomID = playerRooms.get(socket.id);
        var bidHistory = biddingHistory.get(roomID);
        if (!checkCorrectBid(bid, bidHistory)) {
            console.log("Illegal bid / Not your turn!");
            return;
        } // TODO - testing, add turn check later
        biddingHistory.get(roomID).push(bid);
        if (checkForThreePasses(roomID)) {
            // Bidding is over.
            var declarer = (0, server_utils_1.findDeclarer)(biddingHistory.get(roomID));
            currentDummy.set(roomID, (declarer + 2) % 4);
            currentTurns.set(roomID, (declarer + 1) % 4); // Next player after declarer starts.
            io.in(roomID).emit('set-turn', currentTurns.get(roomID));
            io.in(roomID).emit('bidding-over');
            return;
        }
        io.in(roomID).emit('bid-made', bid);
    });
    socket.on('get-hands', function () {
        sendCards(socket);
    });
    socket.on('get-dummy', function () {
        var roomID = playerRooms.get(socket.id);
        var dummyIndex = currentDummy.get(roomID);
        socket.emit('dummy-info', dummyIndex);
    });
    socket.on('get-turn', function () {
        var roomID = playerRooms.get(socket.id);
        var turnIndex = currentTurns.get(roomID);
        socket.emit('turn-info', turnIndex);
    });
});
