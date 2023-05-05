import { BiddingOptions, Bid, checkCorrectBid, ZERO_BID } from "../../utils";
import { Button } from "@mui/material";
import "./Bidding.css";
import { socket } from "../App";
import { useNavigate } from "react-router";

// TODO: testing html
function Bidding () {
    let biddingOptions = BiddingOptions();
    let navigate = useNavigate();

    socket.on("bid-made", (bid: Bid) => {
        // TODO - doubles and redoubles
        if (bid.value !== "pass") {
            localStorage.setItem("bid", bid.value + " " + bid.trump);
        }
    });

    socket.on("bidding-over", () => {
        localStorage.setItem("contract", localStorage.getItem("bid")!);
        navigate("/room");
    });

    function handleBid(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let turn = localStorage.getItem("turn") === "true";

        let bidString = event.currentTarget.className.split("button ")[1];
        let currentBidString = localStorage.getItem("bid")!;

        let bid = {value: bidString.split(" ")[0], trump: bidString.split(" ")[1]};
        let currentBid = {value: currentBidString.split(" ")[0], trump: currentBidString.split(" ")[1]};

        if (!checkCorrectBid(bid, currentBid)) {
            console.log("Illegal bid / Not your turn!");
            return;
        } // TODO - testing, add turn check later

        socket.emit("bid", bid);

        alert("Bid " + bid.value + " " + bid.trump);
    }

    return (
        <div className="bidding">
            <div className="bidding-options">
                {biddingOptions.map(({ value, trump, symbol }) => (
                    <button className={ `button ${value} ${trump}` } onClick={handleBid}>
                        {value} {symbol}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Bidding;