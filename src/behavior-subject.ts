import { of } from './creational-operators.js';
import type { Observer, Subscription } from './observable.js';
import { Subject } from './subject.js';

export class BehaviorSubject<T> extends Subject<T> {
  currentValue: T;

  override subscribe(observer: Observer<T>): Subscription {
    if (this.currentValue) {
      observer.next(this.currentValue);
    }

    return super.subscribe(observer);
  }

  override next(value: T) {
    this.currentValue = value;
    super.next(value);
  }

  constructor(initialValue: T) {
    super();
    this.currentValue = initialValue;
  }
}
