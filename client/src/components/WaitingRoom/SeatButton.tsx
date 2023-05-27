import { Trick, arr, seats } from '../../utils';
import { socket } from '../App';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

import './SeatButton.css';

interface SeatButtonProps {
    seat: number;
    taken: boolean;
}

function SeatButton(props: SeatButtonProps) {
    function handleSitting() {
        socket.emit("choose-seat", props.seat);
        localStorage.setItem(`seat-${socket.id}`, props.seat.toString());
    }

    function handleLeaveSeat() {
        socket.emit("leave-seat", props.seat);
        localStorage.setItem(`seat-${socket.id}`, "");
    }

    let directionClass = seats.get(props.seat)!.toLowerCase() + "Button seatButton";

    if (props.taken) {
        let mySeat = parseInt(localStorage.getItem(`seat-${socket.id}`)!) == props.seat;

        if (mySeat) {
            directionClass += " mySeat";
            return (
                <Button variant="contained" onClick={handleLeaveSeat} className={directionClass}>
                    <LogoutIcon fontSize='large'/>
                </Button>
            )
        } else {
            directionClass += " taken";
            return (
                <Button variant="contained" className={directionClass}>
                    <CloseIcon fontSize='large'/>
                </Button>
            )
        }
    }

    return (
        <Button variant="contained" color="primary" onClick={handleSitting} className={directionClass}>
            <AddIcon fontSize='large'/>
        </Button>
    )
}

export default SeatButton