const fetch = require("node-fetch");

module.exports = async function () {
  console.log("Fetching data...");

  return fetch("https://api.adler-lingenau.com/wp-json/wp/v2/posts")
    .then((res) => res.json())
    .then((json) => json);
};
