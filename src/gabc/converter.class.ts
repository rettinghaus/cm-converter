import * as fs from 'fs';
import {Helper} from "../generic/helper";
import {gregorio_alphabet, monodi_alphabet} from "../generic/conversionData";
import {Converter} from "../generic/converter.class";

/**
 * finds best clef position (not used yet)
 */
const find_other_clef = (clef_position: number, position_of_ps: number,
                         octave: number, monodi_alphabet: string, gregorio_alphabet: string) => {
    const other_clefs = [1, 2, 3, 4].filter((d) => d !== clef_position);
    const other_positions = other_clefs.map((d) => {
        return getPositionInGABCAlphabet(position_of_ps, octave, monodi_alphabet, d);
    });
    const position_ratings = other_positions.map(d => Math.abs(d - (gregorio_alphabet.length / 2)));
    const best_clef = other_clefs[position_ratings.indexOf(Math.min(...position_ratings))];
    const position_in_greg_bc = getPositionInGABCAlphabet(position_of_ps, octave, monodi_alphabet, best_clef);
    return {clef_change: true, clef: best_clef, char: gregorio_alphabet[position_in_greg_bc]};
}

/**
 * Converts the index of a pitch in input_alphabet to the appropriate GABC index.
 * @param position_input_alphabet: Index of pitch in input_alphabet ## Maybe just the pitch and convert it within this function?
 * @param octave: The (midi) octave (3 - 5)
 * @param input_alphabet
 * @param clef_position
 */
const getPositionInGABCAlphabet =
    (position_input_alphabet: number, octave: number,
     input_alphabet: string, clef_position: number) =>
        position_input_alphabet + ((octave - 4) * input_alphabet.length) - ((clef_position - 1) * 2) + 2;


export default class GABC implements Converter {
    private _data: any = "";
    hasHeader = false;
    currentClef = 2;
    helper = new Helper;

    constructor() {
    }

    /**
     * Creates Header (not used yet)
     */
    createHeader(name: string, gabcCopyright: string = "",
                  scoreCopyright: string = "",
                  officePart: string = "",
                  occasion: string = "",
                  meter: string = "",
                  commentary: string = "",
                  arranger: string = "",
                  author: string = "",
                  date: string = "",
                  manuscript: string = "",
                  manuscriptReference: string = "",
                  manuscriptStoragePlace: string = "",
                  book: string = "",
                  language: string = "",
                  transcriber: string = "",
                  transcriptionDate: string = "",
                  mode: string = "",
                  userNotes: string = "",
                  annotation: string = ""
    ) {
        if (this.hasHeader) {
            console.warn("Warning: Doc already has a header.")
            return false;
        }
        const header = [
            "name: ", name, "\n",
            "gabc-copyright: ", gabcCopyright, "\n",
            "score-copyright: ", scoreCopyright, "\n",
            "office-part: ", officePart, "\n",
            "occasion: ", occasion, "\n",
            "meter: ", meter, "\n",
            "commentary: ", commentary, "\n",
            "arranger: ", arranger, "\n",
            "author: ", author, "\n",
            "date: ", date, "\n",
            "manuscript: ", manuscript, "\n",
            "manuscript-reference: ", manuscriptReference, "\n",
            "manuscript-storage-place: ", manuscriptStoragePlace, "\n",
            "book: ", book, "\n",
            "language: ", language, "\n",
            "transcriber: ", transcriber, "\n",
            "transcription-date: ", transcriptionDate, "\n",
            "mode: ", mode, "\n",
            "user-notes: ", userNotes, "\n",
            "annotation: ", annotation, "\n",
            "\n"
        ].join("");
        this._data = [header, this._data].join("");
        return true;
    }


    /**
     * Gets gabc symbol from pitch/octave combination + clef offset.
     * clef position from top line 1 - 4
     */
    transformNote(pitch_symbol: string, octave: number, clef_position: number = this.currentClef) {
        const position_of_ps = monodi_alphabet.indexOf(pitch_symbol);
        const position_in_greg = getPositionInGABCAlphabet(position_of_ps, octave, monodi_alphabet, clef_position);
        /*if (position_in_greg < 0 || position_in_greg >= gregorio_alphabet.length) {
            return this.find_other_clef(clef_position, position_of_ps, octave, monodi_alphabet, gregorio_alphabet);
        } else {*/
        return {clef_change: false, clef: clef_position, char: gregorio_alphabet[position_in_greg]};
        /*}*/
    }


    /**
     * Transforms Syllable Object into gabc string.
     */
    transformSyllable(syllable: any) {
        let text, wordWhitespace;
        if (!('text' in syllable) || syllable.kind === "FolioChange") {
            return "";
        } else {
            text = this.helper.cleanSyllable(syllable['text']);
            wordWhitespace = syllable['text'].match("-") ? "" : " ";
        }

        const notation = syllable?.notes?.spaced.map((spaced: any) => {
            return ["/", ...spaced?.nonSpaced?.map((nonspaced: any) => {
                return ["!", ...nonspaced?.grouped?.map((grouped: any) => {
                    return this.transformNote(grouped?.base.toLowerCase(), grouped?.octave)
                })]
            })]
        });
        const notes = notation?.flat(3)?.map((d: any) => d.char || "/" || "!");
        const clef = notation?.flat(3)?.map((d: any) => d.clef || "/" || "!");


        //console.log(text, clef, notes);
        const noteSequence = notes?.join("").replace(/^\/\//, "")
        return `${text}(${noteSequence})${wordWhitespace}`;
    }


    // @ts-ignore
    get data() {
        return this._data
    }

    /**
     * Transforms the whole document.
     */
    transformWrite(data: string): string {
        console.log('transform')
        this._data = JSON.parse(data)
        console.log("Data length: ", JSON.stringify(this._data).length)

        const lines = this.helper.getFlatStaffs(this._data['children']);
        const l = lines.reduce((out: any, lineContent: any) => {
            if (lineContent['kind'] === "ParatextContainer") return "";
            return [...out, lineContent['children'].reduce((out2: any, syl: any) => {
                return [...out2, this.transformSyllable(syl)]
            }, [])];
        }, [])
        const clefPref = `(c3)\n`;
        try {
            return [clefPref, l?.flat()?.join("")].join("");
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * In the future: GABC Reader
     */
    transformRead(data: string): string {
        return data;
    }


}