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
  const price = (p) => p.price ? `${money(p.price)} <small>${C.currency}</small>` : "FREE";
  const img = (p) => `assets/img/${p.img || "vial.svg"}`;
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
        <span>New customers: ${C.firstOrderDiscount * 100}% off your first order</span>
        <span>Free shipping over ${money(C.freeShippingThreshold)} ${C.currency}</span>
        <span>Free 3 mL BAC water with every delivery</span>
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
          <img src="${img(p)}" alt="${esc(p.name)} ${esc(p.size)} vial" loading="lazy" width="440" height="550">
        </a>
        <div class="card-body">
          <a class="title" href="product.html?id=${p.id}"><span class="cap-dot" style="background:${p.cap}"></span>${esc(p.name)}</a>
          <span class="tag">${esc(p.size)} · ${esc(p.tagline)}</span>
          <div class="card-foot">
            <span class="price">${price(p)}</span>
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
        <div class="pdp-img"><img src="${img(p)}" alt="${esc(p.name)} ${esc(p.size)} vial" width="440" height="550" style="width:100%"></div>
        <div>
          <p class="eyebrow">${esc(catName(p.cat))}</p>
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
        const t = totals(), { sub, off, ship } = t;
        if (!items.length) {
          $("#lines").innerHTML = `<p class="empty">Your cart is empty.<br><br><a class="btn" href="shop.html">Browse products</a></p>`;
        } else {
          $("#lines").innerHTML = items.map((i) => {
            const p = byId(i.id);
            return `<div class="cart-line">
              <img src="${img(p)}" alt="">
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
          ${off ? `<div class="line"><span>First-order discount (${C.firstOrderDiscount * 100}%)</span><span>−${money(off)}</span></div>` : ""}
          <div class="line"><span>Shipping (Xpresspost)</span><span>${sub === 0 ? "—" : ship === 0 ? "Free" : money(ship)}</span></div>
          ${t.rate ? `<div class="line"><span>GST/HST (${t.prov} ${+(t.rate * 100).toFixed(3)}%)</span><span>${money(t.tax)}</span></div>`
            : `<div class="line muted small"><span>GST/HST</span><span>Select your province</span></div>`}
          <div class="line total"><span>Total</span><span>${money(t.total)} ${C.currency}</span></div>`;
        $("#checkout").hidden = !items.length;
      }
      document.addEventListener("click", (e) => {
        const q = e.target.closest("[data-q]");
        if (q) { const it = cart.items().find((i) => i.id === q.dataset.q); cart.setQty(q.dataset.q, it.qty + +q.dataset.d); draw(); }
        const r = e.target.closest("[data-rm]");
        if (r) { cart.setQty(r.dataset.rm, 0); draw(); }
        const c = e.target.closest("[data-copy]");
        if (c) navigator.clipboard.writeText(c.dataset.copy).then(() => toast("Address copied"));
      });
      // ponytail: honour system, no accounts; check the email against past orders before shipping
      const discount = (sub) => ($("#checkout").first.checked ? Math.round(sub * C.firstOrderDiscount * 100) / 100 : 0);
      const totals = () => {
        const sub = cart.subtotal(), off = discount(sub);
        const ship = sub >= C.freeShippingThreshold || sub === 0 ? 0 : C.flatShipping;
        const prov = $("#checkout").province.value, rate = C.taxRates[prov];
        const tax = rate ? Math.round((sub - off + ship) * rate * 100) / 100 : 0;
        return { sub, off, ship, prov, rate, tax, total: sub - off + ship + tax };
      };
      $("#checkout").first.addEventListener("change", draw);
      $("#checkout").province.addEventListener("change", draw);
      const COINS = { BTC: ["bitcoin", 8], ETH: ["ethereum", 6], USDT: ["tether", 2] };
      const qr = (s) => { const q = qrcode(0, "M"); q.addData(s); q.make(); return q.createSvgTag({ cellSize: 5, margin: 2 }); };
      $("#checkout").addEventListener("submit", async (e) => {
        e.preventDefault();
        e.target.querySelector("[type=submit]").disabled = true;
        const f = new FormData(e.target), t = totals(), coin = f.get("pay"), addr = (C.wallets || {})[coin];
        const [cg, dp] = COINS[coin];
        const order = "NXT-" + Date.now().toString(36).toUpperCase();
        let amt = "";
        try {
          const r = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cg}&vs_currencies=cad`)).json();
          amt = (t.total / r[cg].cad).toFixed(dp);
        } catch (err) {} // no live rate: we email the exact amount instead
        const items = cart.items();
        const lines = items.map((i) => `${i.qty} x ${byId(i.id).name} ${byId(i.id).size} @ ${money(byId(i.id).price)}`);
        const body = [
          `ORDER ${order}`, "", ...lines, "",
          `Subtotal: ${money(t.sub)}`, ...(t.off ? [`First-order discount: -${money(t.off)}`] : []), `Shipping: ${t.ship ? money(t.ship) : "Free"}`, `GST/HST (${t.prov}): ${money(t.tax)}`, `Total: ${money(t.total)} ${C.currency}`, "",
          `Name: ${f.get("name")}`, `Email: ${f.get("email")}`, `Address: ${f.get("address")}, ${f.get("city")}, ${f.get("province")} ${f.get("postal")}`,
          `Payment: ${amt ? `${amt} ${coin}` : coin}${addr ? ` to ${addr}` : ""}`, "", "Purchaser confirms items are for laboratory research use only and that they are 18+."
        ].join("\n");
        const mail = `mailto:${C.email}?subject=${encodeURIComponent(`Order ${order} – NXT Peptides Canada`)}&body=${encodeURIComponent(body)}`;
        // ponytail: one fixed address per coin, payments matched to orders by amount; BTCPay Server gives per-order addresses + auto-confirm
        const uri = coin === "BTC" && amt ? `bitcoin:${addr}?amount=${amt}` : addr;
        $(".summary").innerHTML = `
          <h3>Pay with ${coin}</h3>
          <p class="small muted" style="margin:0">Order ${order}</p>
          ${amt ? `<p class="inv-amt">${amt} ${coin}</p><p class="small muted" style="margin:0">= ${money(t.total)} ${C.currency} · rate held for <strong id="inv-timer">30:00</strong></p>`
            : `<p class="inv-amt">${money(t.total)} ${C.currency}</p><p class="small muted" style="margin:0">We'll email you the exact ${coin} amount.</p>`}
          ${addr ? `${typeof qrcode === "function" ? `<div class="inv-qr">${qr(uri)}</div>` : ""}
            <p class="small muted" style="margin:12px 0 4px">Send to this address${coin === "USDT" ? " (Ethereum network, ERC-20 only)" : ""}</p>
            <div class="inv-addr"><code>${esc(addr)}</code><button class="btn ghost" type="button" data-copy="${esc(addr)}">Copy</button></div>`
            : `<p class="small">We'll email you the ${coin} wallet address.</p>`}
          <p class="small">Send the exact amount shown. Your order ships once the payment confirms. Your email app opened with your order details — please send that email.</p>
          <a class="btn ghost block" href="${mail}">Email my order again</a>`;
        $("#lines").innerHTML = `<p class="empty">Thanks! Order <strong>${order}</strong> is waiting for payment.</p>`;
        cart.save([]);
        if (amt) {
          const end = Date.now() + 30 * 60e3;
          const tick = setInterval(() => {
            const s = Math.max(0, Math.round((end - Date.now()) / 1000));
            $("#inv-timer").textContent = s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "expired, message us for an updated amount";
            if (!s) clearInterval(tick);
          }, 1000);
        }
        location.href = mail;
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
  if (C.whatsapp) document.body.insertAdjacentHTML("beforeend", `<a class="wa" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hi NXT Canada, I have a question.")}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>`);
  const mb = $(".menu-btn");
  mb.addEventListener("click", () => {
    const open = $(".nav-links").classList.toggle("open");
    mb.setAttribute("aria-expanded", open);
  });
  renderCount();
  if (pages[page]) pages[page]();
  ageGate();
})();
