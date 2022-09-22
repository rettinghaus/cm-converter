"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var converter_class_1 = require("./gabc/converter.class");
var converter_class_2 = require("./mei/converter.class");
var fs = require('fs');
var path = require('path');
var getArguments = function () {
    var args = process.argv.slice(2);
    return args.reduce(function (outputObj, next) {
        var splitted = next.split("=");
        var returnObj = __assign({}, outputObj);
        returnObj[splitted[0]] = splitted[1];
        return returnObj;
    }, {});
};
var splitFileNameFromPath = function (filePaths, filenameRegex) {
    return filePaths.filter(function (path) { return path.match(filenameRegex); })
        .map(function (path) {
        var folders = path.split("/");
        var filename = folders.pop();
        return { folders: folders.join("/"), filename: filename };
    });
};
var convertFolder = function (inputFolder, outputFolder, type, filenameRegex) {
    if (filenameRegex === void 0) { filenameRegex = /data\.json$/; }
    var files = splitFileNameFromPath(getFiles(inputFolder), filenameRegex);
    console.log(files);
    files.forEach(function (file) {
        var folders = file.folders;
        var outPath = path.join(outputFolder, folders);
        var inFile = path.join(inputFolder, file.folders, file.filename);
        if (!fs.existsSync(outPath)) {
            fs.mkdirSync(outPath, { recursive: true });
        }
        convertFile(inFile, outPath, type);
    });
};
var convertFile = function (filePath, outputFolder, type) {
    console.log("Convert File");
    if (type === "GABC") {
        transformFile(filePath, outputFolder, new converter_class_1["default"]());
    }
    else if (type === 'MEI') {
        transformFile(filePath, outputFolder, new converter_class_2["default"]());
    }
};
var transformFile = function (inputFilePath, outputFolder, transformer) {
    fs.readFile(inputFilePath, "utf-8", function (error, text) {
        if (!error) {
            var dataOut = transformer.transformWrite(text);
            if (!dataOut) {
                console.log("Error: data undefined");
                return false;
            }
            var outputFile = inputFilePath.replace(/.*\/(.*?)\.json/, "$1" + transformer.file_extension);
            fs.writeFile(outputFolder + "/" + outputFile, dataOut, function (error) {
                if (error) {
                    console.error("Error: Couldn't write file", error);
                    return false;
                }
            });
        }
        else {
            console.error("Node FS Error. Couldn't read file.");
            return false;
        }
    });
};
var getFiles = function (root, files, prefix) {
    if (files === void 0) { files = []; }
    if (prefix === void 0) { prefix = ''; }
    prefix = prefix || '';
    files = files || [];
    var dir = path.join(root, prefix);
    if (!fs.existsSync(dir))
        return files;
    if (fs.statSync(dir).isDirectory())
        fs.readdirSync(dir)
            .forEach(function (name) {
            getFiles(root, files, path.join(prefix, name));
        });
    else
        files.push(prefix);
    return files;
};
var args = getArguments();
if ("type" in args && "i" in args && "o" in args) {
    if (args['type'] === 'GABC') {
        console.log("Converting to GABC");
        convertFolder(args['i'], args['o'], 'GABC');
    }
    else if (args['type'] === 'MEI') {
        convertFolder(args['i'], args['o'], 'MEI');
    }
    else {
        console.error("You gave no valid Type");
    }
}
else {
    console.error("You have to provide arguments 'i', 'o' and 'type");
}
//# sourceMappingURL=convert.js.map