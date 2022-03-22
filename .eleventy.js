const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginPWA = require("eleventy-plugin-pwa");
const PostCSSPlugin = require("eleventy-plugin-postcss");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginPWA);
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPlugin(PostCSSPlugin);
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
};
