import { Point } from './point';
import { PointParser } from './point-parser';


export class ManualPointParser extends PointParser {
  createPoint(line: string): Point | null {
    const tokens = line.split('|||');

    const mandatoryTokens = /^(\-?\d+(?:,|\.)\d+)\s+(\-?\d+(?:,|\.)\d+)\s+(.+)$/.exec(tokens[0]);
    if (!mandatoryTokens) {
      return null;
    }
    const result = new Point(parseFloat(mandatoryTokens[2].replace(',', '.')), parseFloat(mandatoryTokens[1].replace(',', '.')),
      mandatoryTokens[3]);

    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (/^#[A-Fa-f0-9]{3,6}$/.test(token)) {
        result.color = token.slice(1, token.length);
      } else {
        result.description = token;
      }
    }
    return result;
  }
  get formatSample(): string {
    return '55.87719 38.78353 Soviet str.';
  }
}
