const fs = require("fs");
const { parse } = require("csv-parse/sync");
const prompt = require("prompt-sync")();
const { path } = require("path");
// function declarations:
/**
 * make sure a filename has the correct extension, and add it if it doesn't
 * @param {string} fileName - The filename/path.
 * @param {string} extension - The desired extension.
 */
const fixExtension = (fileName, extension) => {
  const extLength = extension.length;
  const fnLength = fileName.length;
};
//create a flag to allow the user to quit the app

/**
 * make a string into a filename-appropriate string
 * removes spaces, illegal characters, replacing them with hyphens
 * @param {string} text - input string.
 */
const fixFilename = (text) => {
  let cleanText = text
    .replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "")
    .replaceAll(" ", "-")
    .toLowerCase();
  while (cleanText.includes("--")) {
    cleanText = cleanText.replaceAll("--", "-");
  }
  return cleanText;
};

/**
 * This function lists all the files in the csv directory, then it prompts
 * the user to select a file. It waits for a valid choice, then returns the filename.
 * @param message - The message to display to the user.
 * @returns The file name of the file selected by the user.
 */
const promptCSVFile = (message) => {
  const fileList = fs.readdirSync("./csv/", { withFileTypes: true });
  const fileNames = [];
  fileList.forEach((item) => {
    if (item.isFile()) {
      fileNames.push(item.name);
    }
  });
  let isPromptLoopRunning = true;
  while (isPromptLoopRunning) {
    // console.clear;

    fileNames.forEach((item, index) => {
      console.log(`[${index + 1}] ${item}`);
    });
    const selectValue = prompt(message + " ");

    const selectIndex = parseInt(selectValue) - 1;
    if (fileNames[selectIndex]) {
      return fileNames[selectIndex];
      isPromptLoopRunning = false;
    }
  }
};

console.log("welcome to batch-rename");
console.log("you should have:");
console.log("1) assets in /img folder named as baseName_(1,2,3).jpg");
console.log("2) csv file in /csv folder with a list of output file names");
console.log("3) csv file in /csv folder with list of input file names");
let baseName = prompt("current base file name (default is asset) ", "asset");
let newPrefix = prompt(
  "new prefix (ie TS22, SM22, OL22) or leave blank to omit "
);
if (newPrefix.length > 0) {
  newPrefix = newPrefix + "_";
}
//ask for filenames
let inputFilePath = promptCSVFile(
  "Choose a CSV file containing the list of asset types."
);

//ask for unique identifiers

inputFilePath = "./csv/" + inputFilePath;
const inputFileText = fs.readFileSync(inputFilePath);
const AAA = parse(inputFileText).flat();
const fileNameArray = AAA.map(fixFilename);
console.log(fileNameArray);

let outputFilePath = promptCSVFile(
  "Choose a CSV file containing the list of batch names."
);

const outputFileText = fs.readFileSync("./csv/" + outputFilePath);
const BBB = parse(outputFileText).flat();
const outputNameArray = BBB.map(fixFilename);
console.log(outputNameArray);
let multiplier = fileNameArray.length;
prompt(`OK to rename ${multiplier * outputNameArray.length} items?`);
let errorCount = 0;
let successCount = 0;

//fix the first file
try {
  fs.renameSync(`./img/${baseName}_.jpg`, `./img/${baseName}_1.jpg`);
} catch {
  console.log("error renaming first file");
}

outputNameArray.forEach((outputItem, outputIndex) => {
  fileNameArray.forEach((inputItem, inputIndex) => {
    let curIndex = outputIndex * multiplier + inputIndex + 1;
    let newFilename = `./img/${newPrefix}${outputItem}_${inputItem}.jpg`;
    let oldFilename = `./img/${baseName}_${curIndex}.jpg`;

    try {
      fs.renameSync(oldFilename, newFilename);
      successCount++;
      console.log("successfully renamed file:");
      console.log(`  ${oldFilename} >>> ${newFilename}`);
    } catch {
      console.log("error renaming file:");
      console.log(`  ${oldFilename} >>> ${newFilename}`);
      errorCount++;
    }
  });
});
console.log(
  `Completed renaming ${successCount} files with ${errorCount} errors`
);
