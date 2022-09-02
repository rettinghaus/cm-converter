/**
 * Helper Class - various utility functions
 */
export class Helper {
    constructor() {
    }

    cleanSyllable = (text: string) =>
        text.replace("-", "").replace(" ", "")


    existsZeileContainer = (d: any) => d
        .map((e: any) => e['kind'] === "ZeileContainer")
        .filter((e: boolean) => e).length !== 0;

    /**
     * Flattening structure to staff object recursively
     */
    flatStaffRecur(d: any): any {
        if (!d) return []
        if (this.existsZeileContainer(d)) {
            return d;
        } else {
            return d.reduce((p: any, c: any) => {
                p.push(...this.flatStaffRecur(c['children']));
                return p;
            }, [])
        }
    }

    /**
     * Gets staff object without structure
     */
    getFlatStaffs(data: any) {
        return this.flatStaffRecur(data);
    }
}