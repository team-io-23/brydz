import React from "react";
import './TopBar.css';
import { Result } from "./Room";

const CurrentScore: React.FC<Result> = ({ teamOne, teamTwo }) => {
    console.log(localStorage.getItem("players"));
    let players = localStorage.getItem("players")!.split(",");
    if (players.length !== 4) {
        players = ["Player 1", "Player 2", "Player 3", "Player 4"]; // TODO: testing purposes
    }

    return (
        <div className="info-box left">
            <div className="top-players">
                <div className="player">
                    {players[0]}
                </div>
                <div className="player">
                    {players[2]}
                </div>
            </div>
            <div className="score-box">
                <div>
                    {teamOne}
                </div>
                :
                <div>
                    {teamTwo}
                </div>
            </div>
            <div className="top-players">
                <div className="player">
                    {players[1]}
                </div>
                <div className="player">
                    {players[3]}
                </div>
            </div>

        </div>
    );
};

export default CurrentScore;