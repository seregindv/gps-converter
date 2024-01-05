export class XmlHelper {
    static getSafeString(value: string | undefined): string | undefined {
        if (!value) {
            return value;
        }
        return value
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace('\'', '&apos;');
    }
}
