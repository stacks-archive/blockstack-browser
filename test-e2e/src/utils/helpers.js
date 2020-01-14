
module.exports = class Helpers {

  static isFalsy(val) {
    return !val || /^\s*(false|0|off|no)\s*$/i.test(val);
  }

  static timeout(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  static getRandomInt(min = 1000000000, max = 99999999999) {
    return (Math.floor(Math.random() * (max - min)) + min);
  }

  static getRandomString(length = 20){
    let str = '';
    do { str += Math.random().toString(36).substr(2) } while (str.length < length)
    return str.substr(0, length);
  }

  static mixin(target, other) {

    function getInstanceProperties(val) {
      const propertyDescriptors = {}
      let proto = Object.getPrototypeOf(val);
      while (proto) {
        const props = Object.getOwnPropertyDescriptors(proto);
        for (let prop in props) {
          if (!propertyDescriptors[prop]) {
            propertyDescriptors[prop] = props[prop];
          }
        }
        proto = Object.getPrototypeOf(proto);
      }
      return propertyDescriptors;
    }

    const otherProps = getInstanceProperties(other);
    const targetProps = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(target));
    for (const name in otherProps) {
      const prop = otherProps[name];
      if (!targetProps[name] && typeof prop.value === 'function') {
        prop.value = prop.value.bind(other)
        Object.defineProperty(target, name, prop);
      }
    }
    return target;
  }


}
