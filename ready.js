const readyMaker = () => {
  const events = [];

  return {
    on(cb) {
      events.push(cb);
    },
    go() {
      while (events.length) {
        const e = events.pop();
        e();
      }
    }
  };
};

const ready = readyMaker();
