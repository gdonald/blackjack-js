import React from 'react'
import Game from '../Game'

interface IPropsType {
  game: Game
}

class MenuInsurance extends React.Component<IPropsType, {}> {
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
      <>
        <div className='word'>Insurance?</div>
        <div className='menu-buttons'>
          <div className='btn btn-dark' onClick={this.game.noInsurance}>
            No
          </div>
          <div className='btn btn-dark' onClick={this.game.insureHand}>
            Yes
          </div>
        </div>
      </>
    )
  }
}

export default MenuInsurance
