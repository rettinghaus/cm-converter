import {expect, assert} from 'chai';
import "mocha";
import {Helper} from "./helper";


describe("Helper Functions", () => {
    const helper = new Helper;
    describe('getFlatStaffs', () => {
        it('should flat with 1 level', () => {
            const example = {
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
            const result = [{
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

            const output = helper.getFlatStaffs(example['children']);
            expect(output).to.deep.equal(result)
        })
    })
})