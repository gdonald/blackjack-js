import React from 'react';
import Game from './Game';
import Hand, {CountMethod} from './Hand';
import Card from './Card';

class DealerHand extends React.Component {
  hideDownCard: boolean = true;
  hand: Hand = null;
  game: Game = null;

  constructor(game: Game) {
    super(game);
    this.game = game;
    this.hand = new Hand(game);
  }

  render() {
    return (
      <>
        {this.displayHand().cards.map(function (card) {
          return card.render();
        })}
        <div className="count black">⇒  {this.getValue(CountMethod.Soft)}</div>
      </>
    );
  }

  displayHand(): Hand {
    let h = new Hand(this.game);
    for(let x = 0; x < this.hand.cards.length; x++) {
      h.cards.push(x == 1 && this.hideDownCard
        ? new Card({value: 13, suitValue: 0})
        : this.hand.cards[x]);
    }
    return h;
  }

  upCardIsAce(): boolean {
    return this.hand.cards[0].isAce();
  }

  isBusted(): boolean {
    return this.getValue(CountMethod.Soft) > 21;
  }

  getValue(countMethod: CountMethod): number {
    let v = 0;
    let total = 0;

    for (let x = 0; x < this.hand.cards.length; x++) {
      if (x == 1 && this.hideDownCard) {
        continue;
      }

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
}

export default DealerHand;
