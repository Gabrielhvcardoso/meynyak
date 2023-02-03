
import { Game } from "./game";
import { Level } from "./level";

export class LevelClock {
    dayMinutes;
    dayMinuteStep;
    readonly dayMinuteSteps = 1000 / (1000/Game.gameFPS);

    constructor(public timeFreeze = false, startMinute = 0) {
        this.dayMinutes = startMinute;
        this.dayMinuteStep = 0;
    }

    public update(): void {
        if (!this.timeFreeze) {
            this.timeTick();
        }
    }

    public get hour(): number {
        return Math.floor(this.dayMinutes / 60);
    }

    public get hourMinutes(): number {
        return this.dayMinutes - (this.hour * 60);
    }

    private timeTick(): void {
        this.dayMinuteStep += 1;

        if (this.dayMinuteStep === this.dayMinuteSteps) {
            this.dayMinuteStep = 0;
            this.dayMinutes += 1;
        }

        if (this.dayMinutes === 1440) {
            this.dayMinutes = 0;
        }
    }
    
}