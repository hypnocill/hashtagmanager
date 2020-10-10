module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: __dirname + "/public/dist",
    publicPath: '/public/dist/',
  },
  resolve: {
	extensions: [".ts", ".js", ".json", ".html"],
    alias: {
      '@': __dirname + "/src",
    }
  },
  module: {
    rules: [
      { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },
      { test: /\.ts?$/, loader: "babel-loader" },
      { test: /\.ts?$/, loader: "ts-loader" },
      { test: /\.html$/i, loader: 'html-loader', options: { esModule: true } }
    ]
  }
};