import React from 'react';
import Game from '../Game';

interface PropsType {
  game: Game
}

class MenuDeckType extends React.Component<PropsType, {}> {
  game: Game = null;

  constructor(props) {
    super(props);
    this.game = props.game;
  }

  render() {
    return (
      <div className="menu-buttons">
        <div className="btn btn-dark" onClick={this.game.newRegular}>Regular</div>
        <div className="btn btn-dark" onClick={this.game.newAces}>Aces</div>
        <div className="btn btn-dark" onClick={this.game.newJacks}>Jacks</div>
        <div className="btn btn-dark" onClick={this.game.newAcesJacks}>A & J</div>
        <div className="btn btn-dark" onClick={this.game.newSevens}>Sevens</div>
        <div className="btn btn-dark" onClick={this.game.newEights}>Eights</div>
      </div>
    );
  }
}

export default MenuDeckType;
