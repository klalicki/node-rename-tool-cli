const fs = require("fs");
const { parse } = require("csv-parse/sync");
const prompt = require("prompt-sync")();
const { path } = require("path");

console.log("welcome to batch-rename");
console.log("you should have:");
console.log("1) assets in /img folder named as baseName_(1,2,3).jpg");
console.log("2) csv file in /csv folder with a list of output file names");
console.log("3) csv file in /csv folder with list of input file names");
let baseName = prompt("current base file name (default is asset) ", "asset");
let newBaseName = prompt(
  "new base file name (ie TS22, SM22, OL22, default is TS22) ",
  "TS22"
);
//ask for filenames
let inputFilePath = prompt(
  "input file CSV (default ts_filenames.csv)? this one contains a list of the file dimensions ",
  "ts22.csv"
);
//ask for unique identifiers

inputFilePath = "./csv/" + inputFilePath;
const inputFileText = fs.readFileSync(inputFilePath);
const AAA = parse(inputFileText).flat();
const fileNameArray = AAA.map(fixFilename);
console.log(fileNameArray);

let outputFilePath = prompt(
  "output file CSV (default facultynames.csv)? this one contains a list of faculty names ",
  "facultynames.csv"
);
const outputFileText = fs.readFileSync("./csv/" + outputFilePath);
const BBB = parse(outputFileText).flat();
const outputNameArray = BBB.map(fixFilename);
console.log(outputNameArray);
let multiplier = fileNameArray.length;
prompt(`OK to rename ${multiplier * outputNameArray.length} items?`);
//fix the first file
fs.renameSync(`./img/${baseName}_.jpg`, `./img/${baseName}_1.jpg`);

outputNameArray.forEach((outputItem, outputIndex) => {
  fileNameArray.forEach((inputItem, inputIndex) => {
    let curIndex = outputIndex * multiplier + inputIndex + 1;
    let newFilename = `./img/${newBaseName}_${outputItem}_${inputItem}.jpg`;
    let oldFilename = `./img/${baseName}_${curIndex}.jpg`;
    console.log(`${oldFilename} >>> ${newFilename}`);
    fs.renameSync(oldFilename, newFilename);
  });
});

/**
 * make sure a filename has the correct extension, and add it if it doesn't
 * @param {string} fileName - The filename/path.
 * @param {string} extension - The desired extension.
 */
function fixExtension(fileName, extension) {
  const extLength = extension.length;
  const fnLength = fileName.length;
}

/**
 * make a string into a filename-appropriate string
 * removes spaces, illegal characters, replacing them with hyphens
 * @param {string} text - input string.
 */
function fixFilename(text) {
  return text.replaceAll(" ", "-").toLowerCase().replaceAll("--", "-");
}
