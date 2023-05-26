import { Hand, Card } from './types';

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
    { suit: 'spades', rank: 'J', symbol:'♠' },
    { suit: 'spades', rank: 'Q', symbol:'♠' },
    { suit: 'spades', rank: 'K', symbol:'♠' },
    { suit: 'spades', rank: 'A', symbol:'♠' },
    { suit: 'hearts', rank: '2', symbol:'♥' },
    { suit: 'hearts', rank: '3', symbol:'♥' },
    { suit: 'hearts', rank: '4', symbol:'♥' },
    { suit: 'hearts', rank: '5', symbol:'♥' },
    { suit: 'hearts', rank: '6', symbol:'♥' },
    { suit: 'hearts', rank: '7', symbol:'♥' },
    { suit: 'hearts', rank: '8', symbol:'♥' },
    { suit: 'hearts', rank: '9', symbol:'♥' },
    { suit: 'hearts', rank: '10', symbol:'♥' },
    { suit: 'hearts', rank: 'J', symbol:'♥' },
    { suit: 'hearts', rank: 'Q', symbol:'♥' },
    { suit: 'hearts', rank: 'K', symbol:'♥' },
    { suit: 'hearts', rank: 'A', symbol:'♥' },
    { suit: 'clubs', rank: '2', symbol:'♣' },
    { suit: 'clubs', rank: '3', symbol:'♣' },
    { suit: 'clubs', rank: '4', symbol:'♣' },
    { suit: 'clubs', rank: '5', symbol:'♣' },
    { suit: 'clubs', rank: '6', symbol:'♣' },
    { suit: 'clubs', rank: '7', symbol:'♣' },
    { suit: 'clubs', rank: '8', symbol:'♣' },
    { suit: 'clubs', rank: '9', symbol:'♣' },
    { suit: 'clubs', rank: '10', symbol:'♣' },
    { suit: 'clubs', rank: 'J', symbol:'♣' },
    { suit: 'clubs', rank: 'Q', symbol:'♣' },
    { suit: 'clubs', rank: 'K', symbol:'♣' },
    { suit: 'clubs', rank: 'A', symbol:'♣' },
    { suit: 'diamonds', rank: '2', symbol:'♦' },
    { suit: 'diamonds', rank: '3', symbol:'♦' },
    { suit: 'diamonds', rank: '4', symbol:'♦' },
    { suit: 'diamonds', rank: '5', symbol:'♦' },
    { suit: 'diamonds', rank: '6', symbol:'♦' },
    { suit: 'diamonds', rank: '7', symbol:'♦' },
    { suit: 'diamonds', rank: '8', symbol:'♦' },
    { suit: 'diamonds', rank: '9', symbol:'♦' },
    { suit: 'diamonds', rank: '10', symbol:'♦' },
    { suit: 'diamonds', rank: 'J', symbol:'♦' },
    { suit: 'diamonds', rank: 'Q', symbol:'♦' },
    { suit: 'diamonds', rank: 'K', symbol:'♦' },
    { suit: 'diamonds', rank: 'A', symbol:'♦' }
]

export const placeholderCard: Card = { rank: 'none', suit: 'none', symbol: 'none' }

export function hideCards(hands: Hand[], player: number, dummy: number) {
    const resultHands: Hand[] = []

    for (let i = 0; i < hands.length; i++) {
        resultHands.push({ cards: [], player: i })

        if (i === player || i === dummy) {
            resultHands[i].cards = hands[i].cards
        } else {
            resultHands[i].cards = hands[i].cards.map(() => placeholderCard)
        }
    }

    return resultHands;
}