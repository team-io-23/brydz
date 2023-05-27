import { Trick } from '../../utils';

import './LastTrick.css'

interface LastTrickProps {
    lastTrick: Trick;
}

function LastTrick(props: LastTrickProps) {
    return (
        <div className="lastTrick">
            <div className="playingCards">
                {Array.from(props.lastTrick.cards).map(({ rank, suit, symbol }, index) => (
                    <ul className={`played-space-${index}`}>
                        <li key={rank + suit + symbol}>
                            <a className={`card rank-${rank} ${suit} myAllCards`}>
                                <span className="rank">{rank.toUpperCase()}</span>
                                <span className="suit">{symbol}</span>
                            </a>
                        </li>
                    </ul>
                ))}
            </div>
            ljlsadiljasidl
        </div>
    )
    
}

export default LastTrick