# Blockstack Portal Design Recommendations

Blockstack is a progressive open source platform that values user experience and usercentric design. As a result of this passion we have developed design elements and recommendations to assist developers building on Blockstack to quickly and easily provide an optimal and consistent user experience.

## Status Bar
The reasoning behind the Blockstack portal status bar is to provide users with an intuitive way to navigate back to their home screen and possibly other useful information.

What we have discovered in building these new decentralized applications was that, if the developer is left with creating their own home screen button they will place it in a consistent position than it's application peers.

The other secondary objective of the Blockstack portal status bar is to provide developers with a quick and easy way to implement this global standard. It is imperative that developers can quickly and easily grab a small snippet of code, paste it into their application and deploy.

### Positioning & sizing
The Blockstack portal status bar is a appears along the upper edge of the screen with a full width. `width: 100%;`. And height of `height: 38px;`. 

Although the developer may choose to utilize either the `status-bar-light`, `status-bar status-bar-dark`, `status-bar status-bar-transparent-light` or `status-bar status-bar-transparent-dark` status bar, we highly recommend leaving the top 38px the space required for future information that may appear in the status bar.

### Fonts
Size: Status Bar font size is 12px `font-size: 12px;`. The font is small as some elements are placed in the highest real estate regions of the Document Object Model (DOM).
Font-family: other than symbols, the font-family for the status bar is 
```
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
```

_NOTE: Further research on this has revealed a strong case for going with a traditional [web safe font](https://en.wikipedia.org/wiki/Web_typography#Web-safe_fonts) such as **Arial** or even going with a **Helvetica** with a fall-back font of **Arial** would be better than setting the brand type to be a third party typeface that requires installation and/or use of an API._

### Symbols
The status bar utilizes symbols from the [Font Awesome](http://fontawesome.io/) desktop/web font.

#### Current symbols

| Symbol  | Class Name  | Cheat Sheet Visual  |
| ------------- | ------------- | ------------- |
| **Home screen arrow**  | `fa-angle-left [&#xf104;]`  | <img width="164" alt="screenshot 2017-03-17 16 08 25" src="https://cloud.githubusercontent.com/assets/1711854/24061005/16a01ad2-0b2c-11e7-87ea-969558bf2f5c.png">  |

Reference: 
- http://fontawesome.io/cheatsheet/

### Best practices
We highly recommend utilizing one of the 4 status bar options to choose from;
`status-bar status-bar-light`
`status-bar status-bar-dark`
`status-bar status-bar-transparent-light`
`status-bar status-bar-transparent-dark`

<img width="1148" alt="screenshot 2017-03-23 15 30 25" src="https://cloud.githubusercontent.com/assets/1711854/24266578/a8923dd4-0fdd-11e7-9994-e6a5d564f6a4.png">

