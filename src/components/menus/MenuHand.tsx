import React from 'react'
import Game from '../Game'

interface IPropsType {
  game: Game
}

class MenuGame extends React.Component<IPropsType, {}> {
  public game: Game

  constructor(props: IPropsType) {
    super(props)
    this.game = props.game
  }

  public render() {
    if (this.game === null) {
      return null
    }

    const dblDisabled = this.game.currentPlayerHand().canDbl()
      ? ''
      : ' disabled'
    const hitDisabled = this.game.currentPlayerHand().canHit()
      ? ''
      : ' disabled'
    const standDisabled = this.game.currentPlayerHand().canStand()
      ? ''
      : ' disabled'
    const splitDisabled = this.game.currentPlayerHand().canSplit()
      ? ''
      : ' disabled'

    return (
      <div className='menu-buttons'>
        <div
          className={`btn btn-dark${dblDisabled}`}
          onClick={this.game.currentPlayerHand().dbl}
        >
          Double
        </div>
        <div
          className={`btn btn-dark${hitDisabled}`}
          onClick={this.game.currentPlayerHand().hit}
        >
          Hit
        </div>
        <div
          className={`btn btn-dark${standDisabled}`}
          onClick={this.game.currentPlayerHand().stand}
        >
          Stand
        </div>
        <div
          className={`btn btn-dark${splitDisabled}`}
          onClick={this.game.splitCurrentHand}
        >
          Split
        </div>
      </div>
    )
  }
}

export default MenuGame
