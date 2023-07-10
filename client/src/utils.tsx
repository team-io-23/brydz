import { socket } from "./components/App";

// TODO: wydzielić te typy wspólnie dla servera i clienta bo są takie same w większości

// Interface of a card.
export interface Card {
    rank: string;
    suit: string;
    symbol: string;
}


export interface Contract {
    value: string;
    trump: string;
    doubles: string; // "", "X", "XX"
}


export interface Bid {
    value: string;
    trump: string;
    doubles: string; // "", "X", "XX"
    bidder: number;
}


export interface Hand {
    cards: Array<Card>;
    player: number;
}


export interface Trick {
    cards: Array<Card>;
    winner: number;
}


export interface Score {
    teamOne: number;
    teamTwo: number;
}

export interface Points {
    Beneath: Array<Array<Array<number>>>;
    Above: Array<Array<number>>;
    Vulnerable: Array<boolean>;
}

// handles joining room
export function joinRoom(roomNumber: number, navigate: (arg0: string) => void){
    socket.emit("joining-room", roomNumber);
    console.log("trying to join no:" + roomNumber);
    socket.on("joined-room", (room: string) => {
        navigate("/waitingRoom");
        localStorage.setItem(`room-${socket.id}`, room);
        console.log("Joined room: " + localStorage.getItem(`room-${socket.id}`));
        return;
    });
    socket.on("room-is-full", function (){
        alert("The room you are trying to join is full.");
        navigate("/mainMenu");
        socket.emit("get-roomlist");
        return;
    });
}

// Returns a boolean value if the card is a legal card to play or not.
export function checkCorrectCard(playerCards: Array<Card>, cardSuit: string, playingSuit: string) {
    if (playingSuit === "" || playingSuit === cardSuit) {
        return true;
    }

    let hasAnyInSuit = false;
    for (let i = 0; i < playerCards.length; i++) {
        if (playerCards[i].suit === playingSuit) {
            hasAnyInSuit = true;
            break;
        }
    }

    if (!hasAnyInSuit) {
        return true;
    }

    return false;
}


// Returns an array of all the possible bidding options.
export function BiddingOptions () {
    let options = [];
    for (let i = 1; i <= 7; i++) {
        options.push({ "value": i, "trump": "clubs", symbol: "♣"});
        options.push({ "value": i, "trump": "diams", symbol: "♦"});
        options.push({ "value": i, "trump": "hearts", symbol: "♥"});
        options.push({ "value": i, "trump": "spades", symbol: "♠"});
        options.push({ "value": i, "trump": "no-trump", symbol: "NT"});
    }

    options.push({ "value": "pass", "trump": "none", symbol: ""});
    options.push({ "value": "X", "trump": "none", symbol: ""});
    options.push({ "value": "XX", "trump": "none", symbol: ""});

    return options;
}

export function IsPassBid(bid: Bid) {
    return bid.value === "pass";
}

export const ZERO_BID = JSON.stringify({value: "0", trump: "none", doubles: "", bidder: -1});

export const trumpSymbols = new Map<string, string>([
    ["clubs", "♣"],
    ["diams", "♦"],
    ["hearts", "♥"],
    ["spades", "♠"],
    ["no-trump", "NT"],
    ["none", ""]
]);

// TODO - fajnie jakby jednak North był jako 0
export const seats = new Map<number, string>([
    [0, "South"],
    [1, "West"],
    [2, "North"],
    [3, "East"]
]);

export const arr = [0, 1, 2, 3]; // Fake array to map over