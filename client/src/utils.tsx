// Interface of a card.
export interface Card {
    rank: string;
    suit: string;
    symbol: string;
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