import React from "react";
import Game from "../Game";

interface PropsType {
  game: Game
}

class MenuInsurance extends React.Component<PropsType, {}> {
  game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  render() {
    return (
      <div className="menu-buttons">
        <div className="btn btn-dark" onClick={this.game.insureHand}>Double</div>
        <div className="btn btn-dark" onClick={this.game.noInsurance}>Hit</div>
      </div>
    );
  }
}

export default MenuInsurance;
