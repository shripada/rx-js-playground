import { interval, timer } from './creational-operators.js';

const interval$ = interval(1000); // all observables will have a $ suffix.

const intervalSubscription = interval$.subscribe({
  next(count) {
    console.log(count);
    // if (count === 5) {
    //   intervalSubscription.unsubscribe(); // after 5 secs, we want to stop the interval
    // }
  },
});

const timerSubscription = timer(5000).subscribe({
  next() {
    intervalSubscription.unsubscribe();
  },
});

// setTimeout(() => {
//   // wait for 2 secs
//   timerSubscription.unsubscribe();
// }, 2000);
