import { HandView, NorthHandView, WestHandView, EastHandView } from "./HandView";
import Table from "./Table";
import TopBar from "./TopBar";
import { socket } from "../App";
import { Card } from "../../utils";
import { useState } from "react";
import PlayedCards from "./PlayedCards";
import { json } from "stream/consumers";

// Team one - players 0 and 2, team two - players 1 and 3.
export interface Result {
    teamOne: number;
    teamTwo: number;
}

function Room() {
    let [result, setResult] = useState<Result>({ teamOne: 0, teamTwo: 0 });

    socket.on("your-turn", () => {
        console.log("It's your turn!");
        localStorage.setItem(`turn-${socket.id}`, "true");
    });

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


    return (
        <div style={{ height: "300px" }}>
            <TopBar teamOne={result.teamOne} teamTwo={result.teamTwo} />
            <NorthHandView />
            <WestHandView />
            <EastHandView />
            <Table />
            <PlayedCards />
            <HandView />
        </div>
    )
}

export default Room;