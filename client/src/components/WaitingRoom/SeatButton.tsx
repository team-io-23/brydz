import { Trick, arr, seats } from '../../utils';
import { socket } from '../App';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

import './SeatButton.css';

interface SeatButtonProps {
    seat: number;
    taken: boolean;
}

function SeatButton(props: SeatButtonProps) {
    function handleSitting() {
        socket.emit("choose-seat", props.seat);
    }

    let directionClass = seats.get(props.seat)!.toLowerCase() + "Button seatButton";
    if (props.taken) {
        directionClass += " taken";
        return (
            <Button variant="contained" className={directionClass}>
                <LogoutIcon fontSize='large'/>
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