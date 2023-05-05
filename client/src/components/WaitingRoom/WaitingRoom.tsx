import { useState } from "react";
import { socket } from "../App";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { ZERO_BID } from "../../utils";

function WaitingRoom() {
    let [playersInRoom, setPlayersInRoom] = useState<string[]>([]);
    let navigate = useNavigate();

    socket.on("player-change", (players: Array<string>) => {
        setPlayersInRoom(players);
    });

    socket.on("started-game", () => {
        console.log("Started game");
        let nickname = localStorage.getItem(`nickname-${socket.id}`)!;
        localStorage.setItem(`players-${socket.id}`, playersInRoom.toString());
        localStorage.setItem(`seat-${socket.id}`, playersInRoom.indexOf(nickname).toString());
        localStorage.setItem(`bid-${socket.id}`, ZERO_BID);
        navigate("/bidding");
    });

    function handleLeave() {
        socket.emit("leaving-room", localStorage.getItem(`nickname-${socket.id}`));
        navigate('/');
    }


    function handleStart() {
        console.log(playersInRoom);
        /*if (playersInRoom.length !== 2) {
            alert("You need 4 players to start a game");
            return;
        }

        if (playersInRoom[0] != localStorage.getItem(`nickname-${socket.id}`)) {
            alert("Only the host can start the game");
            return;
        }*/ // TODO - testing purposes. Remove comment later.

        socket.emit("start-game", localStorage.getItem(`room-${socket.id}`));
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