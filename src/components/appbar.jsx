// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { push } from "react-router-redux";

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Search from "material-ui-icons/Search";
import Equalizer from "material-ui-icons/Equalizer";

import tcmWhite from "../images/components/tcm/tcm_white.png";
import "../style/appbar.css";

class Appbar extends Component {
  render() {
    return (
      <AppBar position="static" className="appbar">
        <Toolbar className="toolbar">
          <div className="appbar-block">
            <div id="logo">
              <img src={tcmWhite} />
            </div>
            <Typography type="title" color="inherit">
              小宇宙中醫學習工具箱
            </Typography>
          </div>

          <div className="appbar-block">
            <Button
              className="appbar-btn"
              onClick={() => {
                this.context.store.dispatch(push("/"));
              }}
            >
              <Search />
              <span className="btn-name">古文搜索</span>
            </Button>
            <Button
              className="appbar-btn"
              onClick={() => {
                this.context.store.dispatch(push("/tcmml"));
              }}
            >
              <Equalizer />
              <span className="btn-name">傷寒分析</span>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

Appbar.contextTypes = {
  store: PropTypes.object.isRequired
};

export default Appbar;
