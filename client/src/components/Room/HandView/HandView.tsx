import '../cards.css';
import '../buttons.css';
import React, { useState } from 'react';
import { Card, checkCorrectCard, trumpSymbols, Hand } from '../../../utils';
import { socket } from '../../App';

interface HandViewProps {
    player: number;
    position: string;
    hand: Hand
}

function HandView({ player, position, hand }: HandViewProps) {
    // TODO: Replace this with the actual hand.

    function playCard(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        let card = event.currentTarget.className;
        let cardRank = card.split(" ")[1].split("-")[1];
        let cardSuit = card.split(" ")[2];
        let turn = localStorage.getItem(`turn-${socket.id}`) === "true";
        let currentSuit = localStorage.getItem(`suit-${socket.id}`)!;

        if (!checkCorrectCard(hand.cards, cardSuit, currentSuit) || !turn) {
            console.log("Illegal card! / Not your turn!");
            console.log("Turn", turn);
            console.log(checkCorrectCard(hand.cards, cardSuit, currentSuit));
            return;
        }

        if (currentSuit === "") {
            localStorage.setItem(`suit-${socket.id}`, cardSuit);
        }

        localStorage.setItem(`turn-${socket.id}`, "false");

        // Symbol is not needed here, we can just keep it empty.
        socket.emit("play-card", { rank: cardRank, suit: cardSuit, symbol: '' });
    }

    function card(rank: string, suit: string, symbol: string) {
        return (
            <a className={`card rank-${rank} ${suit} myAllCards`} onClick={playCard}>
                <span className="rank">{rank.toUpperCase()}</span>
                <span className="suit">{symbol}</span>
            </a>
        )
    }


    function back() {
        return (
            <a className="card back"></a>
        )
    }

    return (
        <div className={position}>
            <div className="playingCards faceImages">
                <ul className="table">
                    {hand.cards.map(({ rank, suit, symbol }, index) => (
                        <li key={index}>
                            {rank == 'none' ? back() : card(rank, suit, symbol)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HandView;