import { PlayerHandView, DummyHandView } from "./HandView/HandView";
import { NorthHandView, WestHandView, EastHandView } from "./HandView/BackHandView";
import TopBar from "./TopBar";
import { socket } from "../App";
import { Contract, Hand, Score } from "../../utils";
import { useState } from "react";
import PlayedCards from "./PlayedCards";
import BiddingHistory from "../Bidding/BiddingHistory";
import NextPlayerIndicator from "./NextPlayerIndicator"; // TODO - coś jest bardzo spierdolone z tym

import "./Room.css";
import "./Table.css";

function Room() {
    let [result, setResult] = useState<Score>({ teamOne: 0, teamTwo: 0 });
    let [hands, setHands] = useState<Array<Hand>>([]);

    socket.on("trick-over", (results: Score) => {
        // TODO: Clear table when trick is over.
        localStorage.setItem(`suit-${socket.id}`, ""); // Reset current suit

        // Updating score.
        setResult(results);
    });


    socket.on("update-hands", (hands: Array<Hand>) => {
        setHands(hands);
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
                <PlayerHandView/>
            </div>
            <BiddingHistory />
        </div>
    )
}

export default Room;