function webpackOptions(config) {
  return {
    webpackOptions: {
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
        ],
      },
    },
  }
}

module.exports = { webpackOptions };