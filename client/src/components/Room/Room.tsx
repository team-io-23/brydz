import HandView from "./HandView";
import { GetSelectedCardButton } from "./HandView";
import CurrentScore from "./CurrentScore";
function Room() {
    return (
        <div>
            <h1>Room</h1>
            <CurrentScore score={0} />
            <GetSelectedCardButton />
            <HandView />
        </div>
    )
}

export default Room;