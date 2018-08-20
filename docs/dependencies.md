# Dependencies

### ReactJS

ReactJS is a "declarative, efficient, and flexible JavaScript library for building user interfaces."

- "**Just the UI**: Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of your technology stack, it's easy to try it out on a small feature in an existing project."
- "**Virtual DOM**: React uses a virtual DOM diff implementation for ultra-high performance. It can also render on the server using Node.js — no heavy browser DOM required."
- "**Data flow**: React implements one-way reactive data flow which reduces boilerplate and is easier to reason about than traditional data binding."

The ReactJS files are all located within `/app/js`, structured in the following manner:

```
/components
  - Footer.js (Simple, static footer component rendered on all pages.)
  - Header.js (Simple, static header component rendered on all pages.)
/pages
  - HomePage.js (Example home page, serving as the default route.)
  - NotFoundPage.js (Displayed any time the user requests a non-existent route.)
  - SearchPage.js (Example search page to demonstrate navigation and individual pages.)
/utils
  - APIUtils.js (General wrappers for API interaction via Superagent.)
  - AuthAPI.js (Example functions for user authorization via a remote API.)
App.js (The main container component, rendered to the DOM and then responsible for rendering all pages.)
index.js (The main javascript file watched by Browserify, responsible for requiring the app and running the router.)
Routes.js (Defines the routing structure, along with each individual route path and handler.)
```

Each module you add to your project should be placed in the appropriate directory, and required in the necessary files. Once required, they will be automatically detected and compiled by Browserify (discussed later).

---

### RefluxJS

RefluxJS is a "simple library for unidirectional dataflow architecture inspired by ReactJS Flux."

"The pattern is composed of actions and data stores, where actions initiate new data to pass through data stores before coming back to the view components again. If a view component has an event that needs to make a change in the application's data stores, they need to do so by signalling to the stores through the actions available."

The RefluxJS files are also all locationed within `/app/js`, structured in the following manner:

```
/actions
  - CurrentUserActions.js (Possible actions relevant to the current user. i.e. `checkAuth`, `login`, and `logout`.)
/stores
  - CurrentUserStore.js (Responsible for storing the current user data, while listening to any `CurrentUserActions`.)
```

Each action or store you add to your project should be placed in the appropriate directory, and required in the necessary files. The necessary logic to trigger actions and listen to stores should also be added.

---

### React Router

React Router is a "complete routing library for React." It uses the JSX syntax to easily define route URLs and handlers, providing an easy-to-understand architecture and thus makes it easy to add new pages and routes.

The relevant files are all located within `/app/js`, structured in the following manner:

```
/pages (Each individual page to handle the defined routes and be rendered inside the app.)
App.js (The main component which is rendered to the DOM and responsible for rendering the current page.)
index.js (The main javascript file watched by Browserify, requiring the app and running the router.)
Routes.js (Defines the routing structure, along with each individual route path and handler.)
```

Any pages added to your project should be placed within the `app/js/pages` directory, and be required and assigned to a route inside `Routes.js`. If more complex nesting is required, any page can have a new `RouteHandler` as a child component.

---

### SASS

SASS, standing for 'Syntactically Awesome Style Sheets', is a CSS extension language adding things like extending, variables, and mixins to the language. This boilerplate provides a barebones file structure for your styles, with explicit imports into `app/styles/main.scss`. A Gulp task (discussed later) is provided for compilation and minification of the stylesheets based on this file.

---

### Webpack

Webpack bundles all of our code and assets and organizes any manipulation to
them with modules like `babel`. It also handles hot reloading in development,
and minification in production. You can find the configuration for it in
`webpack.config.js` in the root directory.
