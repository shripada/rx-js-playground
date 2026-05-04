import { BehaviorSubject } from './behavior-subject.js';
import { of } from './creational-operators.js';
import type { Observer } from './observable.js';

const aSubject$ = new BehaviorSubject<number>();
aSubject$.next(10); // 0 observers

const obs1: Observer<number> = {
  next(value) {
    console.log('Obs1 received: ', value);
  },
};

const obs2: Observer<number> = {
  next(value) {
    console.log('Obs2 received: ', value);
  },
};

aSubject$.subscribe(obs1);
const obs2Subscription = aSubject$.subscribe(obs2);

aSubject$.next(1); // 2 observers
// obs2Subscription.unsubscribe();

aSubject$.next(2);

of(1, 2, 3, 4, 5, 6).subscribe(aSubject$);

aSubject$.subscribe({
  next(value) {
    console.log(value); // 6
  },
});
