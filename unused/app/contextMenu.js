import { Menu, MenuItem, getCurrentWindow } from 'remote'

let menu = new Menu();
menu.append(
  new MenuItem({
    label: 'MenuItem1',
    click: function() {
      console.log('item 1 clicked');
    }
  })
);
menu.append(
  new MenuItem({
    type: 'separator'
  })
);
menu.append(
  new MenuItem({
    label: 'MenuItem2',
    type: 'checkbox',
    checked: true
  })
);

export function setUpContextMenu() {
  window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(getCurrentWindow());
  }, false);
}
