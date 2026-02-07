export class XmlHelper {
    static getSafeString(value: string | undefined): string | undefined {
        if (!value) {
            return value;
        }
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll('\'', '&apos;');
    }
}
