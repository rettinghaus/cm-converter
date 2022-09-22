"use strict";
exports.__esModule = true;
exports.Helper = void 0;
var Helper = (function () {
    function Helper() {
        this.cleanSyllable = function (text) {
            return text.replace("-", "").replace(" ", "");
        };
        this.existsZeileContainer = function (d) { return d
            .map(function (e) { return e['kind'] === "ZeileContainer"; })
            .filter(function (e) { return e; }).length !== 0; };
    }
    Helper.prototype.flatStaffRecur = function (d) {
        var _this = this;
        if (!d)
            return [];
        if (this.existsZeileContainer(d)) {
            return d;
        }
        else {
            return d.reduce(function (p, c) {
                p.push.apply(p, _this.flatStaffRecur(c['children']));
                return p;
            }, []);
        }
    };
    Helper.prototype.getFlatStaffs = function (data) {
        return this.flatStaffRecur(data);
    };
    return Helper;
}());
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map