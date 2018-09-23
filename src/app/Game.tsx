import Shoe from "./Shoe";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import {CountMethod, Status} from "./Hand";
import React from "react";

export const MIN_BET: number = 500;
export const MAX_BET: number = 10000000;

class Game extends React.Component {
  numDecks: number = 1;
  shoe: Shoe = null;
  dealerHand: DealerHand = null;
  playerHands: PlayerHand[] = [];

  currentPlayerHand: number = 0;
  currentBet: number = MIN_BET;
  money: number = 10000;

  constructor(props) {
    super(props);
    this.shoe = new Shoe(this.numDecks);
    this.dealerHand = new DealerHand(this);
  }

  render() {
    return (
      'Game!'
    );

    // cout << endl << " Dealer: " << endl;
    // dealerHand.draw();
    // cout << endl;
    //
    // cout << fixed << setprecision(2);
    // cout << endl << " Player $" << (float)(money / 100.0) << ":" << endl;
    // for(unsigned i = 0; i < playerHands.size(); ++i)
    // {
    //   playerHands.at(i).draw(i);
    // }

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
      let h = this.playerHands[x].hand;

      if (!(h.isBusted() || h.isBlackjack())) {
        return true;
      }
    }

    return false;
  }

  splitCurrentHand(): void {
    let currentHand = this.playerHands[this.currentPlayerHand];

    if (!currentHand.canSplit()) {
      // this.drawHands();
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

    splitHand.hand.cards = [];
    const c = thisHand.hand.cards[thisHand.hand.cards.length - 1];
    splitHand.hand.cards.push(c);
    thisHand.hand.cards.pop();

    const cx = this.shoe.getNextCard();
    thisHand.hand.cards.push(cx);

    if (thisHand.isDone()) {
      thisHand.process();
      return;
    }

    // this.drawHands();
    this.playerHands[this.currentPlayerHand].getAction();
  }

  playMoreHands(): void {
    this.currentPlayerHand++;
    let h = this.playerHands[this.currentPlayerHand];
    h.hand.dealCard();
    if (h.isDone())
    {
      h.process();
      return;
    }

    // this.drawHands();
    h.getAction();
  }

  playDealerHand(): void {
    if (this.dealerHand.hand.isBlackjack()) {
      this.dealerHand.hideDownCard = false;
    }

    if (!this.needToPlayDealerHand()) {
      this.dealerHand.hand.played = true;
      this.payHands();
      return;
    }

    this.dealerHand.hideDownCard = false;

    let softCount = this.dealerHand.getValue(CountMethod.Soft);
    let hardCount = this.dealerHand.getValue(CountMethod.Hard);
    while(softCount < 18 && hardCount < 17) {
      this.dealerHand.hand.dealCard();
      softCount = this.dealerHand.getValue(CountMethod.Soft);
      hardCount = this.dealerHand.getValue(CountMethod.Hard);
    }

    this.dealerHand.hand.played = true;
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

    this.dealerHand.hand.dealCard();
    playerHand.hand.dealCard();
    this.dealerHand.hand.dealCard();
    playerHand.hand.dealCard();

    if (this.dealerHand.upCardIsAce() && !playerHand.hand.isBlackjack())
    {
      // this.drawHands();
      this.askInsurance();
      return;
    }

    if (playerHand.isDone())
    {
      this.dealerHand.hideDownCard = false;
      this.payHands();
      // this.drawHands();
      this.betOptions();
      return;
    }

    // this.drawHands();
    playerHand.getAction();
    //saveGame();
  }

  askInsurance(): void {

  }

  insureHand(): void {
    let h = this.playerHands[this.currentPlayerHand];

    h.bet /= 2;
    h.hand.played = true;
    h.payed = true;
    h.status = Status.Lost;

    this.money -= h.bet;

    // this.drawHands();
    this.betOptions();
  }

  noInsurance(): void {
    if (this.dealerHand.hand.isBlackjack()) {
      this.dealerHand.hideDownCard = false;
      this.dealerHand.hand.played = true;

      this.payHands();
      // this.drawHands();
      this.betOptions();
      return;
    }

    let h = this.playerHands[this.currentPlayerHand];
    if (h.isDone()) {
      this.playDealerHand();
      // this.drawHands();
      this.betOptions();
      return;
    }

    // this.drawHands();
    h.getAction();
  }

  payHands(): void {
    const dhv = this.dealerHand.getValue(CountMethod.Soft);
    const dhb = this.dealerHand.isBusted();

    for(let x = 0; x < this.playerHands.length; x++) {
      let h = this.playerHands[x];

      if (h.payed) {
        continue;
      }

      h.payed = true;

      let phv = h.getValue(CountMethod.Soft);

      if (dhb || phv > dhv) {
        if (h.hand.isBlackjack()) {
          h.bet *= 1.5;
        }

        this.money += h.bet;
        h.status = Status.Won;
      } else if (phv < dhv) {
        this.money -= h.bet;
        h.status = Status.Lost;
      } else {
        h.status = Status.Push;
      }
    }

    this.normalizeCurrentBet();
    //this.saveGame();
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
