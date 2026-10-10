# NXT Peptides Canada: website

A static storefront built from `research/canadian-peptide-competitors.md` (Section 0 positioning, Section 3 blueprint) and `NXT_Catalogue_0426.pdf`.

**Positioning used across the site:** Canadian-based · UK-tested & validated · Bringing NXT to Canada. The site never claims "Made in Canada".

## Run it

No build step. Serve the folder with any static server:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home: hero, trust strip, best sellers, shop by research area, how it works, newsletter |
| `shop.html` | Catalogue with search, research-area filters and sorting (`?cat=blends`, etc.) |
| `product.html?id=…` | Product page: quantity, add to cart, specs, UK COA block, related items |
| `cart.html` | Cart with free-shipping progress and an order-request checkout |
| `lab-results.html` | UK lab results / COA table |
| `about.html`, `faq.html`, `contact.html`, `policies.html` | Content pages |
| `assets/js/data.js` | **Edit this file** to change site config and the 17 catalogue products |
| `assets/js/site.js` | Shared header/footer, 18+ age gate, cart (localStorage), page renderers |
| `assets/css/style.css` | Styles |
| `assets/img/` | Vial images cropped from the catalogue PDF |

## Before launch checklist

Everything marked `TODO` in `assets/js/data.js`:

- [ ] **Prices.** Current prices are placeholders near the Canadian market median. Enter real prices, then set `pricesArePlaceholders: false` to remove the yellow preview bar.
- [ ] **UK lab name** (`ukLabName`), plus a COA PDF for each batch on the Lab Results page and the product pages.
- [ ] Free-shipping threshold, flat shipping rate and same-day cutoff time.
- [ ] Real email address on your own domain, a Canadian phone number, and the official domain.
- [ ] **Checkout.** The current flow emails an order request (`mailto:`) and asks for Interac e-Transfer. Replace it with a real checkout (Shopify or WooCommerce, with a processor that accepts this category) before taking real orders.
- [ ] **French version.** Québec's Charter of the French Language (Bill 96) requires French on commercial websites.
- [ ] Confirm stock is held in and shipped from Canada. The site says "Shipped within Canada by Xpresspost".
- [ ] Get written authorization from NXT to present yourselves as NXT in Canada.
- [ ] Newsletter and contact forms are front-end only. Connect them to an email tool (e.g. Klaviyo or Mailchimp) or a form handler.
- [ ] Real product photography. The current images are cropped from the PDF.
- [ ] **Legal review** of all copy and policies by a Canadian health/regulatory lawyer. Health Canada's April 2026 advisory says "research use only" labels don't make unauthorized peptides legal to sell, and most of this catalogue is on its seized-products list (see the research doc).

## Deliberately left out

- **Reconstitution / "peptide calculator".** Competitors use one, but it works out injection draw volumes, which reads as human-use dosing guidance. That conflicts with the research-only positioning and would add regulatory risk.
- **Dosing, protocols and health or weight-loss claims.** Product copy uses research-model language only.
