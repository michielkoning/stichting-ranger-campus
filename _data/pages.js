const AssetCache = require("@11ty/eleventy-cache-assets");
const Image = require("@11ty/eleventy-img");

/**
 * Get the articles from WordPress
 * Uses eleventy-cache-assets to speed up build time
 */
async function fetchArticles() {
  try {
    return AssetCache(
      "https://loesje.nl/wp-json/wp/v2/posts?per_page=10&_embed",
      {
        duration: "1d",
        type: "json",
      }
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    return [];
  }
}

const fetchImages = async (post) => {
  if (post._embedded["wp:featuredmedia"]) {
    if (post._embedded["wp:featuredmedia"]["0"].source_url) {
      const url = post._embedded["wp:featuredmedia"]["0"].source_url;
      const image = await Image(url, {
        duration: "1d",
        widths: [300],
        formats: ["webp", "jpeg", "avif"],
        outputDir: "./_site/img/",
      });
      return Image.generateHTML(image, {
        alt: "A bomb ass nebula",
      });
    }
  }
  return null;
};

/**
 * Clean up and convert the API response for our needs
 */
async function processPosts(blogposts) {
  return Promise.all(
    blogposts.map(async (post) => {
      // remove HTML-Tags from the excerpt for meta description
      let metaDescription = post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "");
      metaDescription = metaDescription.replace("\n", "");

      const image = await fetchImages(post);

      // Return only the data that is needed for the actual output
      return await {
        title: post.title.rendered,
        date: post.date,
        formattedDate: new Date(post.date).toLocaleDateString("nl-NL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        rssDate: new Date(post.date).toUTCString(),
        modifiedDate: post.modified,
        slug: post.slug,
        metaDescription: metaDescription,
        excerpt: post.excerpt.rendered,
        content: post.content.rendered,
        categorySlugs: post.msme_categories_slugs,
        image,
      };
    })
  );
}

module.exports = async () => {
  const blogposts = await fetchArticles();
  const processedPosts = await processPosts(blogposts);
  return processedPosts;
};
