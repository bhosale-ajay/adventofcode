const { resolve } = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");

module.exports = {
  mode: "development",
  target: "node",
  entry: {
    run: "./src/run.ts"
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist")
  },
  devtool: "eval",
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: resolve(__dirname, "./tsconfig.json")
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ]
};
