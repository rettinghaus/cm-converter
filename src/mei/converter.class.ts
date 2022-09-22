import {Converter} from "../generic/converter.class";
import {Helper} from "../generic/helper";

export default class MEI implements Converter {
    constructor() {
    }

    data: string;
    helper = new Helper;
    file_extension = ".mei";

    createHeader() {
        return `<?xml version="1.0" encoding="UTF-8"?><mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="4.0.0"><meiHead><fileDesc><titleStmt><title>MEI Encoding Output</title></titleStmt><pubStmt/></fileDesc></meiHead><music><body><mdiv><score><scoreDef><staffGrp>
        <staffDef n="1" lines="4" notationtype="neume" clef.line="1" clef.shape="C"/></staffGrp></scoreDef><section><staff><layer>`;
    }

    createFooter() {
        return "</layer></staff></section></score></mdiv></body></music></mei>";
    }

    transformNote(noteComponents: any) {

        if (noteComponents.grouped.length === 1) {
            return `<nc pname="${noteComponents.grouped[0].base.toLowerCase()}" oct="${noteComponents.grouped[0].octave - 1}"/>`
        } else {
            return noteComponents.grouped.map((nc: any, i: number, ncs: any) => i >= ncs.length - 1 ?
                `<nc pname="${nc.base.toLowerCase()}" oct="${nc.octave-1} "/>` :
                `<nc pname="${nc.base.toLowerCase()}" oct="${nc.octave-1}" ligated="true"/>`).join("");
        }
    }

    transformNeumes(notes: any) {
        return notes.spaced.map((neume: any) => {
            const neumeContent = neume.nonSpaced.map((noteComponents: any) => {
                return this.transformNote(noteComponents);
            }).join("");
            return `<neume>${neumeContent}</neume>`;
        })
    }

    transformSyllable(syl: any) {
        const neumes = this.transformNeumes(syl.notes).join("")
        const createSyllableString = (text: string, neumes: string) => {
            return `<syllable><syl>${text}</syl>${neumes}</syllable>`;
        }
        return createSyllableString(syl.text, neumes);
    }

    transformRead() {

    }

    transformWrite(data: string) {
        console.log('Transformation...')
        this.data = JSON.parse(data)
        console.log("Data length: ", JSON.stringify(this.data).length)

        // @ts-ignore
        const lines = this.helper.getFlatStaffs(this.data['children']);
        const musicContent = lines.reduce((out: any, lineContent: any) => {
            if (lineContent['kind'] === "ParatextContainer") return "";
            return [out, lineContent['children'].reduce((out2: any, syl: any) => {
                return [out2, this.transformSyllable(syl)].join("")
            }, "")].join("");
        }, "")
        try {
            return [
                this.createHeader(),
                musicContent,
                this.createFooter()
            ].join("");
        } catch (e) {
            console.log(e);
        }
        return "";
    }
}