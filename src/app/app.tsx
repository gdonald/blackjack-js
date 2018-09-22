import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Card from './Card';

const Blackjack: React.SFC<{}> = (props) => {

  const c = new Card({ value: 0, suitValue: 0 });
  console.log(c.isTen())
  console.log(c.isAce())

  return (
    <>
      {c.render()}
      <br/>
      <Card value={0} suitValue={0}></Card>
      <Card value={10} suitValue={1}></Card>
      <br/>
      <Card value={0} suitValue={3}></Card>
      <Card value={10} suitValue={2}></Card>
    </>
  );
};

ReactDOM.render(
  <Blackjack/>,
  document.getElementById('root')
);
