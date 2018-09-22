import Shoe from "./Shoe";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import {CountMethod} from "./Hand";

export const MIN_BET: number = 500;
export const MAX_BET: number = 10000000;

class Game {
  numDecks: number = 1;
  shoe: Shoe = null;
  dealerHand: DealerHand = null;
  playerHands: PlayerHand[] = [];

  currentPlayerHand: number = 0;
  currentBet: number = MIN_BET;
  money: number = 10000;

  constructor() {
    this.shoe = new Shoe(this.numDecks);
    this.dealerHand = new DealerHand(this);
  }

  run(): void {

  }

  allBets(): number {
    let allBets = 0;

    for (let x = 0; x < this.playerHands.length; x++) {
      allBets += this.playerHands[x].bet;
    }

    return allBets;
  }

  moreHandsToPlay(): boolean {
    return this.currentPlayerHand < this.playerHands.length - 1;
  }

  needToPlayDealerHand(): boolean {
    for (let x = 0; x < this.playerHands.length; x++) {
      let h = this.playerHands[x];

      if (!(h.isBusted() || h.isBlackjack())) {
        return true;
      }
    }

    return false;
  }

  splitCurrentHand(): void {
    let currentHand = this.playerHands[this.currentPlayerHand];

    if (!currentHand.canSplit()) {
      this.drawHands();
      currentHand.getAction();
      return;
    }

    this.playerHands.push(new PlayerHand(this, this.currentBet));

    // expand hands
    let x = this.playerHands.length - 1;
    while (x > this.currentPlayerHand) {
      this.playerHands[x] = this.playerHands[x - 1];
      x--;
    }

    // split
    let thisHand = this.playerHands[this.currentPlayerHand];
    let splitHand = this.playerHands[this.currentPlayerHand + 1];

    splitHand.cards = [];
    const c = thisHand.cards[thisHand.cards.length - 1];
    splitHand.cards.push(c);
    thisHand.cards.pop();

    const cx = this.shoe.getNextCard();
    thisHand.cards.push(cx);

    if (thisHand.isDone()) {
      thisHand.process();
      return;
    }

    this.drawHands();
    this.playerHands[this.currentPlayerHand].getAction();
  }

  playMoreHands(): void {
    this.currentPlayerHand++;
    let h = this.playerHands[this.currentPlayerHand];
    h.dealCard();
    if (h.isDone())
    {
      h.process();
      return;
    }

    this.drawHands();
    h.getAction();
  }

  playDealerHand(): void {
    if (this.dealerHand.isBlackjack()) {
      this.dealerHand.hideDownCard = false;
    }

    if (!this.needToPlayDealerHand()) {
      this.dealerHand.played = true;
      this.payHands();
      return;
    }

    this.dealerHand.hideDownCard = false;

    let softCount = this.dealerHand.getValue(CountMethod.Soft);
    let hardCount = this.dealerHand.getValue(CountMethod.Hard);
    while(softCount < 18 && hardCount < 17) {
      this.dealerHand.dealCard();
      softCount = this.dealerHand.getValue(CountMethod.Soft);
      hardCount = this.dealerHand.getValue(CountMethod.Hard);
    }

    this.dealerHand.played = true;
    this.payHands();
  }

  dealNewHand(): void {
    if (this.shoe.needToShuffle())
    {
      this.shoe.newRegular();
    }

    this.playerHands = [];
    PlayerHand.totalPlayerHands = 0;

    this.playerHands.push(new PlayerHand(this, this.currentBet));
    let playerHand = this.playerHands[0];

    this.currentPlayerHand = 0;

    this.dealerHand = new DealerHand(this);

    this.dealerHand.dealCard();
    playerHand.dealCard();
    this.dealerHand.dealCard();
    playerHand.dealCard();

    if (this.dealerHand.upCardIsAce() && !playerHand.isBlackjack())
    {
      this.drawHands();
      this.askInsurance();
      return;
    }

    if (playerHand.isDone())
    {
      this.dealerHand.hideDownCard = false;
      this.payHands();
      this.drawHands();
      this.betOptions();
      return;
    }

    this.drawHands();
    playerHand.getAction();
    //saveGame();
  }

  drawHands(): void {

  }

  askInsurance(): void {

  }

  insureHand(): void {

  }

  noInsurance(): void {

  }

  payHands(): void {

  }

  betOptions(): void {

  }

  gameOptions(): void {

  }

  getNewNumDecks(): void {

  }

  getNewDeckType(): void {

  }

  getNewBet(): void {

  }

  normalizeCurrentBet(): void {

  }

  saveGame(): void {

  }

  loadGame(): void {

  }

  clear(): void {

  }

}

export default Game;
