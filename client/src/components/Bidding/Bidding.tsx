import { BiddingOptions, Bid, checkCorrectBid } from "../../utils";
import { Button } from "@mui/material";
import "./Bidding.css";

// TODO: testing html
function Bidding () {
    let biddingOptions = BiddingOptions();

    function handleBid(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let turn = localStorage.getItem("turn") === "true";

        let bidString = event.currentTarget.className.split("button ")[1];
        let currentBidString = localStorage.getItem("bid");

        if (!currentBidString) {
            currentBidString = "0 pass";
        }

        let bid = {value: bidString.split(" ")[0], trump: bidString.split(" ")[1]};
        let currentBid = {value: currentBidString.split(" ")[0], trump: currentBidString.split(" ")[1]};

        /*if (!turn || !checkCorrectBid(bid, currentBid)) {
            console.log("Illegal bid / Not your turn!");
            return;
        }*/ // TODO - testing, remove comment later

        alert("Bid " + bid);
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