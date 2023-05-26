import { ArrowLeft } from '@mui/icons-material';
import { socket } from '../App';

import "./NextPlayerIndicator.css";

function NextPlayerIndicator() {
    let next = localStorage.getItem(`nextPlayer-${socket.id}`);
    if (next == null) {
        next = "0";
    }

    console.log("Next: " + next);
    return (
        <ArrowLeft className={`next-indicator-${next}`}/>
    )
}

export default NextPlayerIndicator;