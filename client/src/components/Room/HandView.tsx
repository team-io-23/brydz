import './cards.css';
import './buttons.css';
import React, { useState } from 'react';
import { Card, checkCorrectCard } from '../../utils';
import { socket } from '../App';
var selectedCard: [string, string, string];

function HandView() {
    // TODO: Replace this with the actual hand.
    var playerHand: Array<Card> = [
        {rank: "a", suit: "clubs", symbol: "♣"},
        {rank: "k", suit: "spades", symbol: "♠"},
        {rank: "q", suit: "hearts", symbol: "♥"},
        {rank: "j", suit: "diams", symbol: "♦"},
        {rank: "10", suit: "clubs", symbol: "♣"},
        {rank: "9", suit: "spades", symbol: "♠"},
        {rank: "8", suit: "hearts", symbol: "♥"},
        {rank: "7", suit: "diams", symbol: "♦"},
        {rank: "6", suit: "clubs", symbol: "♣"},
        {rank: "5", suit: "spades", symbol: "♠"},
        {rank: "4", suit: "hearts", symbol: "♥"},
        {rank: "3", suit: "diams", symbol: "♦"},
        {rank: "2", suit: "clubs", symbol: "♣"},
    ];

    let [hand, setHand] = useState<Array<Card>>(playerHand);

    function playCard(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        let card = event.currentTarget.className;
        let cardRank = card.split(" ")[1].split("-")[1];
        let cardSuit = card.split(" ")[2];
        let turn = localStorage.getItem("turn") === "true";
        let currentSuit = localStorage.getItem("suit")!;

        if (!checkCorrectCard(hand, cardSuit, currentSuit) || !turn) {
            console.log("Illegal card! / Not your turn!");
            return;
        }

        if (currentSuit === "") {
            localStorage.setItem("suit", cardSuit);
        }

        // Symbol is not needed here, we can just keep it empty.
        socket.emit("play-card", {rank: cardRank, suit: cardSuit, symbol: ""});
        console.log("Played " + cardRank + " of " + cardSuit);
        // Remove card from hand
        setHand(hand.filter((card) => card.rank !== cardRank || card.suit !== cardSuit));
        localStorage.setItem("turn", "false");
    }

    return (
        <div className="myHand">
            <div className="playingCards faceImages">
                <ul className="table">
                    {hand.map(({rank, suit, symbol}) => (
                        <li>
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

export default HandView;