import './cards.css';
function HandView() {
    var playerHand: [string, string, string][] = [["a", "clubs", "♣"], ["k", "spades", "♠"], ["q", "hearts", "♥"], ["j", "diams", "♦"], ["10", "clubs", "♣"], ["9", "spades", "♠"], ["8", "hearts", "♥"], ["7", "diams", "♦"], ["6", "clubs", "♣"], ["5", "spades", "♠"], ["4", "hearts", "♥"], ["3", "diams", "♦"], ["2", "clubs", "♣"]];
    return (
        <div className="playingCards faceImages">
            <ul className="table">
                {playerHand.map(([card, suit, symbol], index) => (
                    <li>
                        <a className={`card rank-${card} ${suit}`}>
                            <span className="rank">{card.toUpperCase()}</span>
                            <span className="suit">{symbol}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HandView;