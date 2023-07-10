import HandView from "./HandView/HandView";
import TopBar from "./TopBar/TopBar";
import { socket } from "../App";
import { Contract, Hand, Score, seats, Trick, Points } from "../../utils";
import { useEffect, useState } from "react";
import PlayedCards from "./PlayedCards";
import BiddingHistory from "../Bidding/BiddingHistory";
import NextPlayerIndicator from "./NextPlayerIndicator"; // TODO - coś jest bardzo spierdolone z tym
import SeatIndicator from "./SeatIndicator";
import LastTrick from "./LastTrick";

import "./Room.css";
import "./Table.css";

function Room() {
    let [result, setResult] = useState<Score>({ teamOne: 0, teamTwo: 0 });
    let [hands, setHands] = useState<Hand[]>([
        { cards: [], player: 0 },
        { cards: [], player: 1 },
        { cards: [], player: 2 },
        { cards: [], player: 3 },
    ]);
    let [dummy, setDummy] = useState<number>(-1);
    let [lastTrick, setLastTrick] = useState<Trick>({ cards: [], winner: -1 });
    let [turn, setTurn] = useState<number>(1);
    let [points, setPoints] = useState<Points>({ Beneath: [[[]], [[]]], 
        Above: [[],[]], Vulnerable: [false, false]});

    useEffect(() => {
        socket.emit("get-hands");
        socket.emit("get-dummy");
        console.log("Getting hands");
    }, []);

    socket.on("trick-over", (results: Score, endedTrick: Trick) => {
        // TODO: Clear table when trick is over.
        localStorage.setItem(`suit-${socket.id}`, ""); // Reset current suit
        setLastTrick(endedTrick);
        setTurn(turn+1);
        console.log("Trick over");
        console.log(lastTrick);
        console.log(endedTrick);

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

    function calculateContractPoints(trump: string, n: number){
        if (trump == "clubs" || trump == "diams"){
            return n*20;
        }
        else if (trump == "hearts" || trump == "spades"){
            return n*30;
        }
        else if (trump == "no-trump" && n != 0){
            return 40 + (n - 1)*30;
        }
        return 0;
    }

    function givePoints(team: number){
        let oppTeam = Math.abs(team-1);

        // Points for fullfiling the contract
        if (+contract.value + 6 >= result.teamOne){
            let under = calculateContractPoints(contract.trump, +contract.value);

            if (contract.doubles == "X"){
                under *= 2;
            }
            else if (contract.doubles == "XX"){
                under *= 4;
            }
            points.Beneath[team][-1].push(under);
        
            // check if the team starts to be vulnerable/ends the game
            if (points.Beneath[team][-1].reduce((a: number, b: number) => a + b, 0) >= 100){
                if (points.Vulnerable[team]){
                    if (points.Vulnerable[oppTeam]){
                        points.Above[team].push(500);
                    }
                    else {
                        points.Above[team].push(700);
                    }
                    // TODO: skończyć grę tutaj
                }
                else {
                    points.Vulnerable[team] = true;
                    points.Beneath[0].push([]);
                    points.Beneath[1].push([]);
                }
            }
            
            // points for overtricks
            let overtricks = result.teamOne - +contract.value - 6;
            if (contract.doubles == ""){
                points.Above[team].push(calculateContractPoints(contract.trump, overtricks));
            }
            else {
                overtricks *= 100;
                if (contract.doubles == "XX"){
                    overtricks *= 2;
                }
                if (points.Vulnerable[team]){
                    overtricks *= 2;
                }
                points.Above[team].push(overtricks);
            }

            // points for slam and grand slam
            if (+contract.value == 6) {
                if (points.Vulnerable[team]){
                    points.Above[team].push(750);
                }
                else {
                    points.Above[team].push(500);
                } 
            }
            else if (+contract.value == 7) {
                if (points.Vulnerable[team]){
                    points.Above[team].push(1500);
                }
                else {
                    points.Above[team].push(750);
                } 
            }
            
        }

        // points for opponents for undertricks
        else {
            let undertricks = +contract.value + 6 - result.teamOne;
            if (contract.doubles == ""){
                if (points.Vulnerable[team]){
                    points.Above[oppTeam].push(100 * undertricks);
                }
                else {
                    points.Above[oppTeam].push(50 * undertricks);
                }
            }
            else {
                let above = 0;
                if (points.Vulnerable[team]){
                    above = 200 + Math.max(0, undertricks-1) * 300;
                }
                else {
                    if (undertricks >= 4) {
                        above = 500 + (undertricks-3)*300; 
                    }
                    else {
                        above = 100 + Math.max(0, undertricks-1) * 200;
                    }
                }

                if (contract.doubles == "XX"){
                    above *= 2;
                }
                points.Above[oppTeam].push(above);
            }
        }

    }

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

    // TODO - ten widok jest bardzo podobny tutaj i w Bidding - fajnie byłoby to jakoś połączyć
    return (
        <div>
            <div className="play-area-container">
                <TopBar result={result} contract={contract} turn={turn}/>
                <div className="play-table">
                    {hands.map((sth, index) => 
                        backHand(index)
                    )}

                    {hands.map((sth, index) => 
                        <SeatIndicator seat={index} relative={(index - seat + 4) % 4}/>
                    )}
                    <PlayedCards />
                </div>

                {hands.map((sth, index) => 
                    frontHand(index)
                )}
                
            </div>
            <div className="info-container">
                <BiddingHistory />
                <LastTrick lastTrick={lastTrick}/>
            </div>
        </div>
    )
}

export default Room;