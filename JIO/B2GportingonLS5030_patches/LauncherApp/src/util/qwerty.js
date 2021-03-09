const qwertyKeyMapping = {
  'w': '1',
  'e': '2',
  'r': '3',
  's': '4',
  'd': '5',
  'f': '6',
  'z': '7',
  'x': '8',
  'c': '9',
  ',': '0',
  'o': '+',
  'a': '*',
  'q': '#'
};

/*navigator.hasFeature('device.capability.qwerty').then((isQwerty) => {  // B2G-API
  if (isQwerty) {
    // on computer, $-key has the same keycode of 4-key.
    // and we accept '4' just only from s-key on QWERTY device.
    qwertyKeyMapping['4'] = '$';
  }
});*/

export default {
  translate: function (key) {
    return qwertyKeyMapping[key] || key;
  }
};
