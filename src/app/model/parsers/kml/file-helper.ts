export class FileHelper {
    static readAsText(file: Blob): Promise<string> {
        return file.text();
    }

    static parseString(content: string): Document {
        const parser = new DOMParser();
        return parser.parseFromString(content, 'text/xml');
    }
}
