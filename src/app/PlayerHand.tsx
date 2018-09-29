import React from 'react';
import Hand, { CountMethod, Status } from './Hand';
import Game from './Game';
import { MenuType } from './menus/Menu';
import Card from './Card';

export const MAX_PLAYER_HANDS: number = 7;

interface PropsType {
}

class PlayerHand extends React.Component<PropsType, {}> {

  static totalPlayerHands: number = 0;

  game: Game = null;
  hand: Hand = null;
  bet: number;
  status: Status = Status.Unknown;
  payed: boolean = false;
  playerHandID: number = 0;

  constructor(game: Game, bet: number) {
    super(game);
    this.game = game;
    this.bet = bet;
    this.hand = new Hand(game);
    this.playerHandID = PlayerHand.totalPlayerHands++;

    this.dbl = this.dbl.bind(this);
    this.stand = this.stand.bind(this);
    this.hit = this.hit.bind(this);
  }

  render() {
    return (
      <div className={this.game.isLinux() ? 'linux' : ''} key={`phs-${this.playerHandID}`}>
        {this.hand.cards.map(function (card, key) {
          return (
            <span key={`ph-${card.cardID}-${key}`}>
              {card.render()}
            </span>
          );
        })}
        <div className="count black">
          ⇒ {this.getValue(CountMethod.Soft)} &nbsp;{this.statusDisplay()}{this.betDisplay()}{this.currentHandDisplay()} &nbsp;{this.statusDisplayText()}
        </div>
      </div>
    );
  }

  static clone(playerHand: PlayerHand): PlayerHand {
    let newPlayerHand = new PlayerHand(playerHand.game, playerHand.bet);

    for (let x = 0; x < playerHand.hand.cards.length; x++) {
      const card = playerHand.hand.cards[x];
      const newCard = new Card({value: card.props.value, suitValue: card.props.suitValue});
      newPlayerHand.hand.cards.push(newCard);
    }

    return newPlayerHand;
  }

  hit(): void {
    if (!this.canHit()) {
      return;
    }

    this.hand.dealCard();

    if (this.isDone()) {
      this.process();
      this.game.forceUpdate();
      return;
    }

    this.game.forceUpdate();
  }

  dbl(): void {
    if (!this.canDbl()) {
      return;
    }

    this.hand.dealCard();
    this.hand.stood = true;
    this.hand.played = true;
    this.bet *= 2;

    if (this.isDone()) {
      this.process();
    }

    this.game.forceUpdate();
  }

  stand(): void {
    if (!this.canStand()) {
      return;
    }

    this.hand.stood = true;
    this.hand.played = true;

    if (this.game.moreHandsToPlay()) {
      this.game.playMoreHands();
      return;
    }

    this.game.playDealerHand();
    this.game.currentMenu = MenuType.MenuGame;
    this.game.forceUpdate();
  }

  process(): void {
    if (this.game.moreHandsToPlay()) {
      this.game.playMoreHands();
      return;
    }

    this.game.playDealerHand();
    this.game.currentMenu = MenuType.MenuGame;
    this.game.forceUpdate();
  }

  canSplit(): boolean {
    if (this.hand.stood || this.game.playerHands.length >= MAX_PLAYER_HANDS) {
      return false;
    }

    if (this.game.money < this.game.allBets() + this.bet) {
      return false;
    }

    return this.hand.cards.length == 2 && this.hand.cards[0].props.value == this.hand.cards[1].props.value;
  }

  canDbl(): boolean {
    if (this.game.money < this.game.allBets() + this.bet) {
      return false;
    }

    return !(this.hand.stood || this.hand.cards.length != 2 || this.isBusted() || Game.isBlackjack(this.hand.cards));
  }

  canStand(): boolean {
    return !(this.hand.stood || this.isBusted() || Game.isBlackjack(this.hand.cards));
  }

  canHit(): boolean {
    return !(this.hand.played || this.hand.stood || 21 == this.getValue(CountMethod.Hard) || Game.isBlackjack(this.hand.cards) || this.isBusted());
  }

  isDone(): boolean {
    if (this.hand.played
      || this.hand.stood
      || Game.isBlackjack(this.hand.cards)
      || this.isBusted()
      || 21 == this.getValue(CountMethod.Soft)
      || 21 == this.getValue(CountMethod.Hard)) {
      this.hand.played = true;

      if (!this.payed) {
        if (this.isBusted()) {
          this.payed = true;
          this.status = Status.Lost;
          this.game.money -= this.bet;
        }
      }

      return true;
    }

    return false;
  }

  isBusted(): boolean {
    return this.getValue(CountMethod.Soft) > 21;
  }

  getValue(countMethod: CountMethod): number {
    let v = 0;
    let total = 0;

    for (let x = 0; x < this.hand.cards.length; x++) {
      let tmp_v = this.hand.cards[x].props.value + 1;
      v = tmp_v > 9 ? 10 : tmp_v;

      if (countMethod == CountMethod.Soft && v == 1 && total < 11) {
        v = 11;
      }

      total += v;
    }

    if (countMethod == CountMethod.Soft && total > 21) {
      return this.getValue(CountMethod.Hard);
    }

    return total;
  }

  statusDisplay(): string {
    switch (this.status) {
      case Status.Won:
        return '+';
      case Status.Lost:
        return '-';
    }
  }

  statusDisplayText(): string {
    if (this.status == Status.Lost) {
      if (this.isBusted()) {
        return 'Busted!';
      }
      else {
        return 'Lose!';
      }
    }
    else if (this.status == Status.Won) {
      if (Game.isBlackjack(this.hand.cards)) {
        return 'Blackjack!';
      }
      else {
        return 'Won!';
      }
    }
    else if (this.status == Status.Push) {
      return 'Push';
    }
  }

  betDisplay(): string {
    return Game.formattedMoney(this.bet);
  }

  currentHandDisplay(): string {
    if (!this.hand.played && this.game.currentPlayerHand() == this) {
      return ' ⇐';
    }
  }
}

export default PlayerHand;
