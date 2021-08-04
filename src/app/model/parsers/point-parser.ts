import { NamedEarthPoint } from './named-earth-point';

export abstract class PointParser {
    // protected abstract get pointExpression(): RegExp;
    abstract createPoint(line: string): NamedEarthPoint;
    abstract get formatSample(): string;
}

