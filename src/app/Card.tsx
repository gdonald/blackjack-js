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

  static cardID: number = 0;

  cardID: number = 0;

  constructor(props) {
    super(props);
    this.cardID = Card.cardID++;
  }

  isTen(): boolean {
    return this.props.value > 8;
  }

  isAce(): boolean {
    return this.props.value == 0;
  }

  colorClass() {
    let klass = 'card ';
    klass += [1, 2].indexOf(this.props.suitValue) > -1 ? 'red' : 'black'
    return klass
  }

  render() {
    return (
      <span className={this.colorClass()} key={`c-${this.cardID}`}>
        {Card.faces[this.props.value][this.props.suitValue]}
      </span>
    );
  }
}

export default Card;
