import { socket } from "../App"

function BiddingHistory() {
    let bidHistory = localStorage.getItem(`bid-history-${socket.id}`);
    console.log(bidHistory)
    return (
        <div>
            {bidHistory}
        </div>
    )
}

export default BiddingHistory;