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

### Browserify

Browserify is a Javascript file and module loader, allowing you to `require('modules')` in all of your files in the same manner as you would on the backend in a node.js environment. The bundling and compilation is then taken care of by Gulp, discussed below.

---

### Gulp

Gulp is a "streaming build system", providing a very fast and efficient method for running your build tasks.

##### Web Server

Gulp is used here to provide a very basic node/Express web server for viewing your application as you build. It serves static files from the `build/` directory, leaving routing up to React Router. All Gulp tasks are configured to automatically reload the server upon file changes. The application is served to `localhost:3000` once you run the `gulp` task. To take advantage of the fast live reload injection provided by browser-sync, you must load the site at the proxy address (which usually defaults to `server port + 1`, and within this boilerplate will by default be `localhost:3001`.)

##### Scripts

A number of build processes are automatically run on all of our Javascript files, run in the following order:

- **Browserify:** The main build process run on any Javascript files. This processes any of the `require('module')` statements, compiling the files as necessary.
- **Babelify:** This uses [babelJS](https://babeljs.io/) to provide support for ES6+ features, while simultaneously parsing and converting any existing JSX.
- **Debowerify:** Parses `require()` statements in your code, mapping them to `bower_components` when necessary. This allows you to use and include bower components just as you would npm modules.
- **Uglifyify:** This will minify the file created by Browserify and ngAnnotate.

The resulting file (`main.js`) is placed inside the directory `/build/js/`.

##### Styles

Just one task is necessary for processing our SASS files, and that is `gulp-sass`. This will read the `main.scss` file, processing and importing any dependencies and then minifying the result. This file (`main.css`) is placed inside the directory `/build/css/`.

- **gulp-autoprefixer:** Gulp is currently configured to run autoprefixer after compiling the scss.  Autoprefixer will use the data based on current browser popularity and property support to apply prefixes for you. Autoprefixer is recommended by Google and used in Twitter, WordPress, Bootstrap and CodePen.

##### Images

Any images placed within `/app/images` will be automatically copied to the `build/images` directory. If running `npm run build`, they will also be compressed via imagemin.

##### Watching files

All of the Gulp processes mentioned above are run automatically when any of the corresponding files in the `/app` directory are changed, and this is thanks to our Gulp watch tasks. Running `gulp dev` will begin watching all of these files, while also serving to `localhost:3000`, and with browser-sync proxy running at `localhost:3001` (by default).

##### Production Task

Just as there is the `gulp dev` task for development, there is also a `npm run build` task for putting your project into a production-ready state. This will run each of the tasks, while also adding the image minification task discussed above. There is also an empty `gulp deploy` task that is included when running the production task. This deploy task can be fleshed out to automatically push your production-ready site to your hosting setup.

**Reminder:** When running the production task, gulp will not fire up the express server and serve your index.html. This task is designed to be run before the `deploy` step that may copy the files from `/build` to a production web server.
