import { useState } from "react";
import { socket } from "../App";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { ZERO_BID, arr } from "../../utils";
import SeatIndicator from "../Room/SeatIndicator";
import SeatButton from "./SeatButton";
import PlayersList from "./PlayersList";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LogoutIcon from '@mui/icons-material/Logout';

import "../Room/Table.css";
import "../Room/Room.css";
import "./WaitingRoom.css";

function WaitingRoom() {
    let [playersInRoom, setPlayersInRoom] = useState<string[]>([]);
    let [seats, setSeats] = useState<number[]>([-1, -1, -1, -1]);

    let navigate = useNavigate();

    let currentRoomID = localStorage.getItem(`room-${socket.id}`)!;

    socket.on("player-change", (players: Array<string>) => {
        setPlayersInRoom(players);
    });

    socket.on("seat-change", (newSeats: number[]) => {
        setSeats(newSeats);
    });

    socket.on("started-game", (players: Array<string>) => {
        console.log("Started game");
        setPlayersInRoom(players);
        let nickname = localStorage.getItem(`nickname-${socket.id}`)!;
        console.log("nickname: " + nickname);
        console.log("players: " + playersInRoom);
        localStorage.setItem(`players-${socket.id}`, JSON.stringify(playersInRoom));
        localStorage.setItem(`bid-turn-${socket.id}`, "0"); // TODO - randomize, 0 for testing purposes
        localStorage.setItem(`bid-history-${socket.id}`, JSON.stringify([[ZERO_BID]]));
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
            <div className="play-area-container">
                <div className='top-container-waiting-room'>
                    Room #{currentRoomID}
                </div>
                <div className="play-table">
                    {/* TODO - ładnie połączyć w jedno */}
                    {arr.map((sth, index) =>
                        <SeatIndicator seat={index} relative={index}/>
                    )}

                    {seats.map((seat, index) =>
                        <SeatButton seat={index} taken={seat !== -1}/>
                    )}
                </div>                
            </div>
            <div className="info-container">
                <PlayersList players={playersInRoom}/>
                <NavLink 
                    to={{pathname:"/link/"+currentRoomID}}
                >
                    Invitation link
                </NavLink>
                <div className="buttons">
                    <Button variant="contained" onClick={handleStart} className="start-button">
                        <PlayArrowIcon sx={{ fontSize: 30 }}/>
                    </Button>
                    <Button variant="contained" onClick={handleLeave} className="leave-button">
                        <LogoutIcon sx={{ fontSize: 30 }}/>
                    </Button>
                </div>
            </div>
        </div>
        
    )
}

export default WaitingRoom;