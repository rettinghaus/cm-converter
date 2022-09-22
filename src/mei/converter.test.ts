import {expect, assert} from 'chai';
import 'mocha';
import MEI from "./converter.class";

describe('MEI Model', () => {
    const doc = new MEI();
    describe("test whole document", () => {
        // @ts-ignore
        const input = {"kind":"RootContainer","uuid":"515d789e-2a98-41fa-83ce-ab1158064e64","children":[{"uuid":"02dc64f8-77fa-4ca0-90ef-7d25d64811cf","kind":"FormteilContainer","children":[{"uuid":"db3f67d7-31df-40f6-bddf-ea3adedabd70","kind":"ZeileContainer","children":[{"uuid":"b1f8fa1a-518b-4b5d-ae20-b71f7e2592cc","kind":"Syllable","text":"A-","syllableType":"Normal","notes":{"spaced":[{"nonSpaced":[{"grouped":[{"uuid":"c8758034-2c83-4ea2-a3bf-7842d08d5df4","base":"A","liquescent":false,"noteType":"Normal","octave":4,"focus":false},{"uuid":"3be915da-c63c-46b7-b9af-2ac9eb492b40","base":"B","liquescent":false,"noteType":"Normal","octave":4,"focus":false}]},{"grouped":[{"uuid":"8975e1f4-5874-4ca3-9644-f289465b49a5","base":"B","liquescent":false,"noteType":"Normal","octave":4,"focus":false}]}]}]}},{"uuid":"72106bc7-904b-4c1e-af19-776f2e9c7187","kind":"Syllable","text":"men","syllableType":"Normal","notes":{"spaced":[{"nonSpaced":[{"grouped":[{"uuid":"43ea6646-2785-41b2-b5af-3ccb6654279a","base":"G","octave":4,"noteType":"Normal","focus":false,"liquescent":false},{"uuid":"340e7fca-9ca4-407f-bd4d-be45c072235d","base":"A","octave":4,"noteType":"Normal","focus":false,"liquescent":false}]}]},{"nonSpaced":[{"grouped":[{"uuid":"84c612f1-c1c1-40c0-a93f-51cf7e63288b","base":"A","octave":4,"noteType":"Normal","focus":false,"liquescent":false}]},{"grouped":[{"uuid":"12971939-b62d-4807-91dd-4a962f7789ee","base":"G","octave":4,"noteType":"Normal","focus":false,"liquescent":false}]},{"grouped":[{"uuid":"9471e2d7-c1d9-45cc-aba8-378a929829e8","base":"F","octave":4,"noteType":"Normal","focus":true,"liquescent":false}]}]}]}}]}],"data":[{"name":"Signatur","data":""}]}],"comments":[],"documentType":"Level1"}
        //const expectedOutput = "(c3)\n" +
        //    "A(fg/g)men(ef//f/e/d) ";
        const expectedOutput = "<mei><meiHead></meiHead><music><body><syllable><syl>A</syl><neume><nc pname='f' oct='3'/><nc pname='g' oct='3'/><nc pname='g' oct='3' con='g'/></neume></syllable><syllable><syl>men</syl><neume><nc pname='e' oct='3'/><nc pname='f' oct='3'/></neume><neume><nc pname='f' oct='3' con='g'/><nc pname='e' oct='3' con='g'/><nc pname='d' oct='3' con='g'/></neume></syllable></body></music></mei>"
        it("should work with a small document", () => {
            const result = doc.transformWrite(JSON.stringify(input));
            expect(result).to.equal(expectedOutput);
        })

    })
});