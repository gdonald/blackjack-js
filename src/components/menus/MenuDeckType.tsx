import React from 'react'
import Game from '../Game'

interface IPropsType {
  game: Game
}

class MenuDeckType extends React.Component<IPropsType, {}> {
  public game: Game

  constructor(props: IPropsType) {
    super(props)
    this.game = props.game
  }

  public render() {
    if (this.game === null) {
      return null
    }

    return (
      <div className='menu-buttons'>
        <div className='btn btn-dark' onClick={this.game.newRegular}>
          Regular
        </div>
        <div className='btn btn-dark' onClick={this.game.newAces}>
          Aces
        </div>
        <div className='btn btn-dark' onClick={this.game.newJacks}>
          Jacks
        </div>
        <div className='btn btn-dark' onClick={this.game.newAcesJacks}>
          A & J
        </div>
        <div className='btn btn-dark' onClick={this.game.newSevens}>
          Sevens
        </div>
        <div className='btn btn-dark' onClick={this.game.newEights}>
          Eights
        </div>
      </div>
    )
  }
}

export default MenuDeckType
