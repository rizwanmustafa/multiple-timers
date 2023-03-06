export class ActualTimer {
  private totalDurationSeconds: number;
  private currentDurationSeconds: number;

  private startTime: Date | null;

  constructor(private readonly durationSeconds: number) {
    this.totalDurationSeconds = durationSeconds;
    this.currentDurationSeconds = this.totalDurationSeconds;
    this.startTime = null;
  }

  start() {
    // This functions works only if the timer is not running
    this.startTime = new Date();
  }

  pause() {
    if (this.startTime === null) return;

    this.currentDurationSeconds = Math.max(0, this.totalDurationSeconds - Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000));
    this.startTime = null;
  }

  reset() {
    this.currentDurationSeconds = this.totalDurationSeconds;
    this.startTime = null;
  }

  getDurationSeconds() {
    return this.totalDurationSeconds;
  }

  getElapsedSeconds() {
    if (this.startTime) {
      return Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
    }

    return 0;
  }

  getRemainingSeconds() {
    return Math.max(this.currentDurationSeconds - this.getElapsedSeconds(), 0);
  }

}

export function getTotalSeconds(hours: number, minutes: number, seconds: number): number {
  return hours * 3600 + minutes * 60 + seconds;
}

export default ActualTimer;