const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const webpack = require("@cypress/webpack-preprocessor");
const {webpackOptions} = require('../../webpack.config');
const http = require('http'); // Import Node.js http module

// Helper function to send status updates to the backend
const notifyBackend = (data) => {
  const postData = JSON.stringify(data);
  const options = {
    hostname: 'localhost',
    port: 4001, // The port your Express server is running on
    path: '/api/workflow-status',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error('Error notifying backend:', error);
  });

  req.write(postData);
  req.end();
};

const setupNodeEvents = async(on, config) => {
    await addCucumberPreprocessorPlugin(on, config);
    on("file:preprocessor",  webpack(webpackOptions(config)));

    // --- New Event Listeners for Real-time Feedback ---
    on('before:scenario', (scenario) => {
      console.log(`CYPRESS EVENT: Starting scenario: ${scenario.name}`);
      notifyBackend({ scenarioName: scenario.name, status: 'running' });
    });

    on('after:scenario', (scenario) => {
      console.log(`CYPRESS EVENT: Finished scenario: ${scenario.name} - Status: ${scenario.result.status}`);
      notifyBackend({ scenarioName: scenario.name, status: scenario.result.status });
    });
    // --- End of New Event Listeners ---

    return config;
}

module.exports = setupNodeEvents;
