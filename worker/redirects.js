/*
 * Permanent (301) redirects from old and misplaced URLs to the one canonical URL per page,
 * so Google merges their ranking signals instead of splitting them across duplicates.
 *
 *   /product?id=X, /product.html?id=X     -> /products/X   (unknown id -> /shop)
 *   /shop?cat=X, /shop.html?cat=X         -> /category/<slug of X>   (unknown cat -> /shop)
 *   /products/cart.html, /category/contact.html, ... (old relative-link bug) -> /cart, /contact, ...
 *   any other /x.html, /x/index.html      -> /x, /x/   (query string kept)
 *
 * Returns the target path (with query, if any) or null when the URL is already canonical.
 */
import { PRODUCTS, CATEGORIES } from "./catalogue.js";

const ROOT_PAGES = new Set(["index", "about", "cart", "contact", "faq", "lab-results", "policies", "shop", "product"]);

export function redirectFor(url) {
  let path = url.pathname;
  const params = url.searchParams;

  // root pages requested under /products/ or /category/ by the old relative links
  const misplaced = path.match(/^\/(?:products|category)\/([a-z-]+)(?:\.html)?$/);
  if (misplaced && ROOT_PAGES.has(misplaced[1])) path = "/" + misplaced[1];

  // drop .html and index
  path = path.replace(/\.html$/, "").replace(/(^|\/)index$/, "/");

  let target;
  if (path === "/product") {
    const id = params.get("id");
    target = id && Object.hasOwn(PRODUCTS, id) ? `/products/${id}` : "/shop";
  } else if (path === "/shop" && params.has("cat")) {
    const cat = params.get("cat");
    target = cat && Object.hasOwn(CATEGORIES, cat) ? `/category/${CATEGORIES[cat]}` : "/shop";
  } else {
    target = path + url.search;
  }
  return target === url.pathname + url.search ? null : target;
}
