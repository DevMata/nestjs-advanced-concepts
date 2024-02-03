import { IntervalHost } from '../scheduler/decorator/interval-host.decorator';
import { Interval } from '../scheduler/decorator/interval.decorator';

@IntervalHost
export class CronService {
  @Interval(1000)
  everySecond() {
    console.log('This will be logged every second 🐈');
  }
}
