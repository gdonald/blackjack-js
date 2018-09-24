import React from "react";
import Game from "../Game";
import MenuHand from './MenuHand';
import MenuGame from "./MenuGame";
import MenuDeckType from "./MenuDeckType";
import MenuInsurance from "./MenuInsurance";
import MenuBet from "./MenuBet";
import MenuDeckCount from "./MenuDeckCount";
import MenuOptions from "./MenuOptions";

export enum MenuType { MenuGame, MenuHand, MenuBet, MenuDeckType, MenuDeckCount, MenuInsurance, MenuOptions };

interface PropsType {
  game: Game
}

class Menu extends React.Component<PropsType, {}> {
  game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  render() {
    return (
      <>
        {(() => {
          switch (this.game.currentMenu) {
            case MenuType.MenuGame:
              return <MenuGame game={this.game}/>;
            case MenuType.MenuOptions:
              return <MenuOptions game={this.game}/>;
            case MenuType.MenuHand:
              return <MenuHand game={this.game}/>;
            case MenuType.MenuInsurance:
              return <MenuInsurance game={this.game}/>;
            case MenuType.MenuBet:
              return <MenuBet game={this.game}/>;
            case MenuType.MenuDeckCount:
              return <MenuDeckCount game={this.game}/>;
            case MenuType.MenuDeckType:
              return <MenuDeckType game={this.game}/>;
          }
        })()}
      </>
    );
  }
}

export default Menu;
