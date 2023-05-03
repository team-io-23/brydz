import './cards.css';
import './buttons.css';

var selectedCard: [string, string, string];

function HandView() {
    var playerHand: [string, string, string][] = [["a", "clubs", "♣"], ["k", "spades", "♠"], ["q", "hearts", "♥"], ["j", "diams", "♦"], ["10", "clubs", "♣"], ["9", "spades", "♠"], ["8", "hearts", "♥"], ["7", "diams", "♦"], ["6", "clubs", "♣"], ["5", "spades", "♠"], ["4", "hearts", "♥"], ["3", "diams", "♦"], ["2", "clubs", "♣"]];

    function selectCard(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        var myCards = document.getElementsByClassName("myAllCards");
        for (var i = 0; i < myCards.length; i++) {
            if (myCards[i].classList.contains("selected")) {
                myCards[i].classList.remove("selected");
            }
        }
        var card = document.getElementById(event.currentTarget.id + "card");
        card?.classList.add("selected");
        selectedCard = playerHand[parseInt(event.currentTarget.id)];
        console.log(selectedCard);

    }

    return (
        <div className="myHand">
            <div className="playingCards faceImages">
                <ul className="table">
                    {playerHand.map(([card, suit, symbol], index) => (
                        <li key={index} onClick={selectCard} id={index.toString()}>
                            <a className={`card rank-${card} ${suit} myAllCards`} id={index + "card"}>
                                <span className="rank">{card.toUpperCase()}</span>
                                <span className="suit">{symbol}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function GetSelectedCardButton() {
    function getSelectedCard() {
        console.log(selectedCard);
    }
    return (
        <button className='basicButton' onClick={getSelectedCard}>Get Selected Card</button>
    );
}

export default HandView;
export { GetSelectedCardButton };