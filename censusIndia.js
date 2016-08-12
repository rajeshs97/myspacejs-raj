var literateAc2Agegroups = new Object();
var educationCategory = new Object();

function D3JsonCreator (objObj) {
  var arrObj =  new Array();
  for(key in objObj) {
    arrObj.push(objObj[key]);
  }
  return arrObj;
}

function textToArrayHash(text) {
  var headerLine = new Array();
  text.split("\n").map(function(strLine, lineNum){
    if(strLine !== '') {
      var arrayLine = strLine.split(",");
      if (lineNum != 0) {
        arrayLine[4] = arrayLine[4].trim();
        ageKey = arrayLine[5].trim();
        if (arrayLine[4] == "Total" ) {
          if (arrayLine[5] != "All ages") {
            arrayLine[12] = parseInt(arrayLine[12]);
            if(ageKey in literateAc2Agegroups){
              literateAc2Agegroups[ageKey].TotalLiteratePop += arrayLine[12];
            }
            else {
              // console.log("Keys are "+ Object.keys(literateAc2Agegroups));
              // console.log("key" + ageKey);
              literateAc2Agegroups[ageKey] = new Object();
              literateAc2Agegroups[ageKey].ageGroup = ageKey;
              literateAc2Agegroups[ageKey].TotalLiteratePop = arrayLine[12];

            }
          }
          else {
            for(eduCatIndex=15;eduCatIndex<44;eduCatIndex+=3) {
              var eduCatValue = headerLine[eduCatIndex].trim().match(/.*- (.*) -.*/)[1];
              var totalPopValue = parseInt(arrayLine[eduCatIndex]);
              if (eduCatValue in educationCategory) {
                educationCategory[eduCatValue].totalPop += totalPopValue;
              }
              else {
                educationCategory[eduCatValue] = {eduCateg: eduCatValue, totalPop:totalPopValue };
              }
            }
          }
        }
      }
      else {
        headerLine = arrayLine;
      }
    }
  });
}
function fileReader(fileNames) {
  fileNames.map(function(fileName){
    var fs = require('fs');
    var data = fs.readFileSync(fileName).toString();
    console.log("For File: "+fileName);
    textToArrayHash(data);
  });
  literateAc2Agegroups = D3JsonCreator(literateAc2Agegroups);
  educationCategory = D3JsonCreator(educationCategory);
}
function IndiaCensus(){
  var fs = require('fs');
  fs.writeFile("literateAc2Agegroups.json",JSON.stringify(literateAc2Agegroups),function(err) {
    if (err) throw err;
    console.log('age wise json created');
  });
  fs.writeFile("educationCategory.json",JSON.stringify(educationCategory), function(err) {
    if (err) throw err;
    console.log('education category wise json created');
  });
}
var fileNames = ["India2011.csv","IndiaSC2011.csv","IndiaST2011.csv"];
fileReader(fileNames);
IndiaCensus();
