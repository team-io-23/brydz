import React from "react";
import './TopBar.css';
interface Props {
    score: [number, number];
}

const CurrentScore: React.FC<Props> = ({ score }) => {
    return (
        <div className="info-box">
            <div className="top-players">
                <div className="player">
                    Player 1
                </div>
                <div className="player">
                    Player 2
                </div>
            </div>
            <div className="score-box">
                <div>
                    {score[0]}
                </div>
                :
                <div>
                    {score[1]}
                </div>
            </div>
            <div className="top-players">
                <div className="player">
                    Player 3
                </div>
                <div className="player">
                    Player 4
                </div>
            </div>

        </div>
    );
};

export default CurrentScore;