import { useState } from "react";
import { socket } from "../App";

function Room() {
    let [playersInRoom, setPlayersInRoom] = useState<string[]>([]);

    socket.on("new-player", (players: Array<string>) => {
        setPlayersInRoom(players);
    });

    // Testing HTML
    return (
        <div>
            <h1>Room</h1>
            <h2>Players in room:</h2>
            <ul>
                {playersInRoom.map((player, key) => (
                    <li key={key}>{player}</li>
                ))}
            </ul>
        </div>
    )
}

export default Room;