const path = require('path');
const StylelintPlugin = require("stylelint-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.plugins.push(new StylelintPlugin());
    return config;
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, "styles"),
      path.join(__dirname, "components")
    ]
  }
}

module.exports = nextConfig
