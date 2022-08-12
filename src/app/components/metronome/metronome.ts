function Metronome(callback: Function, interval: number) {
  this.interval = interval;

  this.startMetronome = () => {
    this.expectedTime = Date.now() + this.interval;
    callback();
    this.timeout = setTimeout(this.fixTime, this.interval);
  };

  this.stopMetronome = () => {
    clearTimeout(this.timeout);
  };

  this.fixTime = () => {
    let delay = Date.now() - this.expectedTime;
    callback();
    this.expectedTime += this.interval;
    this.timeout = setTimeout(this.fixTime, this.interval - delay);
  };
}
export default Metronome;
