import Hand, {CountMethod} from './Hand';
import Game from "./Game";

class DealerHand extends Hand {
  hideDownCard: boolean = true;

  constructor(game: Game) {
    super(game);
  }

  upCardIsAce(): boolean {
    return this.cards[0].isAce();
  }

  draw(): void {

  }

  isBusted(): boolean {
    return this.getValue(CountMethod.Soft) > 21;
  }

  getValue(countMethod: CountMethod): number {
    let v = 0;
    let total = 0;

    for (let x = 0; x < this.cards.length; x++) {
      if (x == 1 && this.hideDownCard) {
        continue;
      }

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

export default DealerHand;
