import {Converter} from "../generic/converter.class";

export default class MEI implements Converter {
    constructor() {
    }

    data: string;

    createHeader() {

    }

    transformNote() {

    }

    transformSyllable() {

    }

    transformRead() {

    }

    transformWrite(filePath: string, outputFolder: string) {
        return "";
    }
}