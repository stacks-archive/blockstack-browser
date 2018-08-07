declare module 'reapop' {
  declare type Status = 'default' | 'info' | 'success' | 'warning' | 'error';
  declare type Position = 't' | 'tc' | 'tl' | 'tr' | 'b' | 'bc' | 'br' | 'bl';

  declare type NotificationButton = {
    name: string;
    primary?: boolean;
    onClick: Function;
  }

  declare type Notification = {
    title: string;
    message: string;
    id?: string | number;
    image?: string;
    status?: Status;
    position?: Position;
    dismissible?: boolean;
    dismissAfter?: number;
    closeButton?: boolean;
    buttons?: NotificationButton[];
    onAdd?: Function;
    onRemove?: Function;
    allowHTML?: boolean;
  }

  declare function notify(notification: Notification): Object;
  // TODO: Type me better?
  declare function reducer(): (action: any, state: any) => any;
}
