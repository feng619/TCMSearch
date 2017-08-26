// @flow
import React, { Component } from "react";
import SHL from "./data/ShangHanLun";
import BHYJ from "./data/biHuaYiJing";
import { herbsOptions, symptomOptions } from "./data/SearchWords";

import Select from "react-select";
import "react-select/dist/react-select.css";

import Button from "material-ui/Button";
import { lightGreen } from "material-ui/colors";

import "../../style/components/tcm/tcm-search.css";

class TCMSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksArr: [SHL, BHYJ],
      namesArr: null,
      // herb
      selectHerbsValue: null,
      selectHerbNamesArr: null,
      // symptom
      selectSymptomsValue: null,
      selectSymptomNamesArr: null,
      // result
      result: null
    };
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

  onSearch(searchType) {
    const { booksArr, selectHerbNamesArr, selectSymptomNamesArr } = this.state;
    var namesArr = [];

    // 決定搜索種類要用的 nameArr
    if (searchType === "search_herb") {
      if (!selectHerbNamesArr) return;
      namesArr = selectHerbNamesArr;
    } else if (searchType === "search_symptom") {
      if (!selectSymptomNamesArr) return;
      namesArr = selectSymptomNamesArr;
    }

    var result = { namesArr, booksData: [] };

    // 每本書都要過濾
    booksArr.map(book => {
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
                  <div key={sentence}>
                    {hlSentence.map((cv, k, arr) => {
                      if (k !== arr.length - 1) {
                        // 句中
                        return (
                          <span key={cv}>
                            {cv}
                            <span style={{ color: "red" }}>
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
            {lists}
          </div>
        </div>
      );
    }); // end of booksData.map
  }

  render() {
    const { selectHerbsValue, selectSymptomsValue } = this.state;

    return (
      <div id="tcm-search-wrapper">
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
        </div>
        <div id="result-block">
          {this.renderResult()}
        </div>
      </div>
    );
  }
}

export default TCMSearch;

// 待辦事項 整理 BHYJ 變成 SHL 的兩層物件的格式 / 去掉 booksArr.pop();
