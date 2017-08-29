// @flow
import React, { Component } from "react";
import SHL from "./data/shangHanLun.js";
import JKYL from "./data/jinKuiYaoLue.js";
import SNBCJ from "./data/shenNongBenCaoJing.js";
import ZYLCESWN from "./data/zhongYiLinChuangErShiWuNian.js";
import JFSYL from "./data/jingFangShiYanLu.js";
import SHMYYAJX from "./data/shangHanMingYiYanAnJingXuan.js";
import BHYJ from "./data/biHuaYiJing.js";
import {
  herbsOptions,
  symptomOptions,
  prescriptionOptions
} from "./data/searchWords.js";

import Select from "react-select";
import "react-select/dist/react-select.css";

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { FormGroup, FormControlLabel } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";

import tcmWhite from "../../images/components/tcm/tcm_white.png";

import "../../style/components/tcm/tcm-search.css";

class TCMSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for checkbox
      checkedSHL: true,
      checkedJKYL: false,
      checkedSNBCJ: false,
      checkedZYLCESWN: true,
      checkedJFSYL: true,
      checkedSHMYYAJX: true,
      checkedBHYJ: false,
      // for search
      booksArr: [SHL, JKYL, SNBCJ, ZYLCESWN, JFSYL, SHMYYAJX, BHYJ],
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
      // multi input
      selectMultiInput: "",
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
      checkedJKYL,
      checkedSNBCJ,
      checkedZYLCESWN,
      checkedJFSYL,
      checkedSHMYYAJX,
      checkedBHYJ,
      booksArr,
      selectHerbNamesArr,
      selectSymptomNamesArr,
      selectPrescriptionNamesArr,
      selectFreeInput,
      selectMultiInput
    } = this.state;
    var namesArr = [];

    // 搜尋結果預設值
    var result = { isMulti: false, namesArr: [], booksData: [] };

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
    } else if (searchType === "search_multi") {
      if (!selectMultiInput) return;
      // 去除掉空字串
      namesArr = selectMultiInput.split(" ").filter(cv => cv && cv !== "");
      // 這次搜尋是複合搜尋的模式
      result.isMulti = true;
    }

    result.namesArr = namesArr;

    // 過濾要搜尋的書本
    var filteredBookArr = [],
      tfArr = [
        checkedSHL,
        checkedJKYL,
        checkedSNBCJ,
        checkedZYLCESWN,
        checkedJFSYL,
        checkedSHMYYAJX,
        checkedBHYJ
      ];
    booksArr.map((book, i) => {
      if (tfArr[i]) filteredBookArr.push(book);
    });

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

          // 判斷是 單項搜尋 還是 複合搜尋
          if (result.isMulti) {
            // 必須要句子裡所有名稱都符合，才放入結果
            isfound = true;
            namesArr.map(name => {
              n = sentence.search(name);
              if (n === -1) isfound = false;
            });
          } else {
            // 只要句子裡有任何一個名稱符合，就要放入結果
            namesArr.map(name => {
              n = sentence.search(name);
              if (n !== -1) isfound = true;
            });
          }

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
    const { isMulti, namesArr, booksData } = result;
    if (!namesArr || !booksData) return;

    var that = this;

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
                  name = "",
                  sortedKeywordsArr = [];

                // 判斷是 單項搜尋 還是 複合搜尋
                if (isMulti) {
                  // 所有關鍵字都要能夠 split 字串
                  var replace = namesArr.join("|");
                  hlSentence = sentence.split(new RegExp(replace, "g"));

                  // 取得用來斷開句子的關鍵字的排序
                  sortedKeywordsArr = that.getIndexsOfStrByWordsArr(
                    namesArr,
                    sentence
                  );
                } else {
                  // 尋找草本名稱是繁體字還是簡體字
                  namesArr.map(herbName => {
                    var n = sentence.search(herbName);
                    if (n !== -1) {
                      hlSentence = sentence.split(herbName);
                      name = herbName;
                    }
                  });
                }

                return (
                  <div key={sentence} className="sentence">
                    {hlSentence.map((cv, k, arr) => {
                      if (k !== arr.length - 1) {
                        // 句中
                        return (
                          <span key={cv + k}>
                            {cv}
                            <span className="highlight-fonts">
                              {isMulti ? sortedKeywordsArr[k].word : name}
                            </span>
                          </span>
                        );
                      } else if (k === arr.length - 1) {
                        // 句尾
                        return (
                          <span key={cv + k}>
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

  getIndexsOfStrByWordsArr(wordsArr, str) {
    // 給一個陣列，裡面有很多關鍵字，再給一個句子。要 return 一個陣列，裡面有關鍵字出現在句子裡的順序
    function getIndicesOf(searchStr, str) {
      var searchStrLen = searchStr.length;
      if (searchStrLen == 0) {
        return [];
      }
      var startIndex = 0,
        index,
        indices = [];
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
      }
      return indices;
    }

    var resultArr = []; // [{index: 0, word: '熱'},{index: 2, word: '渴'}]
    wordsArr.map(word => {
      var arr = getIndicesOf(word, str); // ex [0, 1, 6]
      arr.map(index => {
        resultArr.push({ index, word });
      });
    });

    // 將 resultArr 根據 index 來做物件的排序
    resultArr.sort(function(a, b) {
      return a.index - b.index;
    });

    return resultArr;
  }

  render() {
    const {
      checkedSHL,
      checkedJKYL,
      checkedSNBCJ,
      checkedZYLCESWN,
      checkedJFSYL,
      checkedSHMYYAJX,
      checkedBHYJ,
      selectHerbsValue,
      selectSymptomsValue,
      selectPrescriptionsValue,
      selectFreeInput,
      selectMultiInput
    } = this.state;

    return (
      <div id="tcm-search-wrapper">
        <AppBar position="static" className="appbar">
          <Toolbar>
            <div id="logo">
              <img src={tcmWhite} />
            </div>
            <Typography type="title" color="inherit">
              小宇宙中醫古文查詢系統
            </Typography>
          </Toolbar>
        </AppBar>

        <div id="option-block">
          <h2>搜尋選項</h2>
          <h4>請勾選要納入搜尋的書籍</h4>

          <FormGroup row className="checkbox-row">
            <h4>傷寒</h4>
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
                  className={checkedJKYL ? "checked-style" : ""}
                  checked={checkedJKYL}
                  onChange={this.handleCheckboxChange.bind(this, "checkedJKYL")}
                  value="checkedJKYL"
                />
              }
              label="金匱要略"
            />
          </FormGroup>
          <FormGroup row className="checkbox-row">
            <h4>本草</h4>
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
          </FormGroup>
          <FormGroup row className="checkbox-row">
            <h4>醫案</h4>
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
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedJFSYL ? "checked-style" : ""}
                  checked={checkedJFSYL}
                  onChange={this.handleCheckboxChange.bind(
                    this,
                    "checkedJFSYL"
                  )}
                  value="checkedJFSYL"
                />
              }
              label="經方實驗錄"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className={checkedSHMYYAJX ? "checked-style" : ""}
                  checked={checkedSHMYYAJX}
                  onChange={this.handleCheckboxChange.bind(
                    this,
                    "checkedSHMYYAJX"
                  )}
                  value="checkedSHMYYAJX"
                />
              }
              label="傷寒名醫驗案精選"
            />
          </FormGroup>
          <FormGroup row className="checkbox-row">
            <h4>雜著</h4>
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
          </FormGroup>
        </div>

        <div className="select-block">
          <h4>單項查詢</h4>
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

        <div className="select-block multi">
          <h4>複合查詢</h4>
          <p>{`您的複合查詢關鍵字：${selectMultiInput.split(" ").join(" + ")}`}</p>

          <div className="search-row">
            <TextField
              label="請用半形空白隔開複合查詢的關鍵字"
              className="free-input"
              value={selectMultiInput}
              onChange={e =>
                this.setState({ selectMultiInput: e.target.value })}
            />
            <Button
              raised
              className="gbtn"
              onClick={this.onSearch.bind(this, "search_multi")}
            >
              複合查詢
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
