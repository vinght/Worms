namespace WF {
    export class HoldableWorm extends WORMS.Base {
        public holder: WF.Holder;
        public prevHolder: WF.Holder;
        public holderMaster: WF.HolderMaster;
        constructor(length: number) {
            super(length);
        }
        public dispose(): void {
            this.holder = null;
            this.prevHolder = null;
            this.holderMaster = null;
        }
        public setHolder(holder: Holder, def: boolean = false): void {
            if (def) this.holder = holder;
            this.prevHolder = this.holder;
            this.holder = holder;
        }
    }
    export interface SimpleLightOption {
        fillColor?: number,
        thickness: number
    }
    export class FigureWorm extends HoldableWorm {
        public static graphics: PIXI.Graphics;
        private static worms: {[key: number]: FigureWorm} = {};
        private option: SimpleLightOption;
        private static _id: number = 0;
        public id: number;
        constructor(length: number, option: SimpleLightOption) {
            super(length);
            this.setOption(option);
            this.id = FigureWorm._id;
            FigureWorm.worms[this.id] = this;
            FigureWorm._id ++;
        }
        public static render(): void {
            this.graphics.clear();
            for (const id in this.worms) {
                const worm = this.worms[id];
                worm.render();
            }
        }
        public static getWorms(): FigureWorm[] {
            return Object.keys(this.worms).map((key) => this.worms[key]);
        }
        public setOption(option: SimpleLightOption): void {
            this.option = option;
            option.fillColor = UTILS.def<number>(option.fillColor, 0xff0000);
        }
        public getOption(): SimpleLightOption {
            return this.option;
        }
        public render() {
            this.renderWith(
                FigureWorm.graphics,
                this.option.fillColor,
                this.option.thickness,
                0, 0
            );
        }
        public dispose(): void {
            this.option = null;
            FigureWorm.worms[this.id] = null;
            delete FigureWorm.worms[this.id];
        }
        private renderWith(graphics: PIXI.Graphics, color: number, thickness: number, offsetX: number, offsetY: number): void {
            const bbone = this.bone.at(0);
            const ebone = this.bone.at(this.length - 1);
            graphics.beginFill(color);
            graphics.drawCircle(bbone.x + offsetX, bbone.y + offsetY, thickness / 2);
            graphics.endFill();
            graphics.lineStyle(thickness, color);
            graphics.moveTo(bbone.x + offsetX, bbone.y + offsetY);
            for (let i = 1; i < this.length  - 1; i ++) {
                const nbone = this.bone.at(i);
                graphics.lineTo(nbone.x + offsetX, nbone.y + offsetY);
            }
            graphics.lineTo(ebone.x + offsetX, ebone.y + offsetY);
            graphics.lineStyle();
            graphics.beginFill(color);
            graphics.drawCircle(ebone.x + offsetX, ebone.y + offsetY, thickness / 2);
            graphics.endFill();
        }
    }
    export function createWorm(length: number, holder: Holder): HoldableWorm {
        const worm = new FigureWorm(length, {thickness: 30});
        worm.setHolder(holder, true);
        holder.setStep(worm, 0);
        return worm;
    }
}