// Interface of a card.
export interface Card {
    rank: string;
    suit: string;
    symbol: string;
}


export interface Contract {
    value: string;
    trump: string;
}


export interface Bid {
    value: string;
    trump: string;
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
    options.push({ "value": "double", "trump": "none", symbol: "X"});
    options.push({ "value": "redouble", "trump": "none", symbol: "XX"});

    return options;
}

export function IsPassBid(bid: Bid) {
    return bid.value === "pass";
}

export const ZERO_BID = JSON.stringify({value: "0", trump: "none", bidder: -1});

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