import { BiddingOptions, Bid, IsPassBid, Hand, seats } from "../../utils";
import { Button } from "@mui/material";
import "./Bidding.css";
import { socket } from "../App";
import { useNavigate } from "react-router";
import CurrentContract from "../Room/CurrentContract";
import { useEffect, useState } from "react";
import CurrentBidder from "./CurrentBidder";
import BiddingHistory from "./BiddingHistory";
import HandView from "../Room/HandView/HandView";

import "./Bidding.css";
import "../Room/TopBar.css";

// TODO: testing html
function Bidding () {
    let biddingOptions = BiddingOptions();
    let navigate = useNavigate();

    let [bid, setBid] = useState<Bid>({value: "0", trump: "none", bidder: -1}); // Zero bid placeholder.
    let [prevBid, setPrevBid] = useState<Bid>({value: "0", trump: "none", bidder: -1}); // Needed for the bullshit that is about to start.
    let [actualBid, setActualBid] = useState<Bid>({value: "0", trump: "none", bidder: -1}); // Last non-pass bid.
    let [hands, setHands] = useState<Hand[]>([
        { cards: [], player: 0 },
        { cards: [], player: 1 },
        { cards: [], player: 2 },
        { cards: [], player: 3 },
    ]);

    useEffect(() => {
        socket.emit("get-hands");
    }, []);
    
    useEffect(() => {
        console.log("Bidders: " + bid.bidder + ' ' + prevBid.bidder)
        if (bid.bidder === prevBid.bidder) {
            // This is a fix to a weird bug where the bid is emitted once but received multiple times.
            return;
        }

        setPrevBid(bid);

        if (!IsPassBid(bid)) {
            setActualBid(bid);
        }
        
        // Setting current turn.
        localStorage.setItem(`bid-turn-${socket.id}`, ((bid.bidder + 1) % 4).toString());
        
        let bidHistory:Array<Array<Bid>> = JSON.parse(localStorage.getItem(`bid-history-${socket.id}`)!);
        console.log(bidHistory);

        // New bidding round.
        if (bid.bidder == 0 || bidHistory.length == 1) { // TODO - 1 is because of the zero bid placeholder.
            bidHistory.push([]);
        }

        bidHistory[bidHistory.length - 1].push(bid);
        localStorage.setItem(`bid-history-${socket.id}`, JSON.stringify(bidHistory));
    }, [bid]);

    socket.on("bid-made", (newBid: Bid) => {
        // TODO - doubles and redoubles
        console.log("Bid value: " + newBid.value);
        setBid(newBid);
    });

    socket.on("bidding-over", () => {
        localStorage.setItem(`contract-${socket.id}`, JSON.stringify(actualBid));
        navigate("/room");
    });


    socket.on("hand-update", (hands: Hand[]) => {
        setHands(hands);
    })

    function handleBid(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let bidString = event.currentTarget.className.split("button ")[1];
        let seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);
        let myBid = {value: bidString.split(" ")[0], trump: bidString.split(" ")[1], bidder: seat};

        socket.emit("bid", myBid);
    }

    let seat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);

    function hand(playerSeat: number) { 
        let relativeSeat = (playerSeat - seat + 4) % 4;
        let direction = seats.get(relativeSeat)!.toLowerCase() + "Hand";

        return (
            <HandView player={playerSeat} position={direction} hand={hands[playerSeat]}/>
        )
    }

    return (
        <div className="bidding">
            <BiddingHistory />
            <div className="play-area-container">
            <div className="top-container">
                <CurrentBidder />
                <CurrentContract value={actualBid.value} trump={actualBid.trump} />
            </div>

                <div className="play-table">
                    {hands.map((sth, index) => 
                        hand(index)
                    )}
                </div>
            </div>

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