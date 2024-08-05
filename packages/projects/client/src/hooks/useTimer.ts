class Timer {
    private start!: Date;
    private timerId!: number;
    private remaining!: number;
    private callback!: () => void;

    public pause() {
        window.clearTimeout(this.timerId);
        this.remaining -= new Date().getTime() - this.start.getTime();
    }

    public resume(callback: () => void, delay: number) {
        console.log('remaining', this);
        console.log('start', this.start);
        this.remaining = delay;
        this.start = new Date();
        this.timerId = window.setTimeout(() => {
            this.remaining = delay;
            this.resume(callback, delay);
            this.callback();
        }, delay);
    }

    public reset(delay: number) {
        this.remaining = delay;
    }
}

export default function useTimer() {
    return new Timer();
}