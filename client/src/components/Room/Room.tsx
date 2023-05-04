import HandView from "./HandView";
import TopBar from "./TopBar";
import { socket } from "../App";
import { Card } from "../../utils";

function Room() {
    socket.on("your-turn", () => {
        console.log("It's your turn!");
        localStorage.setItem("turn", "true");
    });

    socket.on("trick-over", (winner: number) => {
        console.log("Trick over! Winner: " + winner);
        localStorage.setItem("suit", ""); // Reset current suit
    });

    return (
        <div>
            <TopBar />
            <HandView />
        </div>
    )
}

export default Room;