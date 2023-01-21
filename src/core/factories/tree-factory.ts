import { Positionable, PositionableConfig, SpriteLayer } from "../entities/positionable";
import { Game } from "../game";
import { Area } from "../types/area";
import { generateCoordinates } from "../utils/generate-coordinates";
import { getMaxObjectsInArea } from "../utils/max-objects-in-area";
import { randomItem } from "../utils/random-item";
import { range } from "../utils/range";

export class TreeFactory {
    static roots: number[] = [1, 2, 3, 4];
    static middle: number[] = [5, 6, 7, 8, 9, 10];
    static top: number[] = [11, 12, 13, 14];

    static treeAreaWidth = 30
    static treeAreaHeight = 10;

    static factory(game: Game, treeSize: number, config: Pick<PositionableConfig, 'x'|'y'>): Positionable {
        const src = '/assets/sprites/tree_1.png';
        const layers: SpriteLayer[] = [];

        // put root layer
        layers.push({ src, z: 0, at: [randomItem(TreeFactory.roots), 1] });

        // put middle layers
        let lastZ = 0;
        const numberOfMiddleSprites = Math.max(treeSize, 3) - 2;
        for (let z of range(1, numberOfMiddleSprites)) {
            layers.push({ src, z, at: [randomItem(TreeFactory.middle), 1] });
            lastZ = z;
        }

        // put top layer
        layers.push({ src, z: lastZ + 1, at: [randomItem(TreeFactory.top), 1] });

        const tree = new Positionable(game, {
            ...config,
            layers,
            animations: { stand: [1] },
            areaWidth: TreeFactory.treeAreaWidth,
            areaHeight: TreeFactory.treeAreaHeight,
            frameWidth: 32,
            frameHeight: 16,
            frameOffsetX: -2,
            frameOffsetY: -6,
            solid: true
        });

        return tree;
    }

    static multiFactory(game: Game, area: Area, minSize = 4, maxSize = 8): Positionable[] {
        const height = TreeFactory.treeAreaHeight;
        const width = TreeFactory.treeAreaWidth;

        const numOfCoordinates = getMaxObjectsInArea(area, { height, width }, 10)
        const coordinates = generateCoordinates(numOfCoordinates, area, 15);
        const treeMap = coordinates.map(({ x, y }) => [randomItem(range(minSize, maxSize)), x, y]);
        return treeMap.map(([treeSize, x, y]) => TreeFactory.factory(game, treeSize, { x, y }));
    }
}
