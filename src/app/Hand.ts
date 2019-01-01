import Card from "./Card";
import Game from "./Game";

export enum Status { Unknown, Won, Lost, Push }
export enum CountMethod { Soft, Hard }

class Hand {

  public game: Game = null;
  public cards: Card[] = [];
  public stood: boolean = false;
  public played: boolean = false;

  constructor(game: Game) {
    this.game = game;
  }

  public dealCard(): void {
    this.cards.push(this.game.shoe.getNextCard());
  }
}

export default Hand;
