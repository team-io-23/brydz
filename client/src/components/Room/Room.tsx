import HandView from "./HandView";
import { GetSelectedCardButton } from "./HandView";
import TopBar from "./TopBar";
function Room() {


    return (
        <div>
            <h1>Room</h1>

            <GetSelectedCardButton />
            <TopBar />
            <HandView />
        </div>
    )
}

export default Room;