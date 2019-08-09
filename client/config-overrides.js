const path = require('path');

module.exports = function override(config, env) {
    console.log("⚠️   Re-wiring webpack.config using react-app-rewired and config-overrides.js   ⚠️");
    console.log("⚠️   Overriding react-router-dom location to point to a single package,         ⚠️");
    console.log("⚠️   to allow for withRouter usage in components from iota-react-components.    ⚠️");
    console.log()

    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['react-router-dom'] = path.join(__dirname, './node_modules/react-router-dom/');

    return config;
}