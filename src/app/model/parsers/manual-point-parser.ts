import { Point } from './point';
import { PointParser } from './point-parser';


export class ManualPointParser extends PointParser {
  private static _colors: { [key: string]: string } = {
    'red': 'e65100',
    'black': '000000',
    'yellow': 'ffd600',
    'gray': 'bdbdbd',
    'green': '097138',
    'brown': '795548',
    'magenta': '9c27b0',
    'violet': '673ab7'
  };

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
      if (/^#[A-Za-z0-9]+$/.test(token)) {
        const color = token.slice(1, token.length);
        result.color = ManualPointParser._colors[color] || color;
      } else {
        result.description = token;
      }
    }
    this.useDescription(result);
    this.setColorIfEmpty(result, '0288D1');
    return result;
  }

  useDescription(point: Point) {
    if (!point.description) {
      return;
    }
    switch (point.description) {
      case 'Жанровая скульптура':
      case 'Памятник, мемориал':
        point.icon = 'special_poi_statue_of_liberty';
        break;
      case 'Парк культуры':
        point.icon = 'wood';
        break;
      case 'Культурный центр':
      case 'Театр':
      case 'Кинотеатр':
      case 'Выставочный центр':
        point.icon = 'tourism_museum';
        break;
      case 'Водопад':
        point.icon = 'waterfall';
        break;
      case 'Фонтан':
        point.icon = 'amenity_fountain';
        break;
      case 'Граффити':
        point.icon = 'tourism_work';
        break;
      case 'Рынок':
        point.icon = 'shop_food';
        break;
      case 'Супермаркет':
        point.icon = 'shop_supermarket';
        this.setColorIfEmpty(point, '000000');
        break;
      case 'Пляж':
        point.icon = 'beach';
        break;
    }
  }

  setColorIfEmpty(point: Point, color: string) {
    if (!point.color) {
      point.color = color;
    }
  }

  get formatSample(): string {
    return `55.87719 38.78353 Soviet str. Colors: ${Object.keys(ManualPointParser._colors).join(', ')}.`;
  }
}
