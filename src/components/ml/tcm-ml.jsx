// @flow
import React, { Component } from "react";
import ml from "machine_learning";
import Appbar from "../appbar";
import {
  fangNamesArr,
  symptomClassNamesArr,
  symptomsArr,
  shlAnalysisData,
  labelArr
} from "./data/shl";

import Button from "material-ui/Button";
import Input from "material-ui/Input/Input";
import Equalizer from "material-ui-icons/Equalizer";
import Clear from "material-ui-icons/Clear";

import "../../style/components/ml/tcm-ml.css";

class TCMml extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mlp: null,
      predictValue: null,
      // result
      resultNum: 3,
      resultArr: null
    };
  }

  componentDidMount() {
    var mlp = new ml.MLP({
      input: shlAnalysisData,
      label: labelArr,
      n_ins: shlAnalysisData[0].length,
      n_outs: labelArr[0].length,
      hidden_layer_sizes: [4, 4, 5]
    });

    mlp.set("log level", 0); // 0 : nothing, 1 : info, 2 : warning.

    mlp.train({
      lr: 0.6,
      epochs: 20000 * 3
    });

    this.setState({
      mlp,
      predictValue: symptomsArr.map(arr => arr.map(n => 0))
    });
  }

  renderClassBlocks() {
    var { predictValue } = this.state;
    if (!predictValue) return;

    return symptomClassNamesArr.map((className, i) => {
      return (
        <div key={className + i} className="class-block">
          <h4>{className}</h4>

          <div key={className + i + "s"} className="symptom-block-wrapper">
            {symptomsArr[i].map((symptom, j) => {
              return (
                <div key={symptom + i} className="symptom-block">
                  <h5>{symptom}</h5>
                  <Input
                    className="symptom-input"
                    value={predictValue[i][j]}
                    onChange={e => {
                      predictValue[i][j] = e.target.value;
                      this.setState({ predictValue });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }

  onClear() {
    this.setState({
      resultArr: null,
      predictValue: symptomsArr.map(arr => arr.map(n => 0))
    });
  }

  onAnalysis() {
    var { mlp, predictValue, resultNum } = this.state;
    if (!predictValue) return;

    // 攤平成一維度
    var arr = [];
    predictValue.map(cv => {
      cv.map(el => {
        arr.push(el);
      });
    });

    // 取得結果，並排序
    var rawResultArr = mlp.predict([arr])[0];
    var sortedArr = rawResultArr
      .slice(0)
      .sort((a, b) => b - a)
      .slice(0, resultNum);
    var resultArr = [];

    sortedArr.map(value => {
      var idx = rawResultArr.findIndex(num => num === value);
      resultArr.push({ fangName: fangNamesArr[idx], value });
    });

    this.setState({ resultArr });
  }

  renderResult() {
    var { resultArr } = this.state;
    if (!resultArr) return;

    return (
      <div id="result-block">
        <h4>傷寒論中最有可能治療的方劑如下：</h4>
        <div id="result-row-wrapper">
          {resultArr.map((cv, i) => {
            var { fangName, value } = cv,
              level = "";

            value = (value * 100).toFixed(1);
            if (value <= 5) level = "hide";
            else if (value <= 20) level = "low";
            else if (value >= 90) level = "high";

            return (
              <div key={fangName + i} className={`result-row ${level}`}>
                <div className="result-idx">{i + 1}</div>
                <div className="result-fangname">{fangName}</div>
                <div className="result-value">{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div id="tcm-ml-wrapper">
        <Appbar />

        <div id="select-block">
          <h2>請選擇症狀</h2>
          <h4>根據症狀輕重程度填入 0 ~ 1 的數字</h4>

          <div id="class-block-wrapper">{this.renderClassBlocks()}</div>

          <div id="btn-wrapper">
            <Button
              raised
              className="gbtn gbtn-small"
              onClick={this.onClear.bind(this)}
            >
              <Clear />
              <span className="btn-name">清除</span>
            </Button>
            <Button
              raised
              className="gbtn"
              onClick={this.onAnalysis.bind(this)}
            >
              <Equalizer />
              <span className="btn-name">傷寒分析</span>
            </Button>
          </div>
        </div>

        {this.renderResult()}
      </div>
    );
  }
}

export default TCMml;
