setImmediate(() => {
  console.log(1);
});

process.nextTick(() => {
  console.log(2);
  process.nextTick(() => {
    console.log(6);
  });
});

console.log(3);

Promise.resolve().then(() => {
  console.log(4);
  process.nextTick(() => {
    console.log(5);
  });
});

/**
 * nextTick 
 * promise 
 * 
 * Timer:
 * poll
 * check:
 * 
 * 3 2 6 4 5 1
 */