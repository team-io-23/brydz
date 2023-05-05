import './cards.css';
import { Card, checkCorrectCard } from '../../utils';
import { socket } from '../App';
import React, { useState } from 'react';

function PlayedCards() {
    const [playedCards, setPlayedCards] = useState(new Map<number, Card>());

    function playCard(card: Card, index: number) {
        const newPlayedCards = new Map(playedCards);
        newPlayedCards.set(index, card);
        setPlayedCards(newPlayedCards);
    }

    socket.on("card-played", (card: Card, currentSuit: string, playedBy: number) => {
        // TODO: Do stuff when someone plays a card.
        // console.log("Current suit: " + currentSuit);
        // console.log("Player number " +    playedBy + " played card: " + card.rank + " of " + card.suit);
        localStorage.setItem("suit", currentSuit);
        localStorage.setItem("playedBy" + playedBy, JSON.stringify(card));
        playCard(card, playedBy);
    });


    return (
        <div className="playedCards">
            <div className="playingCards faceImages">
                {Array.from(playedCards).map(([index, { rank, suit, symbol }]) => (
                    <ul className={`played-space-${index}`}>
                        <li>
                            <a className={`card rank-${rank} ${suit} myAllCards`}>
                                <span className="rank">{rank.toUpperCase()}</span>
                                <span className="suit">{symbol}</span>
                            </a>
                        </li>
                    </ul>
                ))}
            </div>
        </div>
    );
}

export default PlayedCards;