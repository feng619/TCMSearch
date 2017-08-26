// @flow
import React from "react";
import { Route } from "react-router-dom";
import TCMSearch from "./tcm/tcm-search";
import Port from "./port";

const App = () => {
  return (
    <div>
      <Route exact path="/" component={TCMSearch} />
      <Route path="/port" component={Port} />
    </div>
  );
};

export default App;
