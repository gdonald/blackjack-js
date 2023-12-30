import React from 'react'
import Game from '../Game'

interface IPropsType {
  game: Game
}

class MenuDeckCount extends React.Component<IPropsType, {}> {
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
      <form onSubmit={this.game.updateDeckCount}>
        <div className='input-group get-deck-count'>
          <input
            type='text'
            name='deckCountValue'
            className='form-control'
            defaultValue={this.game.numDecks.toString()}
          />
          <button className='btn btn-dark'>Update</button>
        </div>
      </form>
    )
  }
}

export default MenuDeckCount
