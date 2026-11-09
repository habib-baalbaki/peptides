/*
 * Shared layout, cart and page behaviour.
 * Markup templates live in render.js. scripts/build.mjs pre-renders the header,
 * footer, grids and product pages into the HTML; this file only fills in what
 * is missing and wires up behaviour.
 */
(function () {
  const C = window.NXT_CONFIG;
  const P = window.NXT_PRODUCTS;
  const R = window.NXT_RENDER;
  const CART_KEY = "nxt_cart_v1";
  const GATE_KEY = "nxt_age_ok_v1";

  const $ = (s, r = document) => r.querySelector(s);
  const { esc, money, byId } = R;
  const page = document.body.dataset.page;
  const ROOT = document.body.dataset.root || ""; // "../" on products/*.html
  const img = (p) => R.imgSrc(p, ROOT);
  const cards = (list) => R.cards(list, ROOT);
  /* fill an element from a template unless the build already pre-rendered it */
  const fill = (el, html) => { if (el && !el.children.length) el.innerHTML = html; };

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
  function layout() {
    const head = $("#site-header");
    fill(head, R.header(page, ROOT));
    // pre-rendered header: make sure the current page is marked
    head.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
      if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    fill($("#site-footer"), R.footer(ROOT));
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

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) cart.add(b.dataset.add, 1);
  });

  /* ---------- pages ---------- */
  const pages = {
    home() {
      fill($("#best"), cards(P.filter((p) => p.best)));
      fill($("#cats"), R.catTiles(ROOT));
      $("#all-count").textContent = R.allCount();
    },

    shop() {
      const params = new URLSearchParams(location.search);
      const state = { cat: params.get("cat") || "all", q: "", sort: "featured" };
      fill($("#chips"), R.chips());

      function draw() {
        document.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === state.cat));
        const q = state.q.toLowerCase();
        let list = P.filter((p) => (state.cat === "all" || p.cat === state.cat) &&
          (!q || (p.name + " " + p.tagline + " " + p.desc).toLowerCase().includes(q)));
        if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
        if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
        if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        $("#grid").innerHTML = list.length ? cards(list) : '<p class="empty">No products match. Try another search.</p>';
        $("#result-count").textContent = R.resultCount(list.length);
      }
      $("#chips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip"); if (!b) return;
        state.cat = b.dataset.cat;
        history.replaceState(null, "", state.cat === "all" ? "shop" : `shop?cat=${state.cat}`);
        draw();
      });
      $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim(); draw(); });
      $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; draw(); });
      draw();
    },

    /* products/<id>.html: content is pre-rendered by the build, this only wires it up */
    product() {
      const p = byId(document.body.dataset.id);
      if (!p) return;
      fill($("#pdp"), R.pdp(p, ROOT));
      fill($("#related"), cards(R.related(p)));
      const qty = $("#qty");
      $("#pdp").addEventListener("click", (e) => {
        const s = e.target.closest("[data-step]");
        if (s) qty.value = Math.max(1, Math.min(99, (+qty.value || 1) + +s.dataset.step));
      });
      $("#add").addEventListener("click", () => cart.add(p.id, Math.max(1, Math.min(99, +qty.value || 1))));
    },

    cart() {
      function draw() {
        const items = cart.items();
        const t = totals(), { sub, off, ship } = t;
        if (!items.length) {
          $("#lines").innerHTML = `<p class="empty">Your cart is empty.<br><br><a class="btn" href="${ROOT}shop">Browse products</a></p>`;
        } else {
          $("#lines").innerHTML = items.map((i) => {
            const p = byId(i.id);
            return `<div class="cart-line">
              <img src="${img(p)}" alt="">
              <div>
                <a href="${R.productHref(p, ROOT)}" style="text-decoration:none;font-weight:600">${esc(p.name)}</a>
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
      const qr = (s) => { const q = qrcode(0, "M"); q.addData(s); q.make(); return q.createSvgTag({ cellSize: 5, margin: 2 }); };
      // plain-text order for the mailto fallback, used only when the order API can't be reached
      const mailto = (f, t, ref) => {
        const lines = cart.items().map((i) => `${i.qty} x ${byId(i.id).name} ${byId(i.id).size} @ ${money(byId(i.id).price)}`);
        const body = [
          `ORDER REQUEST ${ref}`, "", ...lines, "",
          `Subtotal: ${money(t.sub)}`, ...(t.off ? [`First-order discount: -${money(t.off)}`] : []), `Shipping: ${t.ship ? money(t.ship) : "Free"}`, `GST/HST (${t.prov}): ${money(t.tax)}`, `Total: ${money(t.total)} ${C.currency}`, "",
          `Name: ${f.get("name")}`, `Email: ${f.get("email")}`, `Address: ${f.get("address")}, ${f.get("city")}, ${f.get("province")} ${f.get("postal")}`,
          `Payment: ${f.get("pay")}`, "", "Purchaser confirms items are for laboratory research use only and that they are 18+."
        ].join("\n");
        return `mailto:${C.email}?subject=${encodeURIComponent(`Order request ${ref} – NXT Peptides Canada`)}&body=${encodeURIComponent(body)}`;
      };
      const form = $("#checkout"), btn = form.querySelector("[type=submit]"), btnText = btn.textContent;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (btn.disabled) return;
        btn.disabled = true;
        btn.textContent = "Placing order…";
        $("#order-error")?.remove();
        const f = new FormData(form), t = totals();
        let res, data = {};
        try {
          res = await fetch("/api/order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              items: cart.items(), name: f.get("name"), email: f.get("email"), address: f.get("address"), city: f.get("city"),
              province: f.get("province"), postal: f.get("postal"), pay: f.get("pay"), first: !!f.get("first"),
              confirm: !!f.get("confirm"), website: f.get("website") || ""
            })
          });
          data = await res.json().catch(() => ({}));
        } catch (err) { res = null; }
        if (!res || !res.ok || !data.ok) {
          // keep the cart; tell the customer what happened and offer email as a fallback
          btn.disabled = false;
          btn.textContent = btnText;
          const reachable = res && res.status >= 400 && res.status < 500 && data.error;
          btn.insertAdjacentHTML("beforebegin", `<div class="notice" id="order-error" role="alert">
            <p class="small" style="margin:0"><strong>Your order wasn't placed.</strong> ${esc(reachable ? data.error : "We couldn't reach our order system.")} Your cart is saved.</p>
            ${reachable ? "" : `<p class="small" style="margin:8px 0 0">Try again in a minute, or <a href="${mailto(f, t, "NXT-" + Date.now().toString(36).toUpperCase())}">email us your order</a> instead.</p>`}
          </div>`);
          return;
        }
        // ponytail: one fixed address per coin, payments matched to orders by amount; BTCPay Server gives per-order addresses + auto-confirm
        const { order, total, amount: amt, coin, wallet: addr } = data;
        const uri = coin === "BTC" && amt ? `bitcoin:${addr}?amount=${amt}` : addr;
        $(".summary").innerHTML = `
          <h3>Pay with ${esc(coin)}</h3>
          <p class="small muted" style="margin:0">Order <strong>${esc(order)}</strong> received</p>
          ${amt ? `<p class="inv-amt">${esc(amt)} ${esc(coin)}</p><p class="small muted" style="margin:0">= ${money(total)} ${C.currency} · rate held for <strong id="inv-timer">30:00</strong></p>`
            : `<p class="inv-amt">${money(total)} ${C.currency}</p><p class="small muted" style="margin:0">We'll email you the exact ${esc(coin)} amount.</p>`}
          ${addr ? `${typeof qrcode === "function" ? `<div class="inv-qr">${qr(uri)}</div>` : ""}
            <p class="small muted" style="margin:12px 0 4px">Send to this address${coin === "USDT" ? " (Ethereum network, ERC-20 only)" : ""}</p>
            <div class="inv-addr"><code>${esc(addr)}</code><button class="btn ghost" type="button" data-copy="${esc(addr)}">Copy</button></div>`
            : `<p class="small">We'll email you the ${esc(coin)} wallet address.</p>`}
          <p class="small">Send the exact amount shown. Your order ships once the payment confirms, and tracking is sent to ${esc(f.get("email"))}. Keep your order number <strong>${esc(order)}</strong> for any questions.</p>`;
        $("#lines").innerHTML = `<p class="empty">Thanks! Order <strong>${esc(order)}</strong> is waiting for payment.</p>`;
        cart.save([]);
        if (amt) {
          const end = Date.now() + 30 * 60e3;
          const tick = setInterval(() => {
            const s = Math.max(0, Math.round((end - Date.now()) / 1000));
            $("#inv-timer").textContent = s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "expired, message us for an updated amount";
            if (!s) clearInterval(tick);
          }, 1000);
        }
      });
      draw();
    },

    lab() {
      $("#lab-name").textContent = R.labName();
      fill($("#coa-rows"), R.coaRows(ROOT));
    }
  };

  /* ---------- boot ---------- */
  layout();
  if (C.whatsapp) document.body.insertAdjacentHTML("beforeend", `<a class="wa" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hi NXT Canada, I have a question.")}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>`);
  const mb = $(".menu-btn");
  mb.addEventListener("click", () => {
    const open = $(".nav-links").classList.toggle("open");
    mb.setAttribute("aria-expanded", open);
  });
  renderCount();
  if (pages[page]) pages[page]();

  /* newsletter signup: any <form data-subscribe> */
  document.querySelectorAll("form[data-subscribe]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const b = form.querySelector("button"), msg = form.querySelector("[data-msg]");
      b.disabled = true;
      const f = new FormData(form);
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: f.get("email"), website: f.get("website") || "", source: form.dataset.subscribe })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "");
        form.innerHTML = `<p style="margin:0" role="status">You're on the list. Tick "first order" at checkout to get ${C.firstOrderDiscount * 100}% off.</p>`;
      } catch (err) {
        b.disabled = false;
        msg.textContent = err.message || "Couldn't sign you up just now. Please try again.";
      }
    });
  });
  ageGate();
})();
