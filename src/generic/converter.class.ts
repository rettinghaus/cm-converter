
export interface Converter {
    data: any;
    createHeader: Function;
    transformNote: Function;
    transformSyllable: Function;
    transformWrite: Function;
    transformRead: Function;
}