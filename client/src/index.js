import "./index.css";

import * as serviceWorker from "./serviceWorker";

import { BrowserRouter, Route } from "react-router-dom";

import App from "./App";
import Bookmarks from "./Bookmarks/Bookmarks.js";
import Login from "./Users/Login.js";
import React from "react";
import ReactDOM from "react-dom";
import Register from "./Users/Register.js";
import { Switch } from "react-router";

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/bookmarks" component={Bookmarks} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
