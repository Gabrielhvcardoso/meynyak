import lettersMapping from './data/letters.json';

type LetterMap = number[][];

export class TextDrawer {
    private static letters = lettersMapping as unknown as Record<string, LetterMap>;

    static drawText(text: string,
                    ctx: CanvasRenderingContext2D,
                    x: number,
                    y: number,
                    color: string = 'black',
                    letterSpacing: number = 1): void {

        const letterArray = text.split('');
        letterArray.forEach((letter, lidx, letters) => {
            const leftPadding = x + letters.slice(0, lidx).reduce((acc, cur) => {
                return acc + this.letters[cur][0].length + letterSpacing;
            }, 0)

            this.drawCharacter(letter, ctx, leftPadding, y, color);
        });
    }

    static drawCharacter(letter: string|number,
                         ctx: CanvasRenderingContext2D,
                         x: number,
                         y: number,
                         color: string = 'black'): void {

        const letterMap = this.letters[letter];
        letterMap.forEach((row, ly) => {
            row.forEach((shouldDraw, lx) => {
                if (shouldDraw) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x + lx, y + ly, 1, 1);
                }
            });
        });
    }
}
