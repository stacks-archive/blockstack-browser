const BABEL_ENV = process.env.BABEL_ENV;
const isBuilding = BABEL_ENV !== undefined && BABEL_ENV !== "cjs";

const presets = [
  [
    "@babel/preset-env",
    {
      loose: true,
      modules: isBuilding ? false : "commonjs"
    }
  ],
  "@babel/preset-react",
  "@babel/preset-typescript"
];

const plugins = [
  "@babel/plugin-proposal-object-rest-spread",
  [
    "babel-plugin-transform-react-remove-prop-types",
    {
      mode: "unsafe-wrap"
    }
  ]
];

module.exports = {
  presets: presets,
  plugins: plugins
};
