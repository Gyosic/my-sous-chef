const path = require("path");

module.exports = function (options) {
  return {
    ...options,
    externals: [],
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve?.alias,
        "@repo/db": path.resolve(__dirname, "../../packages/db/src"),
      },
    },
  };
};
