import monodiToGabcConverter from './monodiToGABC/converter.class';
import monodiToMEIConverter from './monodiToMEI/converter.class';
import * as Path from "path";
import {PathLike} from "fs";

const fs = require('fs');
const path = require('path');

const argument_exists = (label: string) => Object.keys(args).indexOf(label) !== -1

type ConverterType = "monodiToGABC" | "monodiToMEI";
type FilePath = {
    folders: string;
    filename: string;
}

/**
 * Get command line arguments and pack into object so that:
 * node *.js name=value
 * =>
 * {name: value}
 */
const getArguments = () => {
    const args = process.argv.slice(2);
    return args.reduce((outputObj: any, next: string) => {
        const splitted = next.split("=");
        const returnObj = {...outputObj}
        returnObj[splitted[0]] = splitted[1];
        return returnObj;
    }, {});
}
/**
 * Gets all paths and splits it into filename & folder string
 * @param filePaths
 * @param filenameRegex
 */
const splitFileNameFromPath = (filePaths: any, filenameRegex: RegExp): FilePath[] => filePaths.filter((path: string) =>
    path.match(filenameRegex)).map((path: string) => {
    const folders = path.split("/");
    const filename = folders.pop();
    return {folders: folders.join("/"), filename};
})

/**
 * Converts the whole content of a folder recursively and writes it to outputFolder. Folder structure remains.
 */
const convertFolder = (inputFolder: string,
                       outputFolder: string,
                       type: ConverterType,
                       filenameRegex: RegExp = /data\.json$/) => {

    const files = splitFileNameFromPath(getFiles(inputFolder), filenameRegex);

    files.forEach((file: FilePath) => {
        const folders = file.folders;
        const outPath = path.join(outputFolder, folders);
        const inFile = path.join(inputFolder, file.folders, file.filename);

        if (!fs.existsSync(outPath)) {
            fs.mkdirSync(outPath, {recursive: true});
        }

        convertFile(inFile, outPath, type)
    });
}

/**
 * Converts one file and writes it to outputFolder
 */
const convertFile = (filePath: string, outputFolder: string, type: ConverterType) => {
    if (type === "monodiToGABC") {
        const doc = new monodiToGabcConverter();
        doc.transform_file(filePath, outputFolder);
    } else if (type === 'monodiToMEI') {
        const doc = new monodiToMEIConverter();
        doc.transform_file(filePath, outputFolder);
    }
}

/**
 * Get list of files recursively
 */
function getFiles(root: any, files: any = [], prefix: any = '') {
    prefix = prefix || ''
    files = files || []

    var dir = path.join(root, prefix)
    if (!fs.existsSync(dir)) return files
    if (fs.statSync(dir).isDirectory())
        fs.readdirSync(dir)
            .forEach(function (name: string) {
                getFiles(root, files, path.join(prefix, name))
            })
    else
        files.push(prefix)
    return files
}


/**
 * main entry point
 *
 */
const args = getArguments();
if (argument_exists("type") && argument_exists("i") && argument_exists("o")) {
    if (args['type'] === 'monodiToGABC') {
        convertFolder(args['i'], args['o'], 'monodiToGABC')
    } else if (args['type'] === 'monodiToMEI') {

        convertFolder(args['i'], args['o'], 'monodiToMEI')
    }
}