const nodeExternals = require("webpack-node-externals");
const { join } = require("path");

module.exports = function (options) {
  return {
    ...options,
    externals: [
      nodeExternals({
        modulesDir: join(__dirname, "node_modules"),
        allowlist: [/^@repo\//],
      }),
      nodeExternals({
        modulesDir: join(__dirname, "../../node_modules"),
        allowlist: [/^@repo\//],
      }),
    ],
  };
};
