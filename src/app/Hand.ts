import Card from './Card';
import Game from './Game';

export enum Status { Unknown, Won, Lost, Push }
export enum CountMethod { Soft, Hard }

class Hand {

  game: Game = null;
  cards: Card[] = [];
  stood: boolean = false;
  played: boolean = false;

  constructor(game: Game) {
    this.game = game;
    const c = new Card({value: 0, suitValue: 0});
    this.cards.push(c);
  }

  isBusted() : boolean {
    return false;
  }

  isBlackjack() : boolean {
    if(this.cards.length != 2) {
      return false;
    }

    if(this.cards[0].isAce() && this.cards[1].isTen()) {
      return true;
    }

    if(this.cards[1].isAce() && this.cards[0].isTen()) {
      return true;
    }

    return false;
  }

  isDone() : boolean {
    return false;
  }

  dealCard() : void {

  }
}

export default Hand;
