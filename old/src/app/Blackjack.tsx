import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Game from "./Game";

const Blackjack: React.FunctionComponent<{}> = (props) => {
  return <Game key="g"></Game>;
};

ReactDOM.render(
  <Blackjack/>,
  document.getElementById("root"),
);
