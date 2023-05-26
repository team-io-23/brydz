import HandView from "./HandView/HandView";
import TopBar from "./TopBar";
import { socket } from "../App";
import { Contract, Hand, Score, seats } from "../../utils";
import { useEffect, useState } from "react";
import PlayedCards from "./PlayedCards";
import BiddingHistory from "../Bidding/BiddingHistory";
import NextPlayerIndicator from "./NextPlayerIndicator"; // TODO - coś jest bardzo spierdolone z tym

import "./Room.css";
import "./Table.css";

function Room() {
    let [result, setResult] = useState<Score>({ teamOne: 0, teamTwo: 0 });
    let [hands, setHands] = useState<Array<Hand>>([
        { cards: [], player: 0 },
        { cards: [], player: 1 },
        { cards: [], player: 2 },
        { cards: [], player: 3 },
    ]);
    let [dummy, setDummy] = useState<number>(-1);

    useEffect(() => {
        socket.emit("get-hands");
        socket.emit("get-dummy");
        console.log("Getting hands");
    }, []);

    socket.on("trick-over", (results: Score) => {
        // TODO: Clear table when trick is over.
        localStorage.setItem(`suit-${socket.id}`, ""); // Reset current suit

        // Updating score.
        setResult(results);
    });


    socket.on("hand-update", (hands: Array<Hand>) => {
        setHands(hands);
        console.log("setting hands:");
        console.log(hands);
    }); 

    socket.on("dummy-info", (dummy: number) => {
        setDummy(dummy);
        localStorage.setItem(`dummy-${socket.id}`, dummy.toString());
    });

    let contract:Contract = JSON.parse(localStorage.getItem(`contract-${socket.id}`)!);
    let seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);

    // TODO - połączyć w jedno
    function backHand(playerSeat: number) {
        let relativeSeat = (playerSeat - seat + 4) % 4;
        let direction = seats.get(relativeSeat)!.toLowerCase() + "Hand";
        let declarer = (dummy + 2) % 4;

        if (playerSeat !== seat && (playerSeat !== dummy || (playerSeat === dummy && seat !== declarer))) {
            return (
                <HandView player={playerSeat} position={direction} hand={hands[playerSeat]}/>
            )
        }
    }

    function frontHand(playerSeat: number) {
        let declarer = (dummy + 2) % 4;

        if (playerSeat === dummy && seat === declarer) {
            return (
                <HandView player={playerSeat} position='northHandDummy' hand={hands[playerSeat]}/>
            )
        } else if (playerSeat === seat) {
            return (
                <HandView player={playerSeat} position='southHand' hand={hands[playerSeat]}/>
            )
        }
    }

    return (
        <div>
            <div className="play-area-container">
                <TopBar result={result} contract={contract}/>
                <div className="play-table">
                    {hands.map((sth, index) => 
                        backHand(index)
                    )}
                    <PlayedCards />
                </div>

                {hands.map((sth, index) => 
                    frontHand(index)
                )}
                
            </div>
            <BiddingHistory />
        </div>
    )
}

export default Room;