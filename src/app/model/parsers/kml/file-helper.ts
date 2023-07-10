import { parseStringPromise } from "xml2js";

export class FileHelper {
    static readAsText(file: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', e => resolve(e.target?.result as string));
            reader.addEventListener('error', () => reject())
            reader.readAsText(file);
        });
    }

    static readAsBinary(file: Blob): Promise<string | ArrayBuffer | null | undefined> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', e => resolve(e.target?.result));
            reader.addEventListener('error', () => reject())
            reader.readAsBinaryString(file);
        });
    }

    static async parseXml(file: Blob) {
        const content = await this.readAsText(file);
        return parseStringPromise(content);
    }
}
