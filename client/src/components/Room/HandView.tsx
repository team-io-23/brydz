import './cards.css';
function HandView() {
    var playerHand: [string, string][] = [["A", "♣"], ["K", "♠"], ["Q", "♥"], ["J", "♦"], ["10", "♣"], ["9", "♠"], ["8", "♥"], ["7", "♦"], ["6", "♣"], ["5", "♠"], ["4", "♥"], ["3", "♦"], ["2", "♣"]];
    return (
        <div className='hand'>
            {playerHand.map((card, index) => (
                <div className='playing-card'>
                    <input id={`card-${index}`} type='checkbox' />
                    <label htmlFor={`card-${index}`} className={card[1]}>
                        <div className='card-front' data-card={`${card[0]}${card[1]}`}>
                            <span>{card[1]}</span>
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
}

export default HandView;