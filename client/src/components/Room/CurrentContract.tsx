import './TopBar.css';
import React from "react";

interface Props {
    card: [string, string];
}


const CurrentContract: React.FC<Props> = ({ card }) => {
    return (
        <div className="info-box">
            {card[0]} of {card[1]}
        </div>
    )
}

export default CurrentContract;