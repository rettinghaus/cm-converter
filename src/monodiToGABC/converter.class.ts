import * as fs from 'fs';
import {Helper} from "../generic/helper";

export default class JsonToGabcConverter {
    private _data: any = "";
    dataOut: string;
    hasHeader = false;
    currentClef = 2;
    gregorio_alphabet = "abcdefghijklm";
    monodi_alphabet = "cdefgab";
    helper = new Helper;
    
    getPositionInAlphabet(position_input_alphabet: number, octave: number,
                       input_alphabet: string, clef_position: number) {
        return position_input_alphabet +
            ((octave - 4) * input_alphabet.length) - ((clef_position - 1) * 2) + 2;
    }

    constructor() {
    }

    /**
     * Creates Header (not used yet)
     */
    create_header(name: string, gabcCopyright: string = "",
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
     * finds best clef position (not used yet)
     */
    find_other_clef(clef_position: number, position_of_ps: number,
                    octave: number, monodi_alphabet: string, gregorio_alphabet: string) {
        const other_clefs = [1, 2, 3, 4].filter((d) => d !== clef_position);
        const other_positions = other_clefs.map((d) => {
            return this.getPositionInAlphabet(position_of_ps, octave, monodi_alphabet, d);
        });

        const position_ratings = other_positions.map(d => Math.abs(d - (gregorio_alphabet.length / 2)));
        const best_clef = other_clefs[position_ratings.indexOf(Math.min(...position_ratings))];
        ////console.log("Best clef: ", best_clef)
        const position_in_greg_bc = this.getPositionInAlphabet(position_of_ps, octave, monodi_alphabet, best_clef);
        ////console.log("Position in greg: ", position_in_greg_bc);
        return {clef_change: true, clef: best_clef, char: gregorio_alphabet[position_in_greg_bc]};
    }

    /**
     * Gets gabc symbol from pitch/octave combination + clef offset.
     * clef position from top line 1 - 4
     */
    transform_note(pitch_symbol: string, octave: number, clef_position: number = this.currentClef) {



        const position_of_ps = this.monodi_alphabet.indexOf(pitch_symbol);
        const position_in_greg = this.getPositionInAlphabet(position_of_ps, octave, this.monodi_alphabet, clef_position);
        /*if (position_in_greg < 0 || position_in_greg >= gregorio_alphabet.length) {
            return this.find_other_clef(clef_position, position_of_ps, octave, monodi_alphabet, gregorio_alphabet);
        } else {*/
        return {clef_change: false, clef: clef_position, char: this.gregorio_alphabet[position_in_greg]};
        /*}*/
    }

    cleanSyllable = (text: string) => text.replace("-", "").replace(" ", "")

    /**
     * Transforms Syllable Object into gabc string.
     */
    transform_syllable(syllable: any) {
        let text, wordWhitespace;
        if (!('text' in syllable) || syllable.kind === "FolioChange") {
            return "";
        } else {
            text = this.cleanSyllable(syllable['text']);
            wordWhitespace = syllable['text'].match("-") ? "" : " ";
        }

        const notation = syllable?.notes?.spaced.map((spaced: any) => {
            return ["/", ...spaced?.nonSpaced?.map((nonspaced: any) => {
                return ["!", ...nonspaced?.grouped?.map((grouped: any) => {
                    return this.transform_note(grouped?.base.toLowerCase(), grouped?.octave)
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
    transform(data: string): string {
        console.log('transforms')
        this._data = JSON.parse(data)
        console.log("Data length: ", JSON.stringify(this._data).length)

        const lines = this.helper.getFlatStaffs(this._data['children']);
        const l = lines.reduce((out: any, lineContent: any) => {
            if (lineContent['kind'] === "ParatextContainer") return "";
            return [...out, lineContent['children'].reduce((out2: any, syl: any) => {
                return [...out2, this.transform_syllable(syl)]
            }, [])];
        }, [])
        const clefPref = `(c3)\n`;
        try {
            return [clefPref, l?.flat()?.join("")].join("");
        } catch (e) {
            console.log(e);
        }
    }




}