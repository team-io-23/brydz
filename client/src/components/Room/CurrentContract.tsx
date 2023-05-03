import './TopBar.css';
import React from "react";

interface Props {
    contract: [string, string];
}


const CurrentContract: React.FC<Props> = ({ contract }) => {
    // TODO - coloring of suit
    return (
        <div className="info-box right">
            Contract: 
            <div className="contract-box">
                {contract[0]} {contract[1]}
            </div>
        </div>
    )
}

export default CurrentContract;