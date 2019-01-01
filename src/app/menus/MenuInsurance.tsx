import React from "react";
import Game from "../Game";

interface IPropsType {
  game: Game;
}

class MenuInsurance extends React.Component<IPropsType, {}> {
  public game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  public render() {
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
