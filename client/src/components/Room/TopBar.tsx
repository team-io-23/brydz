import CurrentScore from "./CurrentScore";
import CurrentContract from "./CurrentContract";
import './TopBar.css'
function getCurrentScore(): [number, number] {
    return [1, 3];
}

function TopBar() {
    const score: [number, number] = getCurrentScore();
    const card: [string, string] = ["Ace", "Diamonds"];

    return (
        <div className="top-container">
            <CurrentScore score={score} />
            <CurrentContract card={card} />
        </div>
    )
}

export default TopBar;