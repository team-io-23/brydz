import { Hand, Card, Bid } from './types';

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

    while (lastBid.value === 'pass' || lastBid.value === 'double' || lastBid.value === 'redouble') {
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