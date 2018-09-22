import React from 'react';

interface PropsType {
  value: number
  suitValue: number
}

class Card extends React.Component<PropsType, {}> {

  static faces: string[][] = [
    ["🂡", "🂱", "🃁", "🃑"],
    ["🂢", "🂲", "🃂", "🃒"],
    ["🂣", "🂳", "🃃", "🃓"],
    ["🂤", "🂴", "🃄", "🃔"],
    ["🂥", "🂵", "🃅", "🃕"],
    ["🂦", "🂶", "🃆", "🃖"],
    ["🂧", "🂷", "🃇", "🃗"],
    ["🂨", "🂸", "🃈", "🃘"],
    ["🂩", "🂹", "🃉", "🃙"],
    ["🂪", "🂺", "🃊", "🃚"],
    ["🂫", "🂻", "🃋", "🃛"],
    ["🂭", "🂽", "🃍", "🃝"],
    ["🂮", "🂾", "🃎", "🃞"],
    ["🂠", "", "", ""]
  ];

  isTen(): boolean {
    return this.props.value > 8;
  }

  isAce(): boolean {
    return this.props.value == 0;
  }

  colorClass() {
    return [1, 2].indexOf(this.props.suitValue) > -1 ? 'red' : 'black'
  }

  render() {
    return (
      <span className={this.colorClass()}>
        {Card.faces[this.props.value][this.props.suitValue]}
      </span>
    );
  }
}

export default Card;
