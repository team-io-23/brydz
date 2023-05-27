import CurrentScore from "./CurrentScore";
import CurrentContract from "./CurrentContract";
import './TopBar.css'
import { Contract, Score } from "../../../utils";

interface Props {
    result: Score;
    contract: Contract;
}

function TopBar(props: Props) {
    return (
        <div className="top-container">
            <CurrentScore teamOne={props.result.teamOne} teamTwo={props.result.teamTwo} />
            <CurrentContract value={props.contract.value} trump={props.contract.trump} />
        </div>
    )
}

export default TopBar;