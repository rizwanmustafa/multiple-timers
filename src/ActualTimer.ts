export class ActualTimer {
  private totalDurationSeconds: number;
  private currentDurationSeconds: number;

  private startTime: Date | null;

  constructor(durationSeconds: number) {
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

    this.currentDurationSeconds = Math.max(0, this.totalDurationSeconds - this.getElapsedSeconds());
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

export function getHours(totalSeconds: number): number {
  return Math.floor(totalSeconds / 3600);
}

export function getMinutes(totalSeconds: number): number {
  return Math.floor((totalSeconds % 3600) / 60);
}

export function getSeconds(totalSeconds: number): number {

  return totalSeconds % 60;
}


export default ActualTimer;