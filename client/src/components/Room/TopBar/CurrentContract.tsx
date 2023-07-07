import './TopBar.css';
import React from "react";
import { Contract, trumpSymbols } from "../../../utils";

const CurrentContract: React.FC<Contract> = ({ value, trump, doubles }) => {
    // TODO - coloring of suit
    let symbol = trumpSymbols.get(trump)!;
    return (
        <div className="info-box content">
            Contract: 
            <div className="contract-box">
                {value} {symbol} {doubles}
            </div>
        </div>
    )
}

export default CurrentContract;