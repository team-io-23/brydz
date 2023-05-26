import { HandView, NorthHandView, WestHandView, EastHandView } from "./HandView";
import TopBar from "./TopBar";
import { socket } from "../App";
import { Contract } from "../../utils";
import { useState } from "react";
import PlayedCards from "./PlayedCards";
import BiddingHistory from "../Bidding/BiddingHistory";
import NextPlayerIndicator from "./NextPlayerIndicator"; // TODO - coś jest bardzo spierdolone z tym

import "./Room.css";
import "./Table.css";

// Team one - players 0 and 2, team two - players 1 and 3.
export interface Result {
    teamOne: number;
    teamTwo: number;
}

function Room() {
    let [result, setResult] = useState<Result>({ teamOne: 0, teamTwo: 0 });

    socket.on("trick-over", (winner: number) => {
        // TODO: Clear table when trick is over.
        console.log("Trick over! Winner: " + winner);
        localStorage.setItem(`suit-${socket.id}`, ""); // Reset current suit

        // Updating score.
        if (winner === 0 || winner === 2) {
            setResult({ teamOne: result.teamOne + 1, teamTwo: result.teamTwo });
        }
        else {
            setResult({ teamOne: result.teamOne, teamTwo: result.teamTwo + 1 });
        }

    });


    let contract:Contract = JSON.parse(localStorage.getItem(`contract-${socket.id}`)!);

    return (
        <div>
            <div className="play-area-container">
                <TopBar result={result} contract={contract}/>
                <div className="play-table">
                    <NorthHandView />
                    <WestHandView />
                    <EastHandView />
                    <PlayedCards />
                </div>
                <HandView />
            </div>
            <BiddingHistory />
        </div>
    )
}

export default Room;