// TODO - sockety do jednego ładnego pliku a nie w każdym komponencie osobno

const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

interface Card {
    rank: string;
    suit: string;
    symbol: string;
}

interface Bid {
    value: string;
    suit: string;
}

const cardValues = new Map<string, number>([
    ['a', 14], ['k', 13], ['q', 12], ['j', 11], ['10', 10], ['9', 9], ['8', 8],
    ['7', 7], ['6', 6], ['5', 5], ['4', 4], ['3', 3], ['2', 2]
])

const playerRooms = new Map<string, number>();
const rooms = new Map<number, string[]>();
const nicknames = new Map<string, string>(); // socket.id, nickname
let currentRoomID = 0;
let currentTricks = new Map<number, Card[]>(); // roomID, played cards
let currentTurns = new Map<number, number>(); // roomID, 0 - North, 1 - East, 2 - South, 3 - West
let currentTrumps = new Map<number, string>(); // roomID, trump suit
let biddingHistory = new Map<number, Bid[]>(); // roomID, bids

function getWinner(roomID: number) {
    let trump = currentTrumps.get(roomID)!;
    let cards = currentTricks.get(roomID)!;

    let highest;

    for(let i = 0; i < cards.length; i++) {
        let rank = cardValues.get(cards[i].rank)!;
        let highestRank;
        if (highest !== undefined) {
            highestRank = cardValues.get(highest.rank);
        }

        console.log(cards[i].rank + ' ' + cards[i].suit + ' ' + rank + ' ' + highestRank);
        
        if (highest === undefined) {
            // First card in a trick.
            highest = cards[i];
        } else if (cards[i].suit === trump) {
            // Trump suit card
            if (rank > highestRank) {
                highest = cards[i];
            }
        } else {
            if (highest.suit !== trump && cards[i].suit === highest.suit && rank > highestRank) {
                // Normal card
                highest = cards[i];
            }
        }
    }

    console.log("Highest: " + cards.indexOf(highest));

    // We made it around the table - last player is saved in currentTurns now.
    // We need to add 1 mod 4 to get to the first player.
    let firstPlayer = (currentTurns.get(roomID)! + 1) % 4;
    let winner = (firstPlayer + cards.indexOf(highest)) % 4;

    return winner;
}


function checkForThreePasses(roomID: number) {
    let bids = biddingHistory.get(roomID)!;
    if (bids.length < 3) {
        return false;
    }

    let passes = 0;
    for (let i = bids.length - 1; i >= bids.length - 3; i--) {
        if (bids[i].value === 'pass') {
            passes++;
        }
    }

    return passes === 3;
}


io.on('connection', socket => {
    console.log('connected');
    
    socket.on('joining-room', nickname => {
        console.log(nickname);
        nicknames.set(socket.id, nickname);

        if (playerRooms.get(socket.id) !== undefined) {
            // Already in a room.
            socket.emit('joined-room', playerRooms.get(socket.id));
            return;
        }

        if (rooms.get(currentRoomID) === undefined || rooms.get(currentRoomID)!.length === 4) {
            // Creating new room.
            currentRoomID++;
            rooms.set(currentRoomID, []);
            currentTricks.set(currentRoomID, []);
            currentTurns.set(currentRoomID, 0);
            currentTrumps.set(currentRoomID, 'Spades'); // TODO - testing
            biddingHistory.set(currentRoomID, []);
        }

        // Joining room.
        socket.join(currentRoomID);
        rooms.get(currentRoomID)!.push(socket.id);
        playerRooms.set(socket.id, currentRoomID);

        console.log(rooms.get(currentRoomID));
        socket.emit('joined-room', currentRoomID);
        
        // Informing players of change.
        io.in(currentRoomID).emit('player-change', rooms.get(currentRoomID)!.map(id => nicknames.get(id)));
    });


    socket.on('leaving-room', () => {
        const roomID = playerRooms.get(socket.id);
        if (roomID === undefined) {
            return;
        }

        // Leaving room.
        socket.leave(roomID);
        rooms.set(roomID, rooms.get(roomID)!.filter(id => id !== socket.id)); // Remove player from room.
        playerRooms.delete(socket.id);

        io.in(roomID).emit('player-change', rooms.get(currentRoomID)!.map(id => nicknames.get(id)));
    });


    socket.on('start-game', () => {
        const roomID = playerRooms.get(socket.id)!;
        io.in(roomID).emit('started-game');
        io.in(socket.id).emit('your-turn'); // TODO - should be decided based on bidding.
    });


    socket.on('play-card', (card: Card) => {
        console.log(socket.id + ' played ' + card.rank + ' of ' + card.suit);
        const roomID = playerRooms.get(socket.id)!;
        const playerIndex = rooms.get(roomID)!.indexOf(socket.id);

        currentTricks.get(roomID)!.push(card);
        const currentSuit = currentTricks.get(roomID)![0].suit;
        io.in(roomID).emit('card-played', card, currentSuit, playerIndex);

        if (currentTricks.get(roomID)!.length === 4) {
            // Trick is over.
            let winnerIndex = getWinner(roomID);
            currentTricks.set(roomID, []);
            currentTurns.set(roomID, winnerIndex);
            
            io.in(roomID).emit('trick-over', winnerIndex);
            io.in(rooms.get(roomID)![winnerIndex]).emit('your-turn'); // Sending info to trick winner.
            return;
        }

        const currentTurn = (currentTurns.get(roomID)! + 1) % 4;
        currentTurns.set(roomID, currentTurn);
        io.in(rooms.get(roomID)![currentTurn]).emit('your-turn');

    });


    socket.on('bid', (bid: Bid) => {
        // TODO - add 4 passes check
        // TODO - doubles/redoubles
        const roomID = playerRooms.get(socket.id)!;

        biddingHistory.get(roomID)!.push(bid);

        if (checkForThreePasses(roomID)) {
            // Bidding is over.
            console.log("Bidding over");
            io.in(roomID).emit('bidding-over');
            return;
        }

        io.in(roomID).emit('bid-made', bid);
    });
});