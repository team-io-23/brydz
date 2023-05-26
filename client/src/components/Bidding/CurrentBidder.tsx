import React from "react";
import './Bidding.css';
import { socket } from "../App";
import { seats } from "../../utils";

function CurrentBidder () {
    let bid_turn = localStorage.getItem(`bid-turn-${socket.id}`)!;
    let bid_turn_seat = seats.get(parseInt(bid_turn));

    return (
        <div className="info-box left">
            Current bidder: {bid_turn_seat}
        </div>
    );
};

export default CurrentBidder;