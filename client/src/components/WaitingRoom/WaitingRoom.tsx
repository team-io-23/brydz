import { useState } from "react";
import { socket } from "../App";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

function WaitingRoom() {
    let [playersInRoom, setPlayersInRoom] = useState<string[]>([]);
    let navigate = useNavigate();

    socket.on("player-change", (players: Array<string>) => {
        setPlayersInRoom(players);
    });

    socket.on("started-game", () => {
        console.log("Started game");
        localStorage.setItem("players", playersInRoom.toString());
        navigate("/room");
    });

    function handleLeave() {
        socket.emit("leaving-room", localStorage.getItem("nickname"));
        navigate('/');
    }


    function handleStart() {
        console.log(playersInRoom);
        /*if (playersInRoom.length !== 2) {
            alert("You need 4 players to start a game");
            return;
        }

        if (playersInRoom[0] != localStorage.getItem("nickname")) {
            alert("Only the host can start the game");
            return;
        }*/ // TODO - testing purposes. Remove comment later.

        socket.emit("start-game", localStorage.getItem("room"));
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
                onClick = {handleLeave}
            >
                Leave
            </Button>

            <Button
                variant = "contained"
                onClick = {handleStart}>
                Start
            </Button>
        </div>
    )
}

export default WaitingRoom;