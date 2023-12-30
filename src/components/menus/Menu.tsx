import React from 'react'
import Game from '../Game'
import MenuBet from './MenuBet'
import MenuDeckCount from './MenuDeckCount'
import MenuDeckType from './MenuDeckType'
import MenuGame from './MenuGame'
import MenuHand from './MenuHand'
import MenuInsurance from './MenuInsurance'
import MenuOptions from './MenuOptions'

export enum MenuType {
  MenuGame,
  MenuHand,
  MenuBet,
  MenuDeckType,
  MenuDeckCount,
  MenuInsurance,
  MenuOptions,
}

interface IPropsType {
  game: Game
}

class Menu extends React.Component<IPropsType, {}> {
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
        {(() => {
          switch (this.game.currentMenu) {
            case MenuType.MenuGame:
              return <MenuGame game={this.game} />
            case MenuType.MenuOptions:
              return <MenuOptions game={this.game} />
            case MenuType.MenuHand:
              return <MenuHand game={this.game} />
            case MenuType.MenuInsurance:
              return <MenuInsurance game={this.game} />
            case MenuType.MenuBet:
              return <MenuBet game={this.game} />
            case MenuType.MenuDeckCount:
              return <MenuDeckCount game={this.game} />
            case MenuType.MenuDeckType:
              return <MenuDeckType game={this.game} />
          }
        })()}
      </>
    )
  }
}

export default Menu
