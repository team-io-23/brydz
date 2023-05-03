import CurrentScore from "./CurrentScore";
import CurrentContract from "./CurrentContract";
import './TopBar.css'
function getCurrentScore(): [number, number] {
    return [1, 3];
}

function TopBar() {
    const score: [number, number] = getCurrentScore();
    const contract: [string, string] = ["3", "♦"];

    return (
        <div className="top-container">
            <CurrentScore score={score} />
            <CurrentContract contract={contract} />
        </div>
    )
}

export default TopBar;