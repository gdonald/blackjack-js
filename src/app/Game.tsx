import Shoe, { ShoeType } from "./Shoe";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import {CountMethod, Status} from "./Hand";
import Menu, {MenuType} from './menus/Menu';
import React from 'react';
import Cookies from 'universal-cookie';

export const MIN_BET: number = 500;
export const MAX_BET: number = 10000000;
export const MIN_NUM_DECKS: number = 1;
export const MAX_NUM_DECKS: number = 8;
export const START_MONEY: number = 10000;

class Game extends React.Component {
  cookies: Cookies = null;
  numDecks: number = 8;
  shoeType: number = ShoeType.Regular;
  shoe: Shoe = null;
  dealerHand: DealerHand = null;
  playerHands: PlayerHand[] = [];
  currentPlayerHandIndex: number = 0;
  currentBet: number = MIN_BET;
  money: number = START_MONEY;
  menu: Menu = null;
  currentMenu: number = MenuType.MenuHand;
  mounted: boolean = false;

  constructor(props) {
    super(props);

    this.cookies = new Cookies();
    this.loadGame();

    this.shoe = new Shoe(this.numDecks);
    this.dealNewHand();
    this.menu = new Menu({game: this});

    this.dealNewHand = this.dealNewHand.bind(this);
    this.insureHand = this.insureHand.bind(this);
    this.noInsurance = this.noInsurance.bind(this);
    this.getNewBet = this.getNewBet.bind(this);
    this.updateBet = this.updateBet.bind(this);
    this.gameOptions = this.gameOptions.bind(this);
    this.optionsBack = this.optionsBack.bind(this);
    this.getDeckType = this.getDeckType.bind(this);
    this.getDeckCount = this.getDeckCount.bind(this);
    this.updateDeckCount = this.updateDeckCount.bind(this);
    this.newRegular = this.newRegular.bind(this);
    this.newAces = this.newAces.bind(this);
    this.newJacks = this.newJacks.bind(this);
    this.newAcesJacks = this.newAcesJacks.bind(this);
    this.newSevens = this.newSevens.bind(this);
    this.newEights = this.newEights.bind(this);
    this.splitCurrentHand = this.splitCurrentHand.bind(this);
  }

  render() {
    return (
      <>
        <div className="word black" key="d">Dealer:</div>
        {this.dealerHand.render()}
        <div className="word black" key="p">Player {this.formattedMoney(this.money)}:</div>
        {this.playerHands.map(function(playerHand, key) {
          return playerHand.render();
        })}
        {this.menu.render()}
      </>
    );
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  dealNewHand(): void {
    if (this.shoe.needToShuffle()) {
      this.shoe.newShoe(this.shoeType);
    }

    this.playerHands = [];
    PlayerHand.totalPlayerHands = 0;
    this.playerHands.push(new PlayerHand(this, this.currentBet));
    let playerHand = this.playerHands[0];
    this.currentPlayerHandIndex = 0;

    this.dealerHand = new DealerHand(this);

    this.dealerHand.hand.dealCard();
    playerHand.hand.dealCard();
    this.dealerHand.hand.dealCard();
    playerHand.hand.dealCard();

    if (this.dealerHand.upCardIsAce() && !playerHand.hand.isBlackjack()) {
      this.currentMenu = MenuType.MenuInsurance;
      this.forceUpdateIfMounted();
      return;
    }

    if (playerHand.isDone()) {
      this.dealerHand.hideDownCard = false;
      this.payHands();
      this.currentMenu = MenuType.MenuGame;
      this.forceUpdateIfMounted();
      return;
    }

    this.currentMenu = MenuType.MenuHand;
    this.forceUpdateIfMounted();
  }

  forceUpdateIfMounted(): void {
    if(this.mounted) {
      this.forceUpdate();
    }
  }

  formattedMoney(value: number): string {
    return (value / 100.0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  formattedBet(): string {
    return (this.currentBet / 100.0).toLocaleString('en-US', { style: 'decimal' });
  }

  currentPlayerHand(): PlayerHand {
    return this.playerHands[this.currentPlayerHandIndex];
  }

  allBets(): number {
    let allBets = 0;

    for (let x = 0; x < this.playerHands.length; x++) {
      allBets += this.playerHands[x].bet;
    }

    return allBets;
  }

  moreHandsToPlay(): boolean {
    return this.currentPlayerHandIndex < this.playerHands.length - 1;
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
    if(!this.currentPlayerHand().canSplit()) {
      return;
    }

    this.playerHands.push(new PlayerHand(this, this.currentBet));

    // expand hands
    let x = this.playerHands.length - 1;
    while (x > this.currentPlayerHandIndex) {
      this.playerHands[x] = PlayerHand.clone(this.playerHands[x - 1]);
      x--;
    }

    // split
    let thisHand = this.currentPlayerHand();
    let splitHand = this.playerHands[this.currentPlayerHandIndex + 1];

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

    this.currentMenu = MenuType.MenuHand;
    this.forceUpdate();
  }

  playMoreHands(): void {
    this.currentPlayerHandIndex++;
    let h = this.currentPlayerHand();
    h.hand.dealCard();
    if (h.isDone()) {
      h.process();
      return;
    }

    this.currentMenu = MenuType.MenuHand;
    this.forceUpdate();
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

  insureHand(): void {
    let h = this.currentPlayerHand();

    h.bet /= 2;
    h.hand.played = true;
    h.payed = true;
    h.status = Status.Lost;

    this.money -= h.bet;

    this.currentMenu = MenuType.MenuGame;
    this.forceUpdate();
  }

  noInsurance(): void {
    if (this.dealerHand.hand.isBlackjack()) {
      this.dealerHand.hideDownCard = false;
      this.dealerHand.hand.played = true;

      this.payHands();

      this.currentMenu = MenuType.MenuGame;
      this.forceUpdate();
      return;
    }

    let h = this.currentPlayerHand();
    if (h.isDone()) {
      this.playDealerHand();
      this.currentMenu = MenuType.MenuGame;
      this.forceUpdate();
      return;
    }

    this.currentMenu = MenuType.MenuHand;
    this.forceUpdate();
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
    this.saveGame();
  }

  gameOptions(): void {
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
  }

  getDeckCount(): void {
    this.currentMenu = MenuType.MenuDeckCount;
    this.forceUpdate();
  }

  getDeckType(): void {
    this.currentMenu = MenuType.MenuDeckType;
    this.forceUpdate();
  }

  optionsBack(): void {
    this.currentMenu = MenuType.MenuGame;
    this.forceUpdate();
  }

  getNewBet(): void {
    this.currentMenu = MenuType.MenuBet;
    this.forceUpdate();
  }

  updateBet(event): void {
    event.preventDefault();
    const data = new FormData(event.target);
    this.currentBet = parseInt(data.get('betValue').toString()) * 100;
    this.normalizeCurrentBet();

    this.dealNewHand();
    this.currentMenu = MenuType.MenuHand;
    this.forceUpdate();
    this.saveGame();
  }

  normalizeCurrentBet(): void {
    if(this.currentBet < MIN_BET) {
      this.currentBet = MIN_BET;
    } else if(this.currentBet > MAX_BET) {
      this.currentBet = MAX_BET;
    }

    if(this.currentBet > this.money) {
      this.currentBet = this.money;
    }
  }

  updateDeckCount(event): void {
    event.preventDefault();
    const data = new FormData(event.target);
    this.numDecks = parseInt(data.get('deckCountValue').toString());
    this.normalizeDeckCount();

    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  normalizeDeckCount(): void {
    if(this.numDecks < MIN_NUM_DECKS) {
      this.numDecks = MIN_NUM_DECKS;
    } else if(this.numDecks > MAX_NUM_DECKS) {
      this.numDecks = MAX_NUM_DECKS;
    }
  }

  normalizeShoeType(): void {
    if(this.shoeType < 0) {
      this.shoeType = ShoeType.Regular;
    } else if(this.shoeType > ShoeType.ShoeTypeCount) {
      this.shoeType = ShoeType.Regular;
    }
  }

  newRegular(): void {
    this.shoeType = ShoeType.Regular;
    this.shoe.newRegular();
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  newAces(): void {
    this.shoeType = ShoeType.Aces;
    this.shoe.newAces();
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  newJacks(): void {
    this.shoeType = ShoeType.Jacks;
    this.shoe.newJacks();
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  newAcesJacks(): void {
    this.shoeType = ShoeType.AcesJacks;
    this.shoe.newAcesJacks();
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  newSevens(): void {
    this.shoeType = ShoeType.Sevens;
    this.shoe.newSevens();
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  newEights(): void {
    this.shoeType = ShoeType.Eights;
    this.shoe.newEights();
    this.currentMenu = MenuType.MenuOptions;
    this.forceUpdate();
    this.saveGame();
  }

  saveGame(): void {
    const gameState = `${this.money}|${this.currentBet}|${this.numDecks}|${this.shoeType}`;
    this.cookies.set('gameState', gameState, { path: '/' });
  }

  loadGame(): void {
    const gameState = this.cookies.get('gameState');
    if(gameState === undefined) {
      return;
    }

    const parts = gameState.toString().split('|');
    this.money = parseInt(parts[0]);
    this.currentBet = parseInt(parts[1]);
    this.numDecks = parseInt(parts[2]);
    this.shoeType = parseInt(parts[3]);

    this.normalizeCurrentBet();
    this.normalizeDeckCount();
    this.normalizeShoeType();

    if(this.money <= 0) {
      this.money = START_MONEY;
    }
  }
}

export default Game;
