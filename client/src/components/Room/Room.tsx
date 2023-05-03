import HandView from "./HandView";
import { GetSelectedCardButton } from "./HandView";
import TopBar from "./TopBar";
function Room() {


    return (
        <div>
            <GetSelectedCardButton />
            <TopBar />
            <HandView />
        </div>
    )
}

export default Room;