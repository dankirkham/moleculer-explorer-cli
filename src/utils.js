const flatten = (array) => array.reduce((acc, val) => {
  val.map((item) => acc.push(item));
  return acc;
}, []);

const unique = (array) => array.filter((value, index, self) => self.indexOf(value) === index);

const moveIndex = (array, index, forward = true, wrap = true) => {
  let newIndex = index;

  if (forward) {
    newIndex += 1;
    if (newIndex >= array.length) {
      newIndex = wrap ? 0 : array.length - 1;
    }
  } else {
    newIndex -= 1;
    if (newIndex < 0) {
      newIndex = wrap ? array.length - 1 : 0;
    }
  }

  return newIndex;
};

module.exports = { flatten, unique, moveIndex };
