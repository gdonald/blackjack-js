import Hand, {CountMethod, Status} from './Hand';
import Game from './Game';

export const MAX_PLAYER_HANDS: number = 7;

class PlayerHand extends Hand {

  static totalPlayerHands: number = 0;
  bet: number;
  status: Status = Status.Unknown;
  payed: boolean = false;

  constructor(game: Game, bet: number) {
    super(game);
    this.bet = bet;
    PlayerHand.totalPlayerHands++;
  }

  getAction(): void {

  }

  hit(): void {
    this.dealCard();

    if (this.isDone()) {
      this.process();
      return;
    }

    this.game.drawHands();
    this.game.playerHands[this.game.currentPlayerHand].getAction();
  }

  dbl(): void {
    this.dealCard();
    this.played = true;
    this.bet *= 2;

    if (this.isDone()) {
      this.process();
    }
  }

  stand(): void {
    this.stood = true;
    this.played = true;

    if (this.game.moreHandsToPlay()) {
      this.game.playMoreHands();
      return;
    }

    this.game.playDealerHand();
    this.game.drawHands();
    this.game.betOptions();
  }

  draw(index: number): void {

  }

  process(): void {
    if (this.game.moreHandsToPlay()) {
      this.game.playMoreHands();
      return;
    }

    this.game.playDealerHand();
    this.game.drawHands();
    this.game.betOptions();
  }

  canSplit(): boolean {
    if (this.stood || PlayerHand.totalPlayerHands >= MAX_PLAYER_HANDS) {
      return false;
    }

    if (this.game.money < this.game.allBets() + this.bet) {
      return false;
    }

    if (this.cards.length == 2 && this.cards[0].props.value == this.cards[1].props.value) {
      return true;
    }

    return false;
  }

  canDbl(): boolean {
    if (this.game.money < this.game.allBets() + this.bet) {
      return false;
    }

    if (this.stood || this.cards.length != 2 || this.isBusted() || this.isBlackjack()) {
      return false;
    }

    return true;
  }

  canStand(): boolean {
    if (this.stood || this.isBusted() || this.isBlackjack()) {
      return false;
    }

    return true;
  }

  canHit(): boolean {
    if (this.played || this.stood || 21 == this.getValue(CountMethod.Hard) || this.isBlackjack() || this.isBusted()) {
      return false;
    }

    return true;
  }

  isDone(): boolean {
    if (this.played
      || this.stood
      || this.isBlackjack()
      || this.isBusted()
      || 21 == this.getValue(CountMethod.Soft)
      || 21 == this.getValue(CountMethod.Hard)) {
      this.played = true;

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

    for (let x = 0; x < this.cards.length; x++) {
      let tmp_v = this.cards[x].props.value + 1;
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
}

export default PlayerHand;
