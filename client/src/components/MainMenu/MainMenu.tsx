import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './MainMenu.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NavBar from '../NavBar/NavBar';
import { socket } from '../App';
import RoomList from './RoomList';


function MainMenu(){
    let [roomList, setRoomList] = useState<string[]>([]);
    let [seatsTaken, setSeatsTaken] = useState<number[]>([]);
    const navigate = useNavigate();

    function handleCreate(){
        socket.emit("creating-room", "");
        socket.on("created-room", (room: string) => {
            localStorage.setItem(`room-${socket.id}`, room);
            console.log("Created room: " + localStorage.getItem(`room-${socket.id}`));
            navigate("/waitingRoom");
        });
    } 

    socket.on("roomlist-change", (newRoomList: Array<string>) => {
        setRoomList(newRoomList);
    });
    socket.on("seatstaken-change", (newSeatsTaken: number[]) => {
        setSeatsTaken(newSeatsTaken);
    });

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleCreate}
            >
                create room
            </Button>
            <RoomList rooms={roomList} seats={seatsTaken} navigate={navigate}/>
        </div>
    );
}

export default MainMenu;