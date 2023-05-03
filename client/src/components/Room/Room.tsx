import { useState } from "react";
import { socket } from "../App";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

function Room() {
    let [playersInRoom, setPlayersInRoom] = useState<string[]>([]);
    let navigate = useNavigate();

    socket.on("player-change", (players: Array<string>) => {
        setPlayersInRoom(players);
    });

    function handleLeave() {
        socket.emit("leaving-room", localStorage.getItem("nickname"));
        navigate('/');
    }

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

            <Button
                variant = "contained"
                onClick={handleLeave}
            >
                Leave
            </Button>
        </div>
    )
}

export default Room;