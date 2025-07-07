const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

function webpackOptions(config) {
  return {
    webpackOptions: {
      plugins: [new NodePolyfillPlugin()],
      resolve: {
        extensions: [".ts", ".js"],
        fallback: {
          "util": false,
          "fs": false,
        }
      },
      module: {
        rules: [
          {
            test: /\.feature$/,
            use: [
              {
                loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                options: config,
              },
            ],
          },
          {
            test: /\.([jt])s$/, // ← Soporta .js y .ts
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
            type: "javascript/auto", // ← Soluciona el error 'sourceType'
          },
        ],
      },
    },
  };
}

module.exports = { webpackOptions };