// TODO - sockety do jednego ładnego pliku a nie w każdym komponencie osobno
import { allCards, findDeclarer, findLastLegitBid, hideCards } from './server-utils';
import { Bid, Card, Score, Hand } from './types';

const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});


const cardValues = new Map<string, number>([
    ['a', 14], ['k', 13], ['q', 12], ['j', 11], ['10', 10], ['9', 9], ['8', 8],
    ['7', 7], ['6', 6], ['5', 5], ['4', 4], ['3', 3], ['2', 2]
])

const trumpValues = new Map<string, number>([
    ["none", 0], ["clubs", 1], ["diams", 2], ["hearts", 3], ["spades", 4], ["no-trump", 5]
]);


const ZERO_BID: Bid = {
    value: '0',
    trump: 'none',
    bidder: -1
}

const playerRooms = new Map<string, number>();
const rooms = new Map<number, string[]>();
const nicknames = new Map<string, string>(); // socket.id, nickname
let currentRoomID = 0;
let currentTricks = new Map<number, Card[]>(); // roomID, played cards
let currentTurns = new Map<number, number>(); // roomID, 0 - North, 1 - East, 2 - South, 3 - West
let currentTrumps = new Map<number, string>(); // roomID, trump suit
let biddingHistory = new Map<number, Bid[]>(); // roomID, bids
let results = new Map<number, Score>(); // roomID, scores
let currentHands = new Map<number, Hand[]>(); // roomID, hands
let currentDummy = new Map<number, number>(); // roomID, dummy player

function initRoom(roomID: number) {
    rooms.set(roomID, []);
    currentTricks.set(roomID, []);
    currentTurns.set(roomID, 0);
    currentTrumps.set(roomID, 'Spades'); // TODO - testing
    biddingHistory.set(roomID, [ZERO_BID]);
    results.set(roomID, {teamOne: 0, teamTwo: 0});
    currentHands.set(roomID, []);
    currentDummy.set(roomID, -1);
    dealCards(roomID);
}


function dealCards(roomID: number) {
    let cards = shuffleArray(allCards);
    let hands: Card[][] = [[], [], [], []]
    for (let i = 0; i < 52; i++) {
        hands[i % 4].push(cards[i]);
    }

    currentHands.set(roomID, [
        {cards: hands[0], player: 0},
        {cards: hands[1], player: 1},
        {cards: hands[2], player: 2},
        {cards: hands[3], player: 3}
    ]);
}


function sendCards(socket: any) {
    const roomID = playerRooms.get(socket.id)!;
    const playerID = rooms.get(roomID)!.indexOf(socket.id);
    const dummyID = currentDummy.get(roomID)!;

    let hands = hideCards(currentHands.get(roomID)!, playerID, dummyID);
    socket.emit('hand-update', hands);
}


function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


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

    // We made it around the table - last player is saved in currentTurns now.
    // We need to add 1 mod 4 to get to the first player.
    let firstPlayer = (currentTurns.get(roomID)! + 1) % 4;
    let winner = (firstPlayer + cards.indexOf(highest)) % 4;

    return winner;
}


export function checkCorrectBid(bid: Bid, currentBid: Bid) {
    // TODO - doubles and redoubles
    if (bid === undefined || currentBid === undefined) {
        return false;
    }

    if (bid.value === "pass") {
        return true;
    }

    let trumpValue = trumpValues.get(bid.trump)!;
    let currentTrumpValue = trumpValues.get(currentBid.trump)!;


    if (bid.value > currentBid.value || (bid.value === currentBid.value && trumpValue > currentTrumpValue)) {
        return true;
    } else {
        return false;
    }
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
            initRoom(currentRoomID);
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

        io.in(roomID).emit('started-game', rooms.get(roomID)!.map(id => nicknames.get(id)));
        io.in(socket.id).emit('your-turn'); // TODO - should be decided based on bidding.
        io.in(roomID).emit('hand-update', currentHands.get(roomID));
    });


    socket.on('play-card', (card: Card) => {
        console.log(socket.id + ' played ' + card.rank + ' of ' + card.suit);
        const roomID = playerRooms.get(socket.id)!;
        const playerIndex = rooms.get(roomID)!.indexOf(socket.id);

        currentTricks.get(roomID)!.push(card);
        const currentSuit = currentTricks.get(roomID)![0].suit;
        io.in(roomID).emit('card-played', card, currentSuit, playerIndex);

        // Update hands
        let hands = currentHands.get(roomID)!;
        hands[playerIndex].cards = hands[playerIndex].cards.filter(c => c.rank !== card.rank || c.suit !== card.suit);
        currentHands.set(roomID, hands);
        sendCards(socket);

        if (currentTricks.get(roomID)!.length === 4) {
            // Trick is over.
            let winnerIndex = getWinner(roomID);
            currentTricks.set(roomID, []);
            currentTurns.set(roomID, winnerIndex);

            let newScore: Score;

            if (winnerIndex % 2 === 0) {
                // Team 1 won the trick.
                newScore = {
                    'teamOne': results.get(roomID)!.teamOne + 1, 
                    'teamTwo': results.get(roomID)!.teamTwo
                };
            } else {
                // Team 2 won the trick.
                newScore = {
                    'teamOne': results.get(roomID)!.teamOne,
                    'teamTwo': results.get(roomID)!.teamTwo + 1
                };
            }

            results.set(roomID, newScore);
            
            io.in(roomID).emit('trick-over', results.get(roomID));
            io.in(rooms.get(roomID)![winnerIndex]).emit('your-turn'); // Sending info to trick winner.
            return;
        }

        const currentTurn = (currentTurns.get(roomID)! + 1) % 4;
        currentTurns.set(roomID, currentTurn);
        io.in(rooms.get(roomID)![currentTurn]).emit('your-turn');
    });


    socket.on('bid', (bid: Bid) => {
        // TODO - doubles/redoubles
        const roomID = playerRooms.get(socket.id)!;
        const lastBid = biddingHistory.get(roomID)![biddingHistory.get(roomID)!.length - 1];

        if (!checkCorrectBid(bid, lastBid)) {
            console.log("Illegal bid / Not your turn!");
            return;
        } // TODO - testing, add turn check later

        biddingHistory.get(roomID)!.push(bid);

        console.log(biddingHistory);

        if (checkForThreePasses(roomID)) {
            // Bidding is over.
            console.log("Bidding over");
            let declarer = findDeclarer(biddingHistory.get(roomID)!);
            currentDummy.set(roomID, (declarer + 2) % 4);

            //currentTurns.set(roomID, (declarer + 1) % 4); // TODO
            console.log("Declarer: " + declarer);
            console.log("Dummy: " + currentDummy.get(roomID));
            io.in(roomID).emit('bidding-over');

            return;
        }

        console.log("Bid made by: " + socket.id + " " + bid.value)
        io.in(roomID).emit('bid-made', bid);
    });


    socket.on('get-hands', () => {
        sendCards(socket);
    });
});