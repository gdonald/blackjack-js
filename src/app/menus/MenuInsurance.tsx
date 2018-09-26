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
      <>
        <div className="word">Insurance?</div>
        <div className="menu-buttons">
          <div className="btn btn-dark" onClick={this.game.noInsurance}>No</div>
          <div className="btn btn-dark" onClick={this.game.insureHand}>Yes</div>
        </div>
      </>
    );
  }
}

export default MenuInsurance;
