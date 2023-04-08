const fs = require("fs");
const { parse } = require("csv-parse/sync");
const prompt = require("prompt-sync")();
const { path } = require("path");
const { debug } = require("console");
// function declarations:
const debugMode = true;
/**
 * make sure a filename has the correct extension, and add it if it doesn't
 * @param {string} fileName - The filename/path.
 * @param {string} extension - The desired extension.
 */
const fixExtension = (fileName, extension) => {
  const extLength = extension.length;
  const fnLength = fileName.length;
};

/**
 * make a string into a filename-appropriate string
 * removes spaces, illegal characters, replacing them with hyphens
 * @param {string} text - input string.
 */
const createSafeFilename = (text) => {
  let cleanText = text
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "")
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
    if (item.isFile() && item.name.includes(".csv")) {
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
let assetTypeFilePath = promptCSVFile(
  "Choose a CSV file containing the list of asset types."
);

assetTypeFilePath = "./csv/" + assetTypeFilePath;
const assetTypeFileText = fs.readFileSync(assetTypeFilePath);
const assetTypeArray = parse(assetTypeFileText).flat().map(createSafeFilename);
console.log(assetTypeArray);

let batchNameFilePath = promptCSVFile(
  "Choose a CSV file containing the list of batch/folder names."
);

const batchNameFileText = fs.readFileSync("./csv/" + batchNameFilePath);
const batchNameArray = parse(batchNameFileText);

batchNameArray[0].map((item, index) => {
  console.log(`[${index + 1}] ${item}`);
});

let fileNameIndexRaw = prompt("Which column contains the file names?");
let folderNameIndexRaw = prompt(
  "Which column contains the folder names? (or leave blank for no folders)"
);

let fileNameIndex = parseInt(fileNameIndexRaw) - 1;
let folderNameIndex = parseInt(folderNameIndexRaw) - 1;
let folderNameArray = [];
let useFolders;
if (isNaN(folderNameIndex)) {
  //no folder name
  useFolders = false;
} else {
  useFolders = true;
  folderNameArray = batchNameArray.map((item) => item[folderNameIndex]);
}
const fileNameArray = batchNameArray.map((item) => item[fileNameIndex]);
console.log(useFolders);
console.log(folderNameArray);

const cleanFileNameArray = fileNameArray.map(createSafeFilename);
console.log(cleanFileNameArray);
// console.log(batchNameArray);

let multiplier = assetTypeArray.length;

const renameOperations = [];
const newFolders = [];

cleanFileNameArray.forEach((batchName, batchNameIndex) => {
  let baseFolder = "./img";
  if (useFolders) {
    //queue folder for creation if it doesn't already exist
    let folderName = folderNameArray[batchNameIndex];
    let folderPath = `./img/${folderName}`;
    newFolders.push(folderPath);
    baseFolder = folderPath;
  }
  assetTypeArray.forEach((assetType, assetTypeIndex) => {
    let curIndex = batchNameIndex * multiplier + assetTypeIndex + 1;
    let newFilename = `${baseFolder}/${newPrefix}${batchName}_${assetType}.jpg`;
    let oldFilename = `./img/${baseName}_${curIndex}.jpg`;
    if (batchNameIndex === 0 && assetTypeIndex === 0) {
      oldFilename = `./img/${baseName}_.jpg`;
    }
    renameOperations.push({ old: oldFilename, new: newFilename });
  });
});
newFolders.forEach((item) => {
  console.log(`create folder: ${item}`);
});
renameOperations.forEach((item) => {
  console.log(`${item.old} >> ${item.new}`);
});
prompt(
  `OK to create ${newFolders.length} folders and rename ${
    multiplier * batchNameArray.length
  } items?`
);
let fileErrorCount = 0;
let fileSuccessCount = 0;
let folderErrorCount = 0;
let folderSuccessCount = 0;
//create new folders if needed
newFolders.forEach((item) => {
  try {
    if (!fs.existsSync(item)) {
      if (!debugMode) {
        fs.mkdirSync(item);
      }
    }
    folderSuccessCount++;
  } catch {
    folderErrorCount++;
  }
});
//rename files and place them in the correct folders;
renameOperations.forEach((item) => {
  try {
    if (!debugMode) {
      fs.renameSync(item.old, item.new);
    }

    fileSuccessCount++;
  } catch {
    fileErrorCount++;
  }
});

console.log(
  `Completed creating ${folderSuccessCount} folders with ${folderErrorCount} errors`,
  `Completed renaming ${fileSuccessCount} files with ${fileErrorCount} errors`
);
