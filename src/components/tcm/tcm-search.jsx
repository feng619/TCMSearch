// @flow
import React, { Component } from "react";
import SHL from "./data/shangHanLun";
import SNBCJ from "./data/shenNongBenCaoJing";
import JKYL from "./data/jinKuiYaoLue";
import BHYJ from "./data/biHuaYiJing";
import ZYLCESWN from "./data/zhongYiLinChuangErShiWuNian";
import {
  herbsOptions,
  symptomOptions,
  prescriptionOptions
} from "./data/searchWords";

import Select from "react-select";
import "react-select/dist/react-select.css";

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { FormGroup, FormControlLabel } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";

import "../../style/components/tcm/tcm-search.css";

class TCMSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for checkbox
      checkedSHL: true,
      checkedSNBCJ: true,
      checkedJKYL: true,
      checkedBHYJ: true,
      checkedZYLCESWN: true,
      // for search
      booksArr: [SHL, SNBCJ, JKYL, BHYJ, ZYLCESWN],
      namesArr: null,
      // herb
      selectHerbsValue: null,
      selectHerbNamesArr: null,
      // symptom
      selectSymptomsValue: null,
      selectSymptomNamesArr: null,
      // prescription
      selectPrescriptionsValue: null,
      selectPrescriptionNamesArr: null,
      // free input
      selectFreeInput: "",
      // result
      result: null
    };
  }

  handleCheckboxChange(checkedBookName, event, tf) {
    this.setState({ [checkedBookName]: tf });
  }

  onSelectHerbsChange(cv) {
    var selectHerbsArr = herbsOptions.find(el => {
      return el.value === cv.value;
    });

    this.setState({
      selectHerbsValue: cv.value,
      selectHerbNamesArr: selectHerbsArr.nameArr
    });
  }

  onSelectSymptomsChange(cv) {
    var selectSymptomsArr = symptomOptions.find(el => {
      return el.value === cv.value;
    });

    this.setState({
      selectSymptomsValue: cv.value,
      selectSymptomNamesArr: selectSymptomsArr.nameArr
    });
  }

  onSelectPrescriptionsChange(cv) {
    var selectPrescriptionsArr = prescriptionOptions.find(el => {
      return el.value === cv.value;
    });

    this.setState({
      selectPrescriptionsValue: cv.value,
      selectPrescriptionNamesArr: selectPrescriptionsArr.nameArr
    });
  }

  onSearch(searchType) {
    const {
      checkedSHL,
      checkedSNBCJ,
      checkedJKYL,
      checkedBHYJ,
      checkedZYLCESWN,
      booksArr,
      selectHerbNamesArr,
      selectSymptomNamesArr,
      selectPrescriptionNamesArr,
      selectFreeInput
    } = this.state;
    var namesArr = [];

    // 決定搜索種類要用的 nameArr
    if (searchType === "search_herb") {
      if (!selectHerbNamesArr) return;
      namesArr = selectHerbNamesArr;
    } else if (searchType === "search_symptom") {
      if (!selectSymptomNamesArr) return;
      namesArr = selectSymptomNamesArr;
    } else if (searchType === "search_prescription") {
      if (!selectPrescriptionNamesArr) return;
      namesArr = selectPrescriptionNamesArr;
    } else if (searchType === "search_free") {
      if (!selectFreeInput) return;
      namesArr = [selectFreeInput];
    }

    // 過濾要搜尋的書本
    var filteredBookArr = [],
      tfArr = [
        checkedSHL,
        checkedSNBCJ,
        checkedJKYL,
        checkedBHYJ,
        checkedZYLCESWN
      ];
    booksArr.map((book, i) => {
      if (tfArr[i]) filteredBookArr.push(book);
    });

    var result = { namesArr, booksData: [] };

    // 每本書都要過濾
    filteredBookArr.map(book => {
      var { bookName, haveChapter, contentArr } = book;
      var content = [];

      // 篩選書籍中的段落
      contentArr.map(section => {
        const { chapter, title, sentences } = section;
        var filteredSentences = []; // 過濾後的句子

        sentences.map(sentence => {
          var n = -1,
            isfound = false;

          // 只要句子裡有任何一個名稱符合，就要放入結果
          namesArr.map(name => {
            n = sentence.search(name);
            if (n !== -1) isfound = true;
          });

          if (isfound) filteredSentences.push(sentence);
        });

        if (filteredSentences.length > 0) {
          content.push({ chapter, title, sentences: filteredSentences });
        }
      });

      result.booksData.push({ bookName, haveChapter, content });
    });

    this.setState({ result });
  }

  renderResult() {
    const { result } = this.state;
    if (!result) return;
    const { namesArr, booksData } = result;
    if (!namesArr || !booksData) return;

    // 每本書回傳一個 div 包
    return booksData.map(bookData => {
      const { bookName, haveChapter, content } = bookData;

      // 儲存章節，目的是為了不要讓同樣章節的名稱重複出現
      var oldChapter = "";

      // 高亮標記關鍵字草本名稱
      var lists = content.map((section, i) => {
        const { chapter, title, sentences } = section;

        // 如果章節名是空字串 或是 新的章節名和上一個章節名一樣，就不要顯示
        var shouldShowChapter = false;
        if (chapter !== "" && oldChapter !== chapter) {
          shouldShowChapter = true;
        }
        oldChapter = chapter;

        return (
          <div key={title}>
            {shouldShowChapter
              ? <h3>
                  {chapter}
                </h3>
              : null}

            <h4>
              {title}
            </h4>

            <div className="sentences">
              {sentences.map((sentence, j) => {
                // hlSentence = 去除掉 name 的句子片段 ，name = 關鍵字草本名稱
                var hlSentence = [],
                  name = "";

                // 尋找草本名稱是繁體字還是簡體字
                namesArr.map(herbName => {
                  var n = sentence.search(herbName);
                  if (n !== -1) {
                    hlSentence = sentence.split(herbName);
                    name = herbName;
                  }
                });

                return (
                  <div key={sentence} className="sentence">
                    {hlSentence.map((cv, k, arr) => {
                      if (k !== arr.length - 1) {
                        // 句中
                        return (
                          <span key={cv}>
                            {cv}
                            <span className="highlight-fonts">
                              {name}
                            </span>
                          </span>
                        );
                      } else if (k === arr.length - 1) {
                        // 句尾
                        return (
                          <span key={cv}>
                            {cv}
                          </span>
                        );
                      }
                    })}
                  </div>
                );
              }) // end of sentences.map
              }
            </div>
          </div>
        );
      }); // end of lists = content.map

      return (
        <div key={bookName} className="books-block">
          <h2>
            {bookName}
          </h2>
          <div className={`lists-block ${haveChapter ? "haveChapter" : ""}`}>
            {lists.length === 0 ? <p className="no-data">本書查無此關鍵字</p> : lists}
          </div>
        </div>
      );
    }); // end of booksData.map
  }

  render() {
    const {
      checkedSHL,
      checkedSNBCJ,
      checkedJKYL,
      checkedBHYJ,
      checkedZYLCESWN,
      selectHerbsValue,
      selectSymptomsValue,
      selectPrescriptionsValue,
      selectFreeInput
    } = this.state;
    console.log(selectFreeInput);
    return (
      <div id="tcm-search-wrapper">
        <AppBar position="static" className="appbar">
          <Toolbar>
            <Typography type="title" color="inherit">
              小宇宙中醫古文查詢系統
            </Typography>
          </Toolbar>
        </AppBar>

        <div id="option-block">
          <h2>搜尋選項</h2>
          <h4>請勾選要納入搜尋的書籍</h4>

          <FormGroup row className="checkbox-row">
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedSHL ? "checked-style" : ""}
                  checked={checkedSHL}
                  onChange={this.handleCheckboxChange.bind(this, "checkedSHL")}
                  value="checkedSHL"
                />
              }
              label="傷寒論"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedSNBCJ ? "checked-style" : ""}
                  checked={checkedSNBCJ}
                  onChange={this.handleCheckboxChange.bind(
                    this,
                    "checkedSNBCJ"
                  )}
                  value="checkedSNBCJ"
                />
              }
              label="神農本草經"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedJKYL ? "checked-style" : ""}
                  checked={checkedJKYL}
                  onChange={this.handleCheckboxChange.bind(this, "checkedJKYL")}
                  value="checkedJKYL"
                />
              }
              label="金匱要略"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedBHYJ ? "checked-style" : ""}
                  checked={checkedBHYJ}
                  onChange={this.handleCheckboxChange.bind(this, "checkedBHYJ")}
                  value="checkedBHYJ"
                />
              }
              label="筆花醫鏡"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedZYLCESWN ? "checked-style" : ""}
                  checked={checkedZYLCESWN}
                  onChange={this.handleCheckboxChange.bind(
                    this,
                    "checkedZYLCESWN"
                  )}
                  value="checkedZYLCESWN"
                />
              }
              label="中醫臨床廿五年"
            />
          </FormGroup>
        </div>

        <div id="select-block">
          <div className="search-row">
            <Select
              className="select"
              name="select-herbs"
              value={selectHerbsValue}
              placeholder="請選擇草本"
              options={herbsOptions}
              clearable={false}
              onChange={this.onSelectHerbsChange.bind(this)}
            />
            <Button
              raised
              className="gbtn"
              onClick={this.onSearch.bind(this, "search_herb")}
            >
              草本查詢
            </Button>
          </div>
          <div className="search-row">
            <Select
              className="select"
              name="select-symptoms"
              value={selectSymptomsValue}
              placeholder="請選擇症狀"
              options={symptomOptions}
              clearable={false}
              onChange={this.onSelectSymptomsChange.bind(this)}
            />
            <Button
              raised
              className="gbtn"
              onClick={this.onSearch.bind(this, "search_symptom")}
            >
              症狀查詢
            </Button>
          </div>
          <div className="search-row">
            <Select
              className="select"
              name="select-prescriptions"
              value={selectPrescriptionsValue}
              placeholder="請選擇方劑"
              options={prescriptionOptions}
              clearable={false}
              onChange={this.onSelectPrescriptionsChange.bind(this)}
            />
            <Button
              raised
              className="gbtn"
              onClick={this.onSearch.bind(this, "search_prescription")}
            >
              方劑查詢
            </Button>
          </div>

          <div className="search-row freeinput">
            <TextField
              label="請輸入查詢關鍵字"
              className="free-input"
              value={selectFreeInput}
              onChange={e => this.setState({ selectFreeInput: e.target.value })}
            />
            <Button
              raised
              className="gbtn"
              onClick={this.onSearch.bind(this, "search_free")}
            >
              自訂查詢
            </Button>
          </div>
        </div>

        <div id="result-block">
          {this.renderResult()}
        </div>
      </div>
    );
  }
}

export default TCMSearch;