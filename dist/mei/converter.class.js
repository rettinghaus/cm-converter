"use strict";
exports.__esModule = true;
var helper_1 = require("../generic/helper");
var MEI = (function () {
    function MEI() {
        this.helper = new helper_1.Helper;
        this.file_extension = ".mei";
    }
    MEI.prototype.createHeader = function () {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><mei xmlns=\"http://www.music-encoding.org/ns/mei\" meiversion=\"4.0.0\"><meiHead><fileDesc><titleStmt><title>MEI Encoding Output</title></titleStmt><pubStmt/></fileDesc></meiHead><music><body><mdiv><score><scoreDef><staffGrp>\n        <staffDef n=\"1\" lines=\"4\" notationtype=\"neume\" clef.line=\"1\" clef.shape=\"C\"/></staffGrp></scoreDef><section><staff><layer>";
    };
    MEI.prototype.createFooter = function () {
        return "</layer></staff></section></score></mdiv></body></music></mei>";
    };
    MEI.prototype.transformNote = function (noteComponents) {
        if (noteComponents.grouped.length === 1) {
            return "<nc pname=\"".concat(noteComponents.grouped[0].base.toLowerCase(), "\" oct=\"").concat(noteComponents.grouped[0].octave - 1, "\"/>");
        }
        else {
            return noteComponents.grouped.map(function (nc, i, ncs) { return i >= ncs.length - 1 ?
                "<nc pname=\"".concat(nc.base.toLowerCase(), "\" oct=\"").concat(nc.octave - 1, " \"/>") :
                "<nc pname=\"".concat(nc.base.toLowerCase(), "\" oct=\"").concat(nc.octave - 1, "\" ligated=\"true\"/>"); }).join("");
        }
    };
    MEI.prototype.transformNeumes = function (notes) {
        var _this = this;
        return notes.spaced.map(function (neume) {
            var neumeContent = neume.nonSpaced.map(function (noteComponents) {
                return _this.transformNote(noteComponents);
            }).join("");
            return "<neume>".concat(neumeContent, "</neume>");
        });
    };
    MEI.prototype.transformSyllable = function (syl) {
        var neumes = this.transformNeumes(syl.notes).join("");
        var createSyllableString = function (text, neumes) {
            return "<syllable><syl>".concat(text, "</syl>").concat(neumes, "</syllable>");
        };
        return createSyllableString(syl.text, neumes);
    };
    MEI.prototype.transformRead = function () {
    };
    MEI.prototype.transformWrite = function (data) {
        var _this = this;
        console.log('Transformation...');
        this.data = JSON.parse(data);
        console.log("Data length: ", JSON.stringify(this.data).length);
        var lines = this.helper.getFlatStaffs(this.data['children']);
        var musicContent = lines.reduce(function (out, lineContent) {
            if (lineContent['kind'] === "ParatextContainer")
                return "";
            return [out, lineContent['children'].reduce(function (out2, syl) {
                    return [out2, _this.transformSyllable(syl)].join("");
                }, "")].join("");
        }, "");
        try {
            return [
                this.createHeader(),
                musicContent,
                this.createFooter()
            ].join("");
        }
        catch (e) {
            console.log(e);
        }
        return "";
    };
    return MEI;
}());
exports["default"] = MEI;
//# sourceMappingURL=converter.class.js.map