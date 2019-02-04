
module.exports = class Util {

  static getRandomInt(min = 1000000000, max = 99999999999) {
    return (Math.floor(Math.random() * (max - min)) + min);
  }

  static getRandomString(length = 20) {
    let str = '';
    do { str += Math.random().toString(36).substr(2) } while (str.length < length)
    return str.substr(0, length);
  }

}
