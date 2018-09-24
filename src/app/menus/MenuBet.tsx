import React from "react";
import Game from "../Game";

interface PropsType {
  game: Game
}

class MenuBet extends React.Component<PropsType, {}> {
  game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  render() {
    return (
      <form onSubmit={this.game.updateBet}>
        <div className="input-group get-bet">
          <div className="input-group-prepend">
            <span className="input-group-text">$</span>
          </div>
          <input type="text" name="betValue" className="form-control" defaultValue={this.game.formattedBet()} />
          <button className="btn btn-dark">Update</button>
        </div>
      </form>
    );
  }
}

export default MenuBet;
