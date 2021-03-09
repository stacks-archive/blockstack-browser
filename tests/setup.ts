interface LocalStorage {
  [key: string]: string;
}
const localStorageMock = (function () {
  let store: LocalStorage = {};
  return {
    getItem: function (key: string) {
      return store[key];
    },
    setItem: function (key: string, value: any) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key: string) {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
