import { of } from './creational-operators.js';
import type { Observer, Subscription } from './observable.js';
import { Subject } from './subject.js';

export class BehaviorSubject<T> extends Subject<T> {
  mostRecentValue: T | null = null;

  override subscribe(observer: Observer<T>): Subscription {
    if (this.mostRecentValue) {
      observer.next(this.mostRecentValue);
    }

    return super.subscribe(observer);
  }

  override next(value: T) {
    this.mostRecentValue = value;
    super.next(value);
  }
}
