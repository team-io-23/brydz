import '../cards.css';
import '../buttons.css';
import React, { useState } from 'react';
import { Card, checkCorrectCard } from '../../../utils';
import { socket } from '../../App';

function BackHandView(position: string) {
    var playerHand: Array<Card> = [ // TODO
        { rank: "a", suit: "clubs", symbol: "♣" },
        { rank: "k", suit: "spades", symbol: "♠" },
        { rank: "q", suit: "hearts", symbol: "♥" },
        { rank: "j", suit: "diams", symbol: "♦" },
        { rank: "10", suit: "clubs", symbol: "♣" },
        { rank: "9", suit: "spades", symbol: "♠" },
        { rank: "8", suit: "hearts", symbol: "♥" },
        { rank: "7", suit: "diams", symbol: "♦" },
        { rank: "6", suit: "clubs", symbol: "♣" },
        { rank: "5", suit: "spades", symbol: "♠" },
        { rank: "4", suit: "hearts", symbol: "♥" },
        { rank: "3", suit: "diams", symbol: "♦" },
        { rank: "2", suit: "clubs", symbol: "♣" },
    ];

    let [hand, setHand] = useState<Array<Card>>(playerHand);

    return (
        <div className={position}>
            <div className="playingCards faceImages">
                <ul className="table">
                    {hand.map(({ rank, suit, symbol }) => (
                        <li key={rank + suit}>
                            <a className={'card back'}></a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function NorthHandView() {
    return BackHandView("northHand");
}

function WestHandView() {
    return BackHandView("westHand");
}

function EastHandView() {
    return BackHandView("eastHand");
}

function SouthHandView() {
    return BackHandView("southHand");
}

export default BackHandView;
export { BackHandView, NorthHandView, WestHandView, EastHandView, SouthHandView };