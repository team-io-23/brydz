export interface Card {
    rank: string;
    suit: string;
    symbol: string;
}

export interface Bid {
    value: string;
    trump: string;
    bidder: number;
}

export interface Score {
    teamOne: number;
    teamTwo: number;
}

export interface Hand {
    cards: Array<Card>;
    player: number;
}

export interface PlayedCard {
    card: Card;
    player: number;
}