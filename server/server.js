"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCorrectBid = void 0;
// TODO - sockety do jednego ładnego pliku a nie w każdym komponencie osobno
var server_utils_1 = require("./server-utils");
var io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});
var cardValues = new Map([
    ['a', 14], ['k', 13], ['q', 12], ['j', 11], ['10', 10], ['9', 9], ['8', 8],
    ['7', 7], ['6', 6], ['5', 5], ['4', 4], ['3', 3], ['2', 2]
]);
var trumpValues = new Map([
    ["none", 0], ["clubs", 1], ["diams", 2], ["hearts", 3], ["spades", 4], ["no-trump", 5]
]);
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
    dealCards(roomID);
}
function dealCards(roomID) {
    var cards = shuffleArray(server_utils_1.allCards);
    var hands = [[], [], [], []];
    for (var i = 0; i < 52; i++) {
        hands[i % 4].push(cards[i]);
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
        var rank = cardValues.get(cards[i].rank);
        var highestRank = void 0;
        if (highest !== undefined) {
            highestRank = cardValues.get(highest.rank);
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
function checkCorrectBid(bid, lastBid, lastLegitBid) {
    // TODO - doubles and redoubles
    // TODO - lastBid will be used to check for turn order
    if (bid === undefined || lastBid === undefined) {
        return false;
    }
    if (bid.value === "pass") {
        return true;
    }
    var trumpValue = trumpValues.get(bid.trump);
    var currentTrumpValue = trumpValues.get(lastLegitBid.trump);
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
            initRoom(currentRoomID);
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
        io.in(roomID).emit('started-game', rooms.get(roomID).map(function (id) { return nicknames.get(id); }));
        io.in(roomID).emit('hand-update', currentHands.get(roomID));
    });
    socket.on('play-card', function (played) {
        // TODO - check for valid card.
        var card = played.card;
        var player = played.player;
        console.log(socket.id + ' played ' + card.rank + ' of ' + card.suit);
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
            currentTricks.set(roomID, []);
            currentTurns.set(roomID, winnerIndex);
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
            results.set(roomID, newScore);
            io.in(roomID).emit('trick-over', results.get(roomID));
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
        var lastLegitBid = (0, server_utils_1.findLastLegitBid)(biddingHistory.get(roomID));
        var lastBid = biddingHistory.get(roomID)[biddingHistory.get(roomID).length - 1];
        if (!checkCorrectBid(bid, lastBid, lastLegitBid)) {
            console.log("Illegal bid / Not your turn!");
            return;
        } // TODO - testing, add turn check later
        biddingHistory.get(roomID).push(bid);
        console.log(biddingHistory);
        if (checkForThreePasses(roomID)) {
            // Bidding is over.
            console.log("Bidding over");
            var declarer = (0, server_utils_1.findDeclarer)(biddingHistory.get(roomID));
            currentDummy.set(roomID, (declarer + 2) % 4);
            currentTurns.set(roomID, (declarer + 1) % 4); // Next player after declarer starts.
            console.log("Declarer: " + declarer);
            console.log("Dummy: " + currentDummy.get(roomID));
            io.in(roomID).emit('set-turn', currentTurns.get(roomID));
            io.in(roomID).emit('bidding-over');
            return;
        }
        console.log("Bid made by: " + socket.id + " " + bid.value);
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
