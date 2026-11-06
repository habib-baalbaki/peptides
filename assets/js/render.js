/*
 * Shared HTML templates: pure string functions, no DOM access.
 * Loaded in the browser before site.js, and run by scripts/build.mjs (node:vm)
 * to pre-render pages, so the static HTML and the JS-rendered HTML always match.
 *
 * `root` is the relative path back to the site root: "" for top-level pages,
 * "../" for pages in products/.
 */
(function (w) {
  const C = w.NXT_CONFIG;
  const P = w.NXT_PRODUCTS;
  const CATS = w.NXT_CATEGORIES;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + n.toFixed(2);
  const price = (p) => p.price ? `${money(p.price)} <small>${C.currency}</small>` : "FREE";
  const byId = (id) => P.find((p) => p.id === id);
  const catName = (id) => (CATS.find((c) => c.id === id) || {}).name || "";
  const imgSrc = (p, root = "") => `${root}assets/img/${p.img || "vial.svg"}`;
  const productHref = (p, root = "") => `${root}products/${p.id}.html`;
  const catHref = (c, root = "") => (c.slug ? `${root}category/${c.slug}.html` : `${root}shop.html?cat=${c.id}`);
  const catById = (id) => CATS.find((c) => c.id === id) || { id, name: "" };

  const NAV = [
    ["shop.html", "Shop", "shop"],
    ["lab-results.html", "UK Lab Results", "lab"],
    ["about.html", "About", "about"],
    ["faq.html", "FAQ", "faq"],
    ["contact.html", "Contact", "contact"]
  ];

  function header(page, root = "") {
    const links = NAV.map(([h, t, k]) => `<a href="${root}${h}" data-nav="${k}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("");
    return `
      <div class="announce">
        <span>New customers: ${C.firstOrderDiscount * 100}% off your first order</span>
        <span>Free shipping over ${money(C.freeShippingThreshold)} ${C.currency}</span>
        <span>Free 3 mL BAC water with every delivery</span>
        <span>UK-tested &amp; validated</span>
      </div>
      ${C.pricesArePlaceholders ? '<div class="placeholder-bar">Preview build: prices, shipping terms and lab details are placeholders until confirmed.</div>' : ""}
      <header class="site">
        <div class="container nav">
          <a class="logo" href="${root}index.html" aria-label="NXT Peptides Canada home">NX/T <small>Canada</small></a>
          <button class="menu-btn" aria-label="Menu" aria-expanded="false">☰</button>
          <nav class="nav-links" aria-label="Main">${links}</nav>
          <a class="cart-link" href="${root}cart.html" aria-label="Cart">Cart <span class="cart-count" id="cart-count">0</span></a>
        </div>
      </header>
`;
  }

  function footer(root = "", year = new Date().getFullYear()) {
    return `
      <footer class="site">
        <div class="container">
          <div class="foot-grid">
            <div>
              <a class="logo" href="${root}index.html">NX/T <small>Canada</small></a>
              <p class="muted small" style="margin-top:10px">${esc(C.tagline)}.<br>${esc(C.domain)} is our only website.</p>
            </div>
            <div><h4>Shop</h4>
              <a href="${root}shop.html">All products</a>
              ${CATS.slice(0, 4).map((c) => `<a href="${catHref(c, root)}">${esc(c.name)}</a>`).join("")}
            </div>
            <div><h4>Company</h4>
              <a href="${root}about.html">About NXT Canada</a>
              <a href="${root}lab-results.html">UK Lab Results</a>
              <a href="${root}faq.html">FAQ</a>
              <a href="${root}contact.html">Contact</a>
            </div>
            <div><h4>Policies</h4>
              <a href="${root}policies.html#shipping">Shipping</a>
              <a href="${root}policies.html#returns">Returns</a>
              <a href="${root}policies.html#terms">Terms of sale</a>
              <a href="${root}policies.html#privacy">Privacy</a>
            </div>
          </div>
          <div class="foot-legal">
            <p><strong>For laboratory research use only.</strong> Products are not for human or veterinary use, and not intended to diagnose, treat, cure or prevent any disease. Products have not been authorized by Health Canada. We do not provide dosing, usage or medical advice. Purchasers must be 18+.</p>
            <p>Products are manufactured in a GMP-compliant facility and independently tested in the UK. NXT Peptides Canada is a Canadian-based company. © ${year} NXT Peptides Canada.</p>
          </div>
        </div>
      </footer>
`;
  }

  function card(p, root = "") {
    const href = productHref(p, root);
    return `
      <article class="card">
        <a class="card-img" href="${href}">
          ${p.best ? '<span class="badge">Best seller</span>' : ""}
          <img src="${imgSrc(p, root)}" alt="${esc(p.name)} ${esc(p.size)} vial" loading="lazy" width="440" height="550">
        </a>
        <div class="card-body">
          <a class="title" href="${href}"><span class="cap-dot" style="background:${p.cap}"></span>${esc(p.name)}</a>
          <span class="tag">${esc(p.size)} · ${esc(p.tagline)}</span>
          <div class="card-foot">
            <span class="price">${price(p)}</span>
            <button class="add-btn" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">Add</button>
          </div>
        </div>
      </article>`;
  }

  const cards = (list, root = "") => list.map((p) => card(p, root)).join("") + "\n";

  function catTiles(root = "") {
    return CATS.map((c) => {
      const n = P.filter((p) => p.cat === c.id).length;
      return `<a class="cat" href="${catHref(c, root)}"><b>${esc(c.name)}</b><em>${n}</em></a>`;
    }).join("");
  }

  function chips() {
    return [{ id: "all", name: "All" }, ...CATS].map((c) => `<button class="chip" data-cat="${c.id}">${esc(c.name)}</button>`).join("");
  }

  const allCount = () => `Shop all ${P.length} products`;
  const resultCount = (n) => `${n} product${n === 1 ? "" : "s"}`;

  function related(p) {
    const same = P.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const extra = P.filter((x) => x.id === "bac-water" && x.id !== p.id);
    return [...same, ...extra].slice(0, 4);
  }

  function pdp(p, root = "") {
    const lab = C.ukLabName || "Independent UK laboratory (name to be confirmed)";
    return `
        <div class="pdp-img"><img src="${imgSrc(p, root)}" alt="${esc(p.name)} ${esc(p.size)} vial" width="440" height="550" style="width:100%"></div>
        <div>
          <p class="eyebrow"><a href="${catHref(catById(p.cat), root)}" style="color:inherit;text-decoration:none">${esc(catName(p.cat))}</a></p>
          <h1>${esc(p.name)} <span class="muted" style="font-weight:300">${esc(p.size)}</span></h1>
          <p class="tagline">${esc(p.tagline)}</p>
          <div class="big-price">${p.price ? `${money(p.price)} <small class="muted" style="font-size:.9rem;font-weight:400">${C.currency}</small>` : "FREE"}</div>
          <p class="small muted">Taxes calculated at checkout. Free Xpresspost over ${money(C.freeShippingThreshold)}.</p>
          <div class="buy-row">
            <div class="qty" aria-label="Quantity">
              <button type="button" data-step="-1" aria-label="Decrease">−</button>
              <input id="qty" type="number" min="1" max="99" value="1" aria-label="Quantity">
              <button type="button" data-step="1" aria-label="Increase">+</button>
            </div>
            <button class="btn" id="add">Add to cart</button>
          </div>
          <p>${esc(p.desc)}</p>
          <table class="specs">
            <tr><th>Contents</th><td>${esc(p.size)}${p.cat === "supplies" ? "" : ", lyophilized powder"}</td></tr>
            <tr><th>Purity</th><td>≥99% (HPLC), see batch COA</td></tr>
            <tr><th>Testing</th><td>Independently tested &amp; validated in the UK (HPLC + MS)</td></tr>
            <tr><th>Manufacturing</th><td>GMP-compliant facility</td></tr>
            <tr><th>Storage</th><td>Store lyophilized vials refrigerated (2–8 °C), away from light</td></tr>
            <tr><th>Ships from</th><td>Canada, via Canada Post Xpresspost with tracking</td></tr>
          </table>
          <div class="coa-box">
            <div class="row"><strong>Certificate of Analysis</strong><span class="pill">Batch COA pending upload</span></div>
            <p class="small muted" style="margin:8px 0 0">Tested by: ${esc(lab)}. Lot number on the vial matches the COA. <a class="link" href="${root}lab-results.html">All lab results</a></p>
          </div>
          <p class="ruo">For laboratory research use only. Not for human or veterinary use. Not authorized by Health Canada. We do not provide dosing or usage guidance.</p>
        </div>
`;
  }

  const labName = () => C.ukLabName || "UK laboratory (to be confirmed)";

  function coaRows(root = "") {
    const lab = labName();
    return P.filter((p) => p.cat !== "supplies").map((p) => `
        <tr>
          <td><a href="${productHref(p, root)}" style="text-decoration:none;font-weight:500">${esc(p.name)}</a></td>
          <td>${esc(p.size)}</td>
          <td class="muted">—</td>
          <td class="muted">—</td>
          <td>${esc(lab)}</td>
          <td><span class="pill">Pending upload</span></td>
        </tr>`).join("") + "\n";
  }

  w.NXT_RENDER = {
    esc, money, price, byId, catName, catById, catHref, imgSrc, productHref, NAV,
    header, footer, card, cards, catTiles, chips, allCount, resultCount,
    related, pdp, labName, coaRows
  };
})(window);
