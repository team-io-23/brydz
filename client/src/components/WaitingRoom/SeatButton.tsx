import { Trick, arr, seats } from '../../utils';
import { socket } from '../App';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

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

    let directionClass = seats.get(props.seat)!.toLowerCase() + "Button seatButton";
    if (props.taken) {
        directionClass += " taken";
        let mySeat = parseInt(localStorage.getItem(`seat-${socket.id}`)!);

        return (
            <Button variant="contained" className={directionClass}>
                {mySeat ? <LogoutIcon fontSize='large'/> : <CloseIcon fontSize='large'/>}
            </Button>
        )
    }

    return (
        <Button variant="contained" color="primary" onClick={handleSitting} className={directionClass}>
            <AddIcon fontSize='large'/>
        </Button>
    )
}

export default SeatButton