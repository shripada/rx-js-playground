import { interval, timer } from "./creational-operators.js";

const interval$ = interval(1000); //all observables will have a dollar suffix

const intervalSubscription = interval$.subscribe({
  next(count) {
    console.log(count);
    // if (count === 5) {
    //   intervalSubscription.unsubscribe(); //after 5 secs we want to stop the interval
    // }
  },
});

const timer$ = timer(5000);

const timerSubscription = timer$.subscribe({
  next() {
    intervalSubscription.unsubscribe(); //after 5 secs we want to stop the interval
  },
});

//idiomatic method
// timer(5000).subscribe({
//   next() {
//     intervalSubscription.unsubscribe();
//   },
// });
