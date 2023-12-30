import React from 'react'

interface IPropsType {
  value: number
  suitValue: number
}

class Card extends React.Component<IPropsType, {}> {
  public static faces: string[][] = [
    ['🂡', '🂱', '🃁', '🃑'],
    ['🂢', '🂲', '🃂', '🃒'],
    ['🂣', '🂳', '🃃', '🃓'],
    ['🂤', '🂴', '🃄', '🃔'],
    ['🂥', '🂵', '🃅', '🃕'],
    ['🂦', '🂶', '🃆', '🃖'],
    ['🂧', '🂷', '🃇', '🃗'],
    ['🂨', '🂸', '🃈', '🃘'],
    ['🂩', '🂹', '🃉', '🃙'],
    ['🂪', '🂺', '🃊', '🃚'],
    ['🂫', '🂻', '🃋', '🃛'],
    ['🂭', '🂽', '🃍', '🃝'],
    ['🂮', '🂾', '🃎', '🃞'],
    ['🂠', '', '', ''],
  ]

  public static cardID: number = 0
  public readonly cardID: number = 0

  constructor(props: IPropsType) {
    super(props)
    this.cardID = Card.cardID++
  }

  public render() {
    return (
      <span className={this.colorClass()} key={`c-${this.cardID}`}>
        {Card.faces[this.props.value][this.props.suitValue]}
      </span>
    )
  }

  public isTen(): boolean {
    return this.props.value > 8
  }

  public isAce(): boolean {
    return this.props.value === 0
  }

  private colorClass() {
    let klass = 'card '
    klass += [1, 2].indexOf(this.props.suitValue) > -1 ? 'red' : 'black'
    return klass
  }
}

export default Card
