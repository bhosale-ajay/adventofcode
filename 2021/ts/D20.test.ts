import { getLines } from './util';

const DARK: Pixel = 0;
const LIGHT: Pixel = 1;
type Pixel = 0 | 1;
type Pixels = Record<string, Pixel>;
type Image = [pixels: Pixels, lowerBound: number, upperBound: number];

const lineToPixelArray = (l: string): Pixel[] =>
    l.split('').map(c => (c === '#' ? LIGHT : DARK));

const dataToImage = (data: string): Image => {
    const pixels: Pixels = {};
    const pixelData = data.split('\n').map(lineToPixelArray);
    for (let ri = 0; ri < pixelData.length; ri++) {
        for (let ci = 0; ci < pixelData[ri].length; ci++) {
            pixels[`${ri}:${ci}`] = pixelData[ri][ci];
        }
    }
    return [pixels, 0, pixelData.length - 1];
};

const parse = (fn: string): [Image, Pixel[]] => {
    const [algo, imageData] = getLines(fn, '\n\n');
    return [dataToImage(imageData), lineToPixelArray(algo)];
};

const getSection = (r: number, c: number) => {
    return [
        [r - 1, c - 1], // Top Left
        [r - 1, c + 0], // Top
        [r - 1, c + 1], // Top Right
        [r + 0, c - 1], // Left
        [r + 0, c + 0], // Self
        [r + 0, c + 1], // Right
        [r + 1, c - 1], // Bottom Left
        [r + 1, c + 0], // Bottom
        [r + 1, c + 1], // Bottom Right
    ];
};

const enhance = (
    [pixels, lb, ub]: Image,
    algo: Pixel[],
    border: Pixel
): Image => {
    const updatedPixels: Record<string, Pixel> = {};
    const getPixel = ([r, c]: number[]) => {
        return pixels[`${r}:${c}`] === undefined ? border : pixels[`${r}:${c}`];
    };
    for (let ri = lb - 1; ri <= ub + 1; ri++) {
        for (let ci = lb - 1; ci <= ub + 1; ci++) {
            const binary = getSection(ri, ci).map(getPixel).join('');
            const decimal = parseInt(binary, 2);
            const pixel = algo[decimal];
            updatedPixels[`${ri}:${ci}`] = pixel;
        }
    }
    return [updatedPixels, lb - 1, ub + 1];
};

const countLitPixels = ([pixels, lb, ub]: Image): number => {
    let count = 0;
    for (let ri = lb; ri <= ub; ri++) {
        for (let ci = lb; ci <= ub; ci++) {
            count = count + (pixels[`${ri}:${ci}`] === LIGHT ? 1 : 0);
        }
    }
    return count;
};

const solve = (fn: string) => {
    const [baseImage, algo] = parse(fn);
    const toggle = algo[0] === 1;
    let image = baseImage;
    let at2 = 0;
    for (let iteration = 1; iteration <= 50; iteration++) {
        image = enhance(
            image,
            algo,
            toggle ? (iteration % 2 === 0 ? LIGHT : DARK) : DARK
        );
        if (iteration === 2) {
            at2 = countLitPixels(image);
        }
    }
    return [at2, countLitPixels(image)];
};

test('20', () => {
    expect(solve('20-test')).toEqual([35, 3351]);
    expect(solve('20')).toEqual([5486, 20210]);
});
