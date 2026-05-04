import { of } from './creational-operators.js';
import { Observable, type Observer, type Subscription } from './observable.js';

export class Subject<T> extends Observable<T> implements Observer<T> {
  private observers: Observer<T>[] = [];

  override subscribe(observer: Observer<T>): Subscription {
    if (!this.observers.find((value) => value === observer)) {
      this.observers.push(observer);
    }

    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((ob) => ob !== observer);
      },
    };
  }

  // Observer part
  next(value: T) {
    // broadcast this value to all your observers
    this.observers.forEach((ob) => ob.next(value));
  }

  // TODO: implement error and complete methods as well.
}
