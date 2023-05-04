import CurrentScore from "./CurrentScore";
import CurrentContract from "./CurrentContract";
import './TopBar.css'
import { Result } from "./Room";

function TopBar(result: Result) {
    const contract: [string, string] = ["3", "♦"];

    return (
        <div className="top-container">
            <CurrentScore teamOne={result.teamOne} teamTwo={result.teamTwo} />
            <CurrentContract contract={contract} />
        </div>
    )
}

export default TopBar;