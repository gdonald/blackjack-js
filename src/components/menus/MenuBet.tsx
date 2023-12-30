import React from 'react'
import Game from '../Game'

interface IPropsType {
  game: Game
}

class MenuBet extends React.Component<IPropsType, {}> {
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
      <form onSubmit={this.game.updateBet}>
        <div className='input-group get-bet'>
          <div className='input-group-prepend'>
            <span className='input-group-text'>$</span>
          </div>
          <input
            type='text'
            name='betValue'
            className='form-control'
            defaultValue={this.game.formattedBet()}
          />
          <button className='btn btn-dark'>Update</button>
        </div>
      </form>
    )
  }
}

export default MenuBet
