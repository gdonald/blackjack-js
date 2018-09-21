import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card } from './Card';

const Blackjack: React.SFC<{ card: string }> = (props) => {
  const c1 = new Card(0, 1);
  const c2 = new Card(10, 0);

  return (
    <div>
      <div>{`${c1}${c2}`}</div>
    </div>
  );
}

ReactDOM.render(
  <Blackjack card="Card" />,
  document.getElementById("root")
);
