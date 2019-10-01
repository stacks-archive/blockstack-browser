const path = require("path");
const remarkPlugins = [
  require("remark-autolink-headings"),
  require("remark-emoji"),
  require("remark-images"),
  require("remark-slug"),
  require("remark-unwrap-images")
];

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins
  }
});

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx"],
  webpack: config => {
    config.resolve.alias["react"] = path.resolve("./node_modules/react");
    config.resolve.alias["react-dom"] = path.resolve(
      "./node_modules/react-dom"
    );
    config.resolve.alias["@components"] = path.resolve("./src/components");
    config.resolve.alias["@common"] = path.resolve("./src/common");
    return config;
  }
});
