import { Hand, Card, Bid } from './types';

// TODO - ładniej to
export const allCards = [
    { suit: 'spades', rank: '2', symbol:'♠' },
    { suit: 'spades', rank: '3', symbol:'♠' },
    { suit: 'spades', rank: '4', symbol:'♠' },
    { suit: 'spades', rank: '5', symbol:'♠' },
    { suit: 'spades', rank: '6', symbol:'♠' },
    { suit: 'spades', rank: '7', symbol:'♠' },
    { suit: 'spades', rank: '8', symbol:'♠' },
    { suit: 'spades', rank: '9', symbol:'♠' },
    { suit: 'spades', rank: '10', symbol:'♠' },
    { suit: 'spades', rank: 'j', symbol:'♠' },
    { suit: 'spades', rank: 'q', symbol:'♠' },
    { suit: 'spades', rank: 'k', symbol:'♠' },
    { suit: 'spades', rank: 'a', symbol:'♠' },
    { suit: 'hearts', rank: '2', symbol:'♥' },
    { suit: 'hearts', rank: '3', symbol:'♥' },
    { suit: 'hearts', rank: '4', symbol:'♥' },
    { suit: 'hearts', rank: '5', symbol:'♥' },
    { suit: 'hearts', rank: '6', symbol:'♥' },
    { suit: 'hearts', rank: '7', symbol:'♥' },
    { suit: 'hearts', rank: '8', symbol:'♥' },
    { suit: 'hearts', rank: '9', symbol:'♥' },
    { suit: 'hearts', rank: '10', symbol:'♥' },
    { suit: 'hearts', rank: 'j', symbol:'♥' },
    { suit: 'hearts', rank: 'q', symbol:'♥' },
    { suit: 'hearts', rank: 'k', symbol:'♥' },
    { suit: 'hearts', rank: 'a', symbol:'♥' },
    { suit: 'clubs', rank: '2', symbol:'♣' },
    { suit: 'clubs', rank: '3', symbol:'♣' },
    { suit: 'clubs', rank: '4', symbol:'♣' },
    { suit: 'clubs', rank: '5', symbol:'♣' },
    { suit: 'clubs', rank: '6', symbol:'♣' },
    { suit: 'clubs', rank: '7', symbol:'♣' },
    { suit: 'clubs', rank: '8', symbol:'♣' },
    { suit: 'clubs', rank: '9', symbol:'♣' },
    { suit: 'clubs', rank: '10', symbol:'♣' },
    { suit: 'clubs', rank: 'j', symbol:'♣' },
    { suit: 'clubs', rank: 'q', symbol:'♣' },
    { suit: 'clubs', rank: 'k', symbol:'♣' },
    { suit: 'clubs', rank: 'a', symbol:'♣' },
    { suit: 'diams', rank: '2', symbol:'♦' },
    { suit: 'diams', rank: '3', symbol:'♦' },
    { suit: 'diams', rank: '4', symbol:'♦' },
    { suit: 'diams', rank: '5', symbol:'♦' },
    { suit: 'diams', rank: '6', symbol:'♦' },
    { suit: 'diams', rank: '7', symbol:'♦' },
    { suit: 'diams', rank: '8', symbol:'♦' },
    { suit: 'diams', rank: '9', symbol:'♦' },
    { suit: 'diams', rank: '10', symbol:'♦' },
    { suit: 'diams', rank: 'j', symbol:'♦' },
    { suit: 'diams', rank: 'q', symbol:'♦' },
    { suit: 'diams', rank: 'k', symbol:'♦' },
    { suit: 'diams', rank: 'a', symbol:'♦' }
]

export const placeholderCard: Card = { rank: 'none', suit: 'none', symbol: 'none' }

export const cardValues = new Map<string, number>([
    ['a', 14], ['k', 13], ['q', 12], ['j', 11], ['10', 10], ['9', 9], ['8', 8],
    ['7', 7], ['6', 6], ['5', 5], ['4', 4], ['3', 3], ['2', 2]
])

export const trumpValues = new Map<string, number>([
    ["none", 0], ["clubs", 1], ["diams", 2], ["hearts", 3], ["spades", 4], ["no-trump", 5]
]);

// This is different than trump values to make it more aesthetically pleasing.
// It has not effect on the game logic, only on the display.
const displaySuitValues = new Map<string, number>([
    ["none", 0], ["diams", 1], ["clubs", 2], ["hearts", 3], ["spades", 4]
]);

export function hideCards(hands: Hand[], player: number, dummy: number, show: boolean) {
    const resultHands: Hand[] = []

    for (let i = 0; i < hands.length; i++) {
        resultHands.push({ cards: [], player: i })

        if (i === player || (i === dummy && show)) {
            resultHands[i].cards = hands[i].cards
        } else {
            resultHands[i].cards = hands[i].cards.map(() => placeholderCard)
        }
    }

    return resultHands;
}


// Finds the last bid that is not a pass
export function findLastLegitBid(bids: Bid[]){
    let index = bids.length - 1;
    let lastBid = bids[index];

    while (lastBid.value === 'pass' || lastBid.value === 'X' || lastBid.value === 'XX') {
        index--;
        lastBid = bids[index];
    }

    return lastBid;
}


export function findDeclarer(bids: Bid[]) {
    const contractBid: Bid = findLastLegitBid(bids);
    const contractTrump: string = contractBid.trump;

    console.log(contractBid);
    console.log(bids);

    const declarer: number = bids.find(bid => bid.trump === contractTrump && bid.value !== 'pass')?.bidder!;

    return declarer;
}


export function cardComparator(card1: Card, card2: Card) {
    if (card1.suit === card2.suit) {
        return cardValues.get(card1.rank)! > cardValues.get(card2.rank)! ? 1 : -1;
    } else {
        return displaySuitValues.get(card1.suit)! > displaySuitValues.get(card2.suit)! ? 1 : -1;
    }
}

function doubles(bids: Bid[]) {
    const lastBid = findLastLegitBid(bids);
    const bidID = bids.indexOf(lastBid);

    let result: Bid | undefined;

    for (let i = bidID + 1; i < bids.length; i++) {
        if (bids[i].value === 'XX') {
            return bids[i];
        } else if (bids[i].value === 'X') {
            result = bids[i];
        }
    }
    
    if (result === undefined) {
        return lastBid;
    } else {
        return result;
    }
}


export function isDoubled(bids: Bid[]) {
    return doubles(bids).value === 'X';
}