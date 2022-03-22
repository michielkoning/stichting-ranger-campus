const fetch = require("node-fetch");
const Image = require("@11ty/eleventy-img");

module.exports = async () => {
  console.log("Fetching data...");

  const response = await fetch(
    "https://api.adler-lingenau.com/wp-json/wp/v2/posts?_embed"
  );
  const posts = await response.json();

  posts.forEach(async (post) => {
    if (post._embedded["wp:featuredmedia"]) {
      if (post._embedded["wp:featuredmedia"]["0"].source_url) {
        const url = post._embedded["wp:featuredmedia"]["0"].source_url;
        await Image(url, {
          widths: [300],
          formats: ["webp", "jpeg", "avif"],
        });
      }
    }
  });

  return posts;
};
