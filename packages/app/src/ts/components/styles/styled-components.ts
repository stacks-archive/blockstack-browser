import 'styled-components';
// Enhance the DefaultTheme interface with new attributes.
// While still importing the DefaultTheme interface from styled-components.
declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundColor: string;
  }
}
