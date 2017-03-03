namespace WF {
    export interface WaveOption {
        enabled: boolean,
        amplitude: number,
        frequency: number
    }
    export interface RadiusOption {
        begin: number,
        end: number
    }
    export interface TransformOption {
        resolution: number,
        radius: number | RadiusOption,
        wave?: WaveOption
    }
    export class HolderMaster {
        public holders: Holder[];
        private step: number;
        private animating: boolean;
        private autoTweening: boolean;
        public transformMe(me: Holder[], option: TransformOption): boolean {
            return this.transform(me, me, option);
        }
        public transform(from: Holder[], to: Holder[], option: TransformOption): boolean {
            option.wave = UTILS.def<WaveOption>(option.wave, {enabled: false, amplitude: 0, frequency: 0});
            if (typeof option.radius == 'number') {
                option.radius = {begin: option.radius, end: option.radius};
            }
            if (this.animating) {
                console.error('Cannnot call "HolderMaster.prototype.transform" while animating');
                return false;
            }
            let animatingHolders = false;
            from.forEach((holder) => {if (holder.animating) animatingHolders = true});
            to.forEach((holder) => {if (holder.animating) animatingHolders = true});
            if (animatingHolders) {
                console.error('Cannnot call "HolderMaster.prototype.transform" while Holder[] is animating');
                return false;
            }
            this.holders = to;
            this.step = 0;
            const worms: HoldableWorm[] = [];
            from.forEach((holder) => {
                holder.worms.forEach((worm) => {
                    worms.push(worm);
                });
                holder.worms = [];
            });
            // create init worms
            if (worms.length == 0) {
                to.forEach((holder) => {
                    holder.generate();
                });
                return true;
            }
            let lineCount = 0;
            to.forEach((holder) => lineCount += holder.figure.getLength());
            // create if need more worms
            if (worms.length < lineCount) {
                const prevWorms = worms.concat();
                const prevWormsLength = prevWorms.length;
                for (let i = prevWormsLength; i <= lineCount; i ++) {
                    const pw = prevWorms[Math.floor(Math.random() * prevWormsLength)];
                    const w = createWorm(pw.getLength(), pw.holder);
                    w.setRoute(pw.getCurrentLine());
                    worms.push(w);
                }
            }
            // shuffle
            UTILS.shuffle<HoldableWorm>(worms);
            UTILS.shuffle<Holder>(to);
            // generate route to figures
            to.forEach((holder) => {
                for (let i = 0; i < holder.figure.getLength(); i ++) {
                    const line = holder.figure.at(i);
                    const worm = worms.pop();
                    worm.setHolder(holder);
                    this.setRoute(worm, line, option);
                    holder.worms.push(worm);
                }
                holder.animating = true;
            });
            worms.forEach((worm) => {
                const holder = to[Math.floor(Math.random() * to.length)];
                const figure = holder.figure;
                const target = figure.at(Math.floor(Math.random() * figure.getLength()));
                worm.setHolder(holder);
                this.setRoute(worm, target, option);
                holder.worms.push(worm);
            });
            this.animating = true;
            return true;
        }
        private setRoute(worm: HoldableWorm, target: ROUTES.Line, option: TransformOption): void {
            target = target.clone();
            if (Math.random() < 0.5) worm.reverse();
            if (Math.random() < 0.5) target.reverse();
            const route = ROUTES.RouteGenerator.getMinimumRoute(
                worm.getHeadVecPos(),
                target.getHeadVecPos(),
                (<RadiusOption>option.radius).begin,
                (<RadiusOption>option.radius).end,
                option.resolution
            );
            if (option.wave.enabled) route.wave(option.wave.amplitude, option.wave.frequency);
            worm.setRoute(
                worm.getCurrentLine()
                    .pushLine(route)
                    .pushLine(target),
                target.getLength()
            );
        }
        public endMovement(): void {
            if (!this.animating) {
                console.error('Cannnot call "HolderMaster.prototype.endMovement" after completed animation');
                return;
            }
            this.holders.forEach((holder) => {
                if (this.step == 1) {
                    // completely complete
                    const removedWorms = holder.worms.splice(holder.figure.getLength());
                    // holder.setStepToAll(1);
                    holder.worms.forEach((worm) => worm.updateLength());
                    removedWorms.forEach((worm) => worm.dispose());
                    // console.log('completely complete!!');
                }else {
                    // force complete
                    holder.worms.forEach((worm) => worm.updateLength());
                    // console.log('force complete!!');
                }
                holder.animating = false;
            });
            this.autoTweening = false;
            this.animating = false;
            console.log('all worms:' + WF.FigureWorm.getWorms().length);
        }
        public autoTween(time: number, complete?: () => void): void {
            if (!this.animating) {
                console.error('Cannnot call "HolderMaster.prototype.autoTween" while not animating');
                return;
            }
            if (this.autoTweening) {
                console.error('Cannnot call "HolderMaster.prototype.autoTween" while autoTweening');
                return;
            }
            this.autoTweening = true;
            const props = {s: 0};
            // move worms
            new TWEEN.Tween(props)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .to({s: 1}, time)
            .onUpdate(() => {
                this.setStep(props.s);
            })
            .onComplete(() => {
                this.endMovement();
                if (complete) complete();
            })
            .start();
        }
        public setStep(step: number): void {
            if (!this.animating) {
                console.error('Cannnot call "HolderMaster.prototype.setStep" after completed animation');
                return;
            }
            this.step = step;
            this.holders.forEach((holder) => {
                if (!holder.animating) {
                    console.error('already ended');
                    return;
                }
                holder.setStepToAll(step);
            });
        }
    }
}