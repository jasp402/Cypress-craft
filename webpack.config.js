const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

function webpackOptions(config) {
  return {
    webpackOptions: {
      plugins: [
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
          process: 'process/browser',   // ✅ polyfill para process
          Buffer: ['buffer', 'Buffer'], // opcional si usas Buffer
        }),
      ],
      resolve: {
        extensions: [".ts", ".js"],
        fallback: {
          "util": require.resolve("util/"), // ✅ en lugar de false
          "fs": false,                      // seguimos deshabilitando fs
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
        ],
      },
    },
  };
}

module.exports = { webpackOptions };
