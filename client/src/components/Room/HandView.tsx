import './cards.css';
import './buttons.css';
import React, { useState } from 'react';
import { Card, checkCorrectCard } from '../../utils';
import { socket } from '../App';

function HandView() {
    // TODO: Replace this with the actual hand.
    var playerHand: Array<Card> = [
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

    const symbols: { [key: string]: string } = {
        "clubs": "♣",
        "spades": "♠",
        "hearts": "♥",
        "diams": "♦",
    };

    let [hand, setHand] = useState<Array<Card>>(playerHand);

    function playCard(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        let card = event.currentTarget.className;
        let cardRank = card.split(" ")[1].split("-")[1];
        let cardSuit = card.split(" ")[2];
        let turn = localStorage.getItem(`turn-${socket.id}`) === "true";
        let currentSuit = localStorage.getItem(`suit-${socket.id}`)!;

        if (!checkCorrectCard(hand, cardSuit, currentSuit) || !turn) {
            console.log("Illegal card! / Not your turn!");
            console.log("Turn", turn);
            console.log(checkCorrectCard(hand, cardSuit, currentSuit));
            return;
        }

        if (currentSuit === "") {
            localStorage.setItem(`suit-${socket.id}`, cardSuit);
        }

        localStorage.setItem(`turn-${socket.id}`, "false");

        // Symbol is not needed here, we can just keep it empty.
        socket.emit("play-card", { rank: cardRank, suit: cardSuit, symbol: symbols[cardSuit] });
        console.log("Played " + cardRank + " of " + cardSuit);
        // Remove card from hand
        setHand(hand.filter((card) => card.rank !== cardRank || card.suit !== cardSuit));
    }

    return (
        <div className="southHand">
            <div className="playingCards faceImages">
                <ul className="table">
                    {hand.map(({ rank, suit, symbol }) => (
                        <li key={rank + suit}>
                            <a className={`card rank-${rank} ${suit} myAllCards`} onClick={playCard}>
                                <span className="rank">{rank.toUpperCase()}</span>
                                <span className="suit">{symbol}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}



function NorthHandView() {
    var playerHand: Array<Card> = [
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
        <div className="northHand">
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

function WestHandView() {
    var playerHand: Array<Card> = [
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
        <div className="westHand">
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

function EastHandView() {
    var playerHand: Array<Card> = [
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
        <div className="eastHand">
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

export default HandView;
export { HandView, NorthHandView, WestHandView, EastHandView };