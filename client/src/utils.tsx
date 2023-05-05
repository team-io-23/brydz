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


export function checkCorrectBid(bid: Bid, currentBid: Bid) {
    return true;
}