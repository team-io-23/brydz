// Interface of a card.
export interface Card {
    rank: string;
    suit: string;
    symbol: string;
}


export interface Bid {
    value: string;
    trump: string;
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

    options.push({ "value": "pass", "trump": "none", symbol: "Pass"});
    options.push({ "value": "double", "trump": "none", symbol: "X"});
    options.push({ "value": "redouble", "trump": "none", symbol: "XX"});

    return options;
}

export const ZERO_BID = "0 clubs";

export const trumpSymbols = new Map<string, string>([
    ["clubs", "♣"],
    ["diams", "♦"],
    ["hearts", "♥"],
    ["spades", "♠"],
    ["no-trump", "NT"]
]);

const trumpValues = new Map<string, number>([
    ["clubs", 0],
    ["diams", 1],
    ["hearts", 2],
    ["spades", 3],
    ["no-trump", 4]
]);


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

    console.log("Bid: " + bid.value + " " + bid.trump + " " + trumpValue);
    console.log("Current Bid: " + currentBid.value + " " + currentBid.trump + " " + currentTrumpValue);

    if (bid.value > currentBid.value || (bid.value === currentBid.value && trumpValue > currentTrumpValue)) {
        return true;
    } else {
        return false;
    }
}