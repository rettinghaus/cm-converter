import {Converter} from "../generic/converter.class";
import {Helper} from "../generic/helper";

export default class MEI implements Converter {
    constructor() {
    }
    data: string;
    helper = new Helper;

    createHeader() {

    }

    transformNote() {

    }

    transformSyllable(syl: any) {

    }

    transformRead() {

    }

    transformWrite(data: string) {
        console.log('transform')
        this.data = JSON.parse(data)
        console.log("Data length: ", JSON.stringify(this.data).length)

        // @ts-ignore
        const lines = this.helper.getFlatStaffs(this.data['children']);
        const l = lines.reduce((out: any, lineContent: any) => {
            if (lineContent['kind'] === "ParatextContainer") return "";
            return [...out, lineContent['children'].reduce((out2: any, syl: any) => {
                return [...out2, this.transformSyllable(syl)]
            }, [])];
        }, [])
        try {
            console.log(l);
            return l;
        } catch (e) {
            console.log(e);
        }
        return "";
    }
}