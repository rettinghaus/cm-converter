"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
require("mocha");
var helper_1 = require("./helper");
describe("Helper Functions", function () {
    var helper = new helper_1.Helper;
    describe('getFlatStaffs', function () {
        it('should flat with 1 level', function () {
            var example = {
                "kind": "RootContainer",
                "uuid": "b9c3268a-e987-472e-9f96-aee2f696b31c",
                "children": [
                    {
                        "uuid": "5c4fd9b3-3299-4e9f-846d-26945e54a9bf",
                        "kind": "FormteilContainer",
                        "children": [{
                                "uuid": "112eef3a-f25a-44ec-a116-00cd75020c22",
                                "kind": "ZeileContainer",
                                "children": [
                                    {}
                                ]
                            }]
                    },
                    {
                        "uuid": "5c4fd9b3-3299-4e9f-846d-26945e54a9bf",
                        "kind": "FormteilContainer",
                        "children": [{
                                "uuid": "112eef3a-f25a-44ec-a116-00cd75020c22",
                                "kind": "ZeileContainer",
                                "children": [
                                    {}
                                ]
                            }]
                    }
                ]
            };
            var result = [{
                    "uuid": "112eef3a-f25a-44ec-a116-00cd75020c22",
                    "kind": "ZeileContainer",
                    "children": [
                        {}
                    ]
                },
                {
                    "uuid": "112eef3a-f25a-44ec-a116-00cd75020c22",
                    "kind": "ZeileContainer",
                    "children": [
                        {}
                    ]
                }];
            var output = helper.getFlatStaffs(example['children']);
            (0, chai_1.expect)(output).to.deep.equal(result);
        });
    });
});
//# sourceMappingURL=helper.test.js.map