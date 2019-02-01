/* eslint-disable no-bitwise */
export function packInteger(integer, size = 4, direction = false) {
  let data = '';
  for (let idx = 0; idx < size; idx += 1) {
    if (direction) {
      data += String.fromCharCode((integer >> ((size - idx - 1) * 8)) & 0xff);
    } else {
      data += String.fromCharCode((integer >> (idx * 8)) & 0xff);
    }
  }
  return data;
}

export function packString(str) {
  return unescape(encodeURIComponent(str)) + packInteger(0, 1);
}

export function unpackString(str) {
  return decodeURIComponent(escape(str.slice(0, -1)));
}

export function unpackInteger(str, direction = false) {
  let integer = 0;
  for (let idx = 0; idx < str.length; idx += 1) {
    if (direction) {
      integer += str.charCodeAt(str.length - idx - 1) << (idx * 8);
    } else {
      integer += str.charCodeAt(idx) << (idx * 8);
    }
  }
  return integer;
}
/* eslint-enable no-bitwise */
