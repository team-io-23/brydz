import { socket } from '../App';
import { seats } from '../../utils';

import "./SeatIndicator.css";

interface SeatIndicatorProps {
    seat: number;
    relative: number;
}

function SeatIndicator(props: SeatIndicatorProps) {
    let direction = seats.get(props.seat)!.substring(0, 1).toUpperCase();
    let relativePosition = seats.get(props.relative)!.toLowerCase();
    let positionClass = "seatIndicator " + relativePosition;

    return (
        <div className={positionClass}>{direction}</div>
    )
}

export default SeatIndicator;