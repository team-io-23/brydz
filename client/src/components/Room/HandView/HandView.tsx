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

    // Seat - our actual seat, player - seat of the player whose hand we are viewing.
    let seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);
    let dummy = parseInt(localStorage.getItem(`dummy-${socket.id}`)!);

    function playCard(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        if (seat == dummy) {
            return;
        }
        
        let card = event.currentTarget.className;
        let cardRank = card.split(" ")[1].split("-")[1];
        let cardSuit = card.split(" ")[2];

        let turn = parseInt(localStorage.getItem(`turn-${socket.id}`)!);

        let isOurTurn = turn === seat;
        let isDummyTurn = turn === dummy;
        let isDummyCard = position === "northHandDummy";
        let canPlayFromDummy = (seat + 2) % 4 === dummy;
        let canPlay = isOurTurn || (isDummyTurn && isDummyCard && canPlayFromDummy);

        let currentSuit = localStorage.getItem(`suit-${socket.id}`)!;

        if (!checkCorrectCard(hand.cards, cardSuit, currentSuit) || !canPlay) {
            console.log("Illegal card! / Not your turn!");
            return;
        }

        if (currentSuit === "") {
            localStorage.setItem(`suit-${socket.id}`, cardSuit);
        }

        // Symbol is not needed here, we can just keep it empty.
        let played: Card = { rank: cardRank, suit: cardSuit, symbol: '' }
        socket.emit("play-card", {card: played, player: player});
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