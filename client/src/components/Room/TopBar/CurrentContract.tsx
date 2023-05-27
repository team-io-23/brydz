import './TopBar.css';
import React from "react";
import { Contract, trumpSymbols } from "../../../utils";

const CurrentContract: React.FC<Contract> = ({ value, trump }) => {
    // TODO - coloring of suit
    let symbol = trumpSymbols.get(trump)!;
    return (
        <div className="info-box right">
            Contract: 
            <div className="contract-box">
                {value} {symbol}
            </div>
        </div>
    )
}

export default CurrentContract;