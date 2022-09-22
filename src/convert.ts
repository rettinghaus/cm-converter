import GABC from './gabc/converter.class';
import MEI from './mei/converter.class';
import * as Path from "path";
import {PathLike} from "fs";
import ErrnoException = NodeJS.ErrnoException;

const fs = require('fs');
const path = require('path');


type ConverterType = "GABC" | "MEI";
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
const splitFileNameFromPath = (filePaths: any, filenameRegex: RegExp): FilePath[] =>
    filePaths.filter((path: string) => path.match(filenameRegex))
        .map((path: string) => {
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
    console.log(files);
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
    console.log("Convert File")
    if (type === "GABC") {
        transformFile(filePath, outputFolder, new GABC());
    } else if (type === 'MEI') {
        transformFile(filePath, outputFolder, new MEI());
    }
}

/**
 * Open file, transform content, write file.
 */
const transformFile = (inputFilePath: string, outputFolder: string, transformer: any) => {
    fs.readFile(inputFilePath, "utf-8", (error: ErrnoException, text: string) => {
        if (!error) {
            const dataOut = transformer.transformWrite(text);
            if (!dataOut) {
                console.log("Error: data undefined")
                return false;
            }
            const outputFile = inputFilePath.replace(/.*\/(.*?)\.json/, "$1" + transformer.file_extension)
            fs.writeFile(outputFolder + "/" + outputFile, dataOut, (error: ErrnoException) => {
                if (error) {
                    console.error("Error: Couldn't write file", error);
                    return false;
                }
            })
        } else {
            console.error("Node FS Error. Couldn't read file.")
            return false;
        }
    })
}


/**
 * Get list of files recursively
 */
const getFiles = (root: any, files: any = [], prefix: any = '') => {
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
if ("type" in args && "i" in args && "o" in args) {
    if (args['type'] === 'GABC') {
        console.log("Converting to GABC")
        convertFolder(args['i'], args['o'], 'GABC');
    } else if (args['type'] === 'MEI') {
        convertFolder(args['i'], args['o'], 'MEI');
    } else {
        console.error("You gave no valid Type");
    }
} else {
    console.error("You have to provide arguments 'i', 'o' and 'type");
}