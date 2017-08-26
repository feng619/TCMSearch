var herbsArr = [
  ["桂枝", "桂枝"],
  ["芍藥", "芍药", "芍薬"],
  ["甘草", "甘草"],
  ["生薑", "生姜"],
  ["大棗", "大枣"]
];
var symptomArr = [["頭痛", "头痛"], ["發熱", "发热"], ["汗出", "汗出"], ["惡風", "恶风"]];

// 改造成可以作為選項的格式
var herbsOptions = herbsArr.map(cv => {
  return { nameArr: cv, value: cv[0], label: cv.join(", ") };
});
var symptomOptions = symptomArr.map(cv => {
  return { nameArr: cv, value: cv[0], label: cv.join(", ") };
});

export { herbsOptions, symptomOptions };
