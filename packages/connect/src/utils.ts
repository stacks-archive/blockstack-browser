export function getStacksProvider() {
  return window.StacksProvider || window.BlockstackProvider;
}

export function isStacksWalletInstalled() {
  return !!getStacksProvider();
}
