import { FolderType } from "./folder-type.enum";
import { Point } from "./point";

export class Folder {
    constructor() {
        this.points = [];
        this.type = FolderType.Points;
    }

    type: FolderType;
    name: string | undefined;
    points: Point[];
    color: string | undefined;
}
