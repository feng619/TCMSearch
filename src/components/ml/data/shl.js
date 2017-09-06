var shlAnalysis = [
  {
    fangName: "桂枝湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪風", 1], ["發熱", 1], ["悪寒", 1]]
      },
      {
        symptomClassName: "汗",
        symptoms: [["汗出", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      },
      {
        symptomClassName: "耳鼻喉",
        symptoms: [["鼻鳴", 1], ["乾嘔", 1]]
      }
    ]
  },
  {
    fangName: "桂枝加葛根湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪風", 1], ["悪寒", 1]]
      },
      {
        symptomClassName: "汗",
        symptoms: [["汗出", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1], ["項背僵硬", 1]]
      }
    ]
  },
  {
    fangName: "桂枝湯加厚朴杏子",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪風", 1], ["發熱", 1], ["悪寒", 1]]
      },
      {
        symptomClassName: "汗",
        symptoms: [["汗出", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      },
      {
        symptomClassName: "耳鼻喉",
        symptoms: [["喘家", 1], ["鼻鳴", 1], ["乾嘔", 1]]
      }
    ]
  },
  {
    fangName: "桂枝加附子湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪風", 1], ["悪寒", 1]]
      },
      {
        symptomClassName: "汗",
        symptoms: [["汗出", 1], ["汗流不止", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1], ["項背僵硬", 1]]
      },
      {
        symptomClassName: "大小便",
        symptoms: [["小便困難", 1]]
      },
      {
        symptomClassName: "四肢",
        symptoms: [["四肢難伸", 1]]
      }
    ]
  },
  {
    fangName: "桂枝去芍薬湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1], ["脈促", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪寒", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      },
      {
        symptomClassName: "胸部",
        symptoms: [["胸満", 1]]
      }
    ]
  },
  {
    fangName: "桂枝去芍薬加附子湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1], ["脈促", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪寒", 1], ["微寒", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      },
      {
        symptomClassName: "胸部",
        symptoms: [["胸満", 1]]
      }
    ]
  },
  {
    fangName: "桂枝麻黄各半湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1], ["脈微", 1], ["脈緩", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["發熱", 1], ["悪寒", 1], ["瘧状", 1], ["身癢", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      }
    ]
  },
  {
    fangName: "桂枝二麻黄一湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["發熱", 1], ["悪寒", 1], ["瘧状", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      }
    ]
  },
  {
    fangName: "白虎加人参湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈洪", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["煩", 1]]
      },
      {
        symptomClassName: "汗",
        symptoms: [["汗出", 1]]
      },
      {
        symptomClassName: "耳鼻喉",
        symptoms: [["渇", 1]]
      }
    ]
  },
  {
    fangName: "桂枝二越婢一湯",
    symptomClasses: [
      {
        symptomClassName: "脈相",
        symptoms: [["脈浮", 1], ["脈微", 1], ["脈弱", 1]]
      },
      {
        symptomClassName: "體感",
        symptoms: [["悪寒", 1], ["發熱", 1]]
      },
      {
        symptomClassName: "頭部",
        symptoms: [["頭痛", 1]]
      }
    ]
  }
];

// 提取所有的 fangNamesArr, symptomClassName 和 symptoms
var fangNamesArr = [],
  symptomClassNamesArr = [],
  symptomsArr = [];

shlAnalysis.map(obj => {
  var { fangName, symptomClasses } = obj;

  fangNamesArr.push(fangName);

  symptomClasses.map(sc => {
    var { symptomClassName, symptoms } = sc;

    // 尋找 symptomClassName 的 index 或是添加 symptomClassName 到 symptomClassNamesArr
    var idx = symptomClassNamesArr.findIndex(name => name === symptomClassName);
    if (idx === -1) {
      symptomClassNamesArr.push(symptomClassName);
      idx = symptomClassNamesArr.length - 1;
    }

    if (!symptomsArr[idx]) {
      symptomsArr[idx] = symptoms.map(s => s[0]);
    } else {
      symptoms.map(s => {
        var si = symptomsArr[idx].findIndex(name => name === s[0]);
        if (si === -1) {
          symptomsArr[idx].push(s[0]);
        }
      });
    }
  });
});

// 填入資料
var shlAnalysisData = shlAnalysis.map(obj => {
  // 歸零 eg: resetSymptomsArr = [[0], [0, 0, 0, 0, 0], [0, 0], [0, 0, 0], [0], [0]];
  var resetSymptomsArr = symptomsArr.map(arr => arr.map(n => 0));

  obj.symptomClasses.map(sc => {
    var { symptomClassName, symptoms } = sc;
    var idx = symptomClassNamesArr.findIndex(name => name === symptomClassName);

    symptoms.map(s => {
      var si = symptomsArr[idx].findIndex(name => name === s[0]);
      resetSymptomsArr[idx][si] = s[1];
    });
  });

  return resetSymptomsArr;
});

// 攤平成一維度
shlAnalysisData = shlAnalysisData.map(cv => [].concat.apply([], cv));
// console.log("shlAnalysisData", shlAnalysisData);

// 製作 fangNamesArr 的 label 陣列
var len = fangNamesArr.length;
var labelArr = fangNamesArr.map((cv, index) => {
  var arr = [];
  for (let i = 0; i < len; i++) {
    if (i === index) {
      arr.push(1);
    } else {
      arr.push(0);
    }
  }
  return arr;
});
// console.log("labelArr", labelArr);

// eg:
// fangNamesArr = ["桂枝湯", "桂枝加葛根湯", "桂枝加厚朴杏子湯", "桂枝加附子湯"];
// symptomClassNamesArr = ["脈相", "體感", "汗", "耳鼻喉", "大小便", "四肢"];
// symptomsArr = [
//   ["脈浮"],
//   ["頭痛", "悪風", "發熱", "悪寒", "項背僵硬"],
//   ["汗出", "汗流不止"],
//   ["鼻鳴", "乾嘔", "喘家"],
//   ["小便困難"],
//   ["四肢難伸"]
// ];
// labelArr = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

export {
  fangNamesArr,
  symptomClassNamesArr,
  symptomsArr,
  shlAnalysisData,
  labelArr
};
