import React from "react";
import Game from "../Game";

interface IPropsType {
  game: Game;
}

class MenuOptions extends React.Component<IPropsType, {}> {
  public game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  public render() {
    return (
      <div className="menu-buttons">
        <div className="btn btn-dark" onClick={this.game.getDeckCount}>Decks</div>
        <div className="btn btn-dark" onClick={this.game.getDeckType}>Type</div>
        <div className="btn btn-dark" onClick={this.game.optionsBack}>Back</div>
      </div>
    );
  }
}

export default MenuOptions;
