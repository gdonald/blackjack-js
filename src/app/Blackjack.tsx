import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from "./Game";

interface PropsType {

}

const Blackjack: React.SFC<PropsType> = (props) => {
  return <Game></Game>;
};

ReactDOM.render(
  <Blackjack/>,
  document.getElementById('root')
);
