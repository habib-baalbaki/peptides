/* Shared layout, cart and page renderers. Static, no build step. */
(function () {
  const C = window.NXT_CONFIG;
  const P = window.NXT_PRODUCTS;
  const CATS = window.NXT_CATEGORIES;
  const CART_KEY = "nxt_cart_v1";
  const GATE_KEY = "nxt_age_ok_v1";

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + n.toFixed(2);
  const byId = (id) => P.find((p) => p.id === id);
  const catName = (id) => (CATS.find((c) => c.id === id) || {}).name || "";
  const page = document.body.dataset.page;

  /* storage: wrapped, since private mode can throw */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- cart ---------- */
  const cart = {
    items() { return store.get(CART_KEY, []).filter((i) => byId(i.id)); },
    save(items) { store.set(CART_KEY, items); renderCount(); },
    add(id, qty = 1) {
      const items = this.items();
      const hit = items.find((i) => i.id === id);
      if (hit) hit.qty = Math.min(99, hit.qty + qty); else items.push({ id, qty });
      this.save(items);
      toast(`${byId(id).name} added to cart`);
    },
    setQty(id, qty) {
      let items = this.items();
      if (qty <= 0) items = items.filter((i) => i.id !== id);
      else items.forEach((i) => { if (i.id === id) i.qty = Math.min(99, qty); });
      this.save(items);
    },
    count() { return this.items().reduce((a, i) => a + i.qty, 0); },
    subtotal() { return this.items().reduce((a, i) => a + byId(i.id).price * i.qty, 0); }
  };
  window.NXT_CART = cart;

  function renderCount() {
    const el = $("#cart-count");
    if (el) el.textContent = cart.count();
  }

  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- layout ---------- */
  const NAV = [
    ["shop.html", "Shop", "shop"],
    ["lab-results.html", "UK Lab Results", "lab"],
    ["about.html", "About", "about"],
    ["faq.html", "FAQ", "faq"],
    ["contact.html", "Contact", "contact"]
  ];

  function header() {
    const links = NAV.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("");
    return `
      <div class="announce">
        <span>Free Xpresspost shipping over ${money(C.freeShippingThreshold)} ${C.currency}</span>
        <span>Orders before ${esc(C.sameDayCutoff)} ship same day</span>
        <span>UK-tested &amp; validated</span>
      </div>
      ${C.pricesArePlaceholders ? '<div class="placeholder-bar">Preview build: prices, shipping terms and lab details are placeholders until confirmed.</div>' : ""}
      <header class="site">
        <div class="container nav">
          <a class="logo" href="index.html" aria-label="NXT Peptides Canada home">NX/T <small>Canada</small></a>
          <button class="menu-btn" aria-label="Menu" aria-expanded="false">☰</button>
          <nav class="nav-links" aria-label="Main">${links}</nav>
          <a class="cart-link" href="cart.html" aria-label="Cart">Cart <span class="cart-count" id="cart-count">0</span></a>
        </div>
      </header>`;
  }

  function footer() {
    return `
      <footer class="site">
        <div class="container">
          <div class="foot-grid">
            <div>
              <a class="logo" href="index.html">NX/T <small>Canada</small></a>
              <p class="muted small" style="margin-top:10px">${esc(C.tagline)}.<br>${esc(C.domain)} is our only website.</p>
            </div>
            <div><h4>Shop</h4>
              <a href="shop.html">All products</a>
              ${CATS.slice(0, 4).map((c) => `<a href="shop.html?cat=${c.id}">${esc(c.name)}</a>`).join("")}
            </div>
            <div><h4>Company</h4>
              <a href="about.html">About NXT Canada</a>
              <a href="lab-results.html">UK Lab Results</a>
              <a href="faq.html">FAQ</a>
              <a href="contact.html">Contact</a>
            </div>
            <div><h4>Policies</h4>
              <a href="policies.html#shipping">Shipping</a>
              <a href="policies.html#returns">Returns</a>
              <a href="policies.html#terms">Terms of sale</a>
              <a href="policies.html#privacy">Privacy</a>
            </div>
          </div>
          <div class="foot-legal">
            <p><strong>For laboratory research use only.</strong> Products are not for human or veterinary use, and not intended to diagnose, treat, cure or prevent any disease. Products have not been authorized by Health Canada. We do not provide dosing, usage or medical advice. Purchasers must be 18+.</p>
            <p>Products are manufactured in a GMP-compliant facility and independently tested in the UK. NXT Peptides Canada is a Canadian-based company. © ${new Date().getFullYear()} NXT Peptides Canada.</p>
          </div>
        </div>
      </footer>`;
  }

  function ageGate() {
    if (store.get(GATE_KEY, false)) return;
    const g = document.createElement("div");
    g.className = "gate";
    g.setAttribute("role", "dialog");
    g.setAttribute("aria-modal", "true");
    g.innerHTML = `
      <div class="gate-box">
        <div class="logo">NX/T <small>Canada</small></div>
        <h2 style="font-size:1.3rem">Research use only</h2>
        <p class="muted small">This site sells research compounds for laboratory use only. They are not for human or animal consumption. You must be 18 or older to enter.</p>
        <div class="hero-cta">
          <button class="btn" id="gate-yes">I'm 18+ and a researcher</button>
          <a class="btn ghost" href="https://www.google.ca">Leave</a>
        </div>
      </div>`;
    document.body.appendChild(g);
    $("#gate-yes").focus();
    $("#gate-yes").addEventListener("click", () => { store.set(GATE_KEY, true); g.remove(); });
  }

  /* ---------- shared pieces ---------- */
  function card(p) {
    return `
      <article class="card">
        <a class="card-img" href="product.html?id=${p.id}">
          ${p.best ? '<span class="badge">Best seller</span>' : ""}
          <img src="assets/img/${p.img}" alt="${esc(p.name)} ${esc(p.size)} vial" loading="lazy" width="440" height="550">
        </a>
        <div class="card-body">
          <a class="title" href="product.html?id=${p.id}"><span class="cap-dot" style="background:${p.cap}"></span>${esc(p.name)}</a>
          <span class="tag">${esc(p.size)} · ${esc(p.tagline)}</span>
          <div class="card-foot">
            <span class="price">${money(p.price)} <small>${C.currency}</small></span>
            <button class="add-btn" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">Add</button>
          </div>
        </div>
      </article>`;
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) cart.add(b.dataset.add, 1);
  });

  /* ---------- pages ---------- */
  const pages = {
    home() {
      $("#best").innerHTML = P.filter((p) => p.best).map(card).join("");
      $("#cats").innerHTML = CATS.map((c) => {
        const n = P.filter((p) => p.cat === c.id).length;
        return `<a class="cat" href="shop.html?cat=${c.id}"><b>${esc(c.name)}</b><em>${n}</em></a>`;
      }).join("");
      $("#all-count").textContent = `Shop all ${P.length} products`;
    },

    shop() {
      const params = new URLSearchParams(location.search);
      const state = { cat: params.get("cat") || "all", q: "", sort: "featured" };
      const chips = [{ id: "all", name: "All" }, ...CATS];
      $("#chips").innerHTML = chips.map((c) => `<button class="chip" data-cat="${c.id}">${esc(c.name)}</button>`).join("");

      function draw() {
        document.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === state.cat));
        const q = state.q.toLowerCase();
        let list = P.filter((p) => (state.cat === "all" || p.cat === state.cat) &&
          (!q || (p.name + " " + p.tagline + " " + p.desc).toLowerCase().includes(q)));
        if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
        if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
        if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        $("#grid").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No products match. Try another search.</p>';
        $("#result-count").textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
      }
      $("#chips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip"); if (!b) return;
        state.cat = b.dataset.cat;
        history.replaceState(null, "", state.cat === "all" ? "shop.html" : `shop.html?cat=${state.cat}`);
        draw();
      });
      $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim(); draw(); });
      $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; draw(); });
      draw();
    },

    product() {
      const p = byId(new URLSearchParams(location.search).get("id")) || P[0];
      document.title = `${p.name} ${p.size} | NXT Peptides Canada`;
      const lab = C.ukLabName || "Independent UK laboratory (name to be confirmed)";
      $("#pdp").innerHTML = `
        <div class="pdp-img"><img src="assets/img/${p.img}" alt="${esc(p.name)} ${esc(p.size)} vial" width="440" height="550" style="width:100%"></div>
        <div>
          <p class="eyebrow">${esc(catName(p.cat))}</p>
          <h1>${esc(p.name)} <span class="muted" style="font-weight:300">${esc(p.size)}</span></h1>
          <p class="tagline">${esc(p.tagline)}</p>
          <div class="big-price">${money(p.price)} <small class="muted" style="font-size:.9rem;font-weight:400">${C.currency}</small></div>
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
            <p class="small muted" style="margin:8px 0 0">Tested by: ${esc(lab)}. Lot number on the vial matches the COA. <a class="link" href="lab-results.html">All lab results</a></p>
          </div>
          <p class="ruo">For laboratory research use only. Not for human or veterinary use. Not authorized by Health Canada. We do not provide dosing or usage guidance.</p>
        </div>`;
      const qty = $("#qty");
      $("#pdp").addEventListener("click", (e) => {
        const s = e.target.closest("[data-step]");
        if (s) qty.value = Math.max(1, Math.min(99, (+qty.value || 1) + +s.dataset.step));
      });
      $("#add").addEventListener("click", () => cart.add(p.id, Math.max(1, Math.min(99, +qty.value || 1))));
      $("#crumb").textContent = p.name;
      const related = P.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
      const extra = P.filter((x) => x.id === "bac-water" && x.id !== p.id);
      $("#related").innerHTML = [...related, ...extra].slice(0, 4).map(card).join("");
    },

    cart() {
      function draw() {
        const items = cart.items();
        const sub = cart.subtotal();
        const free = sub >= C.freeShippingThreshold || sub === 0;
        const ship = free ? 0 : C.flatShipping;
        if (!items.length) {
          $("#lines").innerHTML = `<p class="empty">Your cart is empty.<br><br><a class="btn" href="shop.html">Browse products</a></p>`;
        } else {
          $("#lines").innerHTML = items.map((i) => {
            const p = byId(i.id);
            return `<div class="cart-line">
              <img src="assets/img/${p.img}" alt="">
              <div>
                <a href="product.html?id=${p.id}" style="text-decoration:none;font-weight:600">${esc(p.name)}</a>
                <div class="small muted">${esc(p.size)} · ${money(p.price)}</div>
                <div class="qty" style="margin-top:8px">
                  <button data-q="${p.id}" data-d="-1" aria-label="Decrease">−</button>
                  <input value="${i.qty}" readonly aria-label="Quantity">
                  <button data-q="${p.id}" data-d="1" aria-label="Increase">+</button>
                </div>
              </div>
              <div style="text-align:right">
                <div class="price">${money(p.price * i.qty)}</div>
                <button class="rm" data-rm="${p.id}">Remove</button>
              </div>
            </div>`;
          }).join("");
        }
        const left = Math.max(0, C.freeShippingThreshold - sub);
        $("#sum").innerHTML = `
          <h3>Order summary</h3>
          ${sub > 0 ? `<p class="small" style="margin:0">${left > 0 ? `You're <strong>${money(left)}</strong> away from free shipping` : "You've unlocked free shipping 🎉"}</p>
          <div class="progress"><i style="width:${Math.min(100, (sub / C.freeShippingThreshold) * 100)}%"></i></div>` : ""}
          <div class="line"><span>Subtotal</span><span>${money(sub)}</span></div>
          <div class="line"><span>Shipping (Xpresspost)</span><span>${sub === 0 ? "—" : ship === 0 ? "Free" : money(ship)}</span></div>
          <div class="line muted small"><span>GST/HST</span><span>Calculated by province</span></div>
          <div class="line total"><span>Total</span><span>${money(sub + ship)} ${C.currency}</span></div>`;
        $("#checkout").hidden = !items.length;
      }
      document.addEventListener("click", (e) => {
        const q = e.target.closest("[data-q]");
        if (q) { const it = cart.items().find((i) => i.id === q.dataset.q); cart.setQty(q.dataset.q, it.qty + +q.dataset.d); draw(); }
        const r = e.target.closest("[data-rm]");
        if (r) { cart.setQty(r.dataset.rm, 0); draw(); }
      });
      $("#checkout").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const items = cart.items();
        const lines = items.map((i) => `${i.qty} x ${byId(i.id).name} ${byId(i.id).size} @ ${money(byId(i.id).price)}`);
        const sub = cart.subtotal();
        const ship = sub >= C.freeShippingThreshold ? 0 : C.flatShipping;
        const body = [
          "ORDER REQUEST", "", ...lines, "",
          `Subtotal: ${money(sub)}`, `Shipping: ${ship ? money(ship) : "Free"}`, `Total before tax: ${money(sub + ship)} ${C.currency}`, "",
          `Name: ${f.get("name")}`, `Email: ${f.get("email")}`, `Address: ${f.get("address")}, ${f.get("city")}, ${f.get("province")} ${f.get("postal")}`,
          `Payment: ${f.get("pay")}`, "", "Purchaser confirms items are for laboratory research use only and that they are 18+."
        ].join("\n");
        // TODO replace with a real checkout (WooCommerce/Shopify/Stripe-compatible processor) before launch.
        location.href = `mailto:${C.email}?subject=${encodeURIComponent("Order request – NXT Peptides Canada")}&body=${encodeURIComponent(body)}`;
        $("#done").hidden = false;
      });
      draw();
    },

    lab() {
      const lab = C.ukLabName || "UK laboratory (to be confirmed)";
      $("#lab-name").textContent = lab;
      $("#coa-rows").innerHTML = P.filter((p) => p.cat !== "supplies").map((p) => `
        <tr>
          <td><a href="product.html?id=${p.id}" style="text-decoration:none;font-weight:500">${esc(p.name)}</a></td>
          <td>${esc(p.size)}</td>
          <td class="muted">—</td>
          <td class="muted">—</td>
          <td>${esc(lab)}</td>
          <td><span class="pill">Pending upload</span></td>
        </tr>`).join("");
    }
  };

  /* ---------- boot ---------- */
  $("#site-header").innerHTML = header();
  $("#site-footer").innerHTML = footer();
  const mb = $(".menu-btn");
  mb.addEventListener("click", () => {
    const open = $(".nav-links").classList.toggle("open");
    mb.setAttribute("aria-expanded", open);
  });
  renderCount();
  if (pages[page]) pages[page]();
  ageGate();
})();
