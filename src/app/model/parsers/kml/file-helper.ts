import { parseStringPromise } from "xml2js";

export class FileHelper {
    static readAsText(file: Blob): Promise<string> {
        return file.text();
    }

    static parseString(content: string) {
        return parseStringPromise(content);
    }
}
