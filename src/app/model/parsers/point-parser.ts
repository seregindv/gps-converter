import { Point } from './point';

export abstract class PointParser {
    // protected abstract get pointExpression(): RegExp;
    abstract createPoint(line: string): Point | null;
    abstract get formatSample(): string;
}

