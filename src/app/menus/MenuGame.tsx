import React from "react";
import Game from "../Game";

interface IPropsType {
  game: Game;
}

class MenuGame extends React.Component<IPropsType, {}> {
  public game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  public render() {
    return (
      <div className="menu-buttons">
        <div className="btn btn-dark" onClick={this.game.dealNewHand}>Deal</div>
        <div className="btn btn-dark" onClick={this.game.getNewBet}>Bet</div>
        <div className="btn btn-dark" onClick={this.game.gameOptions}>Options</div>
      </div>
    );
  }
}

export default MenuGame;
