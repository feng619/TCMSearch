// @flow
import React from "react";
import { Route } from "react-router-dom";
import TCMSearch from "./search/tcm-search";
import TCMml from "./ml/tcm-ml";

const App = () => {
  return (
    <div>
      <Route exact path="/" component={TCMSearch} />
      <Route path="/tcmml" component={TCMml} />
    </div>
  );
};

export default App;
