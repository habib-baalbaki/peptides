/*
 * NXT Peptides Canada: site config + catalogue.
 * Source: NXT_Catalogue_0426.pdf, with the copy errors noted in
 * research/canadian-peptide-competitors.md (section 0) fixed.
 *
 * Every value marked TODO must be confirmed before launch.
 */
window.NXT_CONFIG = {
  brand: "NXT Peptides Canada",
  tagline: "Canadian-based · Third-party tested by Janoshik · Bringing NXT to Canada",
  currency: "CAD",
  freeShippingThreshold: 300,
  firstOrderDiscount: 0.20,       // new customers, first order
  flatShipping: 15,               // TODO confirm (Canada Post Xpresspost)
  // GST/HST by province (federal GST only where a separate PST/QST applies). ponytail: hard-coded, check yearly
  taxRates: { AB: .05, BC: .05, MB: .05, NB: .15, NL: .15, NS: .14, NT: .05, NU: .05, ON: .13, PE: .15, QC: .05, SK: .05, YT: .05 },
  sameDayCutoff: "2 PM ET",       // TODO confirm
  ukLabName: "Janoshik Analytical (Prague, Czech Republic)", // third-party lab named on every COA; key name kept for compatibility
  email: "nxtcanada@outlook.com",
  phone: "+1 (780) 904-8085",
  facebook: "https://www.facebook.com/profile.php?id=61595629042973",
  whatsapp: "17809048085",       // digits only, used for wa.me links
  pricesArePlaceholders: false,
  domain: "nxtcanada.ca",
  indexNowKey: "80238307beff2ac9f597598b8294dc68", // public by design: served at /<key>.txt so Bing/IndexNow can verify ownership
  // Cloudflare Web Analytics is on with "Automatic setup": Cloudflare injects the beacon at the
  // edge, so leave this EMPTY (a token here would load the beacon twice and double-count).
  // Only paste the site token (Web Analytics > nxtcanada.ca > Manage site) and run
  // `npm run build` if automatic setup is ever turned off or the site moves off Cloudflare.
  cfAnalyticsToken: "",
  wallets: {
    BTC: "bc1qd5l8srh0v6vafaaxdha64chnt5s4w2fpejee0h",
    USDT: "0x7f4251a19B90Ffef55DF510f254A6ae7Daf8B2Fa", // same BitPay ETH address, ERC-20 only (no TRC-20)
    ETH: "0x7f4251a19B90Ffef55DF510f254A6ae7Daf8B2Fa"
  }
};

/*
 * Categories. slug/h1/title/desc/intro build the static landing page category/<slug>.html.
 * Research-model language only: no dosing, human use, or health/benefit claims.
 */
window.NXT_CATEGORIES = [
  { id: "repair", name: "Tissue & repair research", slug: "tissue-repair-research-peptides",
    h1: "Tissue & repair research peptides",
    title: "BPC-157, TB-500 & GHK-Cu Canada | Tissue Repair Peptides | NXT",
    desc: "BPC-157, TB-500 and GHK-Cu research peptides, shipped from Canada. Every batch independently tested by Janoshik Analytical (HPLC + MS). Prices in CAD.",
    intro: "<p>This range covers the peptides most often used in preclinical research on tissue repair: <strong>BPC-157</strong>, a synthetic pentadecapeptide studied in animal models of tendon, ligament and gastrointestinal injury; <strong>TB-500</strong>, synthetic thymosin beta-4, studied for its role in actin regulation and cell migration; and <strong>GHK-Cu</strong>, a copper-binding tripeptide investigated in wound-healing and extracellular-matrix models.</p><p>Every lot is tested by an independent laboratory (Janoshik Analytical) for purity (HPLC) and identity (mass spectrometry). The lot number printed on each vial matches the certificate of analysis on our <a href=\"{{ROOT}}lab-results.html\">lab results</a> page. Orders ship from Canada by tracked Xpresspost, with prices in CAD.</p>" },
  { id: "blends", name: "Research blends", slug: "research-peptide-blends",
    h1: "Research peptide blends",
    title: "BPC-157 + TB-500, GLOW & KLOW Canada | Peptide Blends | NXT",
    desc: "Pre-formulated research blends: BPC-157 + TB-500, GLOW and KLOW. Third-party tested, shipped across Canada with tracking. Prices in CAD.",
    intro: "<p>Blends combine several research peptides in a single lyophilized vial, so multi-compound studies start from one reconstitution rather than several. The range includes <strong>BPC-157 + TB-500</strong>, <strong>GLOW</strong> (GHK-Cu, BPC-157 and TB-500) and <strong>KLOW</strong> (GHK-Cu, KPV, BPC-157 and TB-500).</p><p>The amount of each component is listed on its product page. Like every NXT product, each blend lot is tested independently by Janoshik Analytical, and the lot number on the vial matches its published COA.</p>" },
  { id: "gh", name: "GH secretagogues", slug: "gh-secretagogue-peptides",
    h1: "GH secretagogue research peptides",
    title: "Ipamorelin & CJC-1295 Canada | GH Secretagogue Peptides | NXT",
    desc: "Ipamorelin, CJC-1295 + Ipamorelin, GHRP-6 and Tesamorelin for laboratory research. Janoshik-tested batches, shipped from Canada.",
    intro: "<p>Growth hormone secretagogues are peptides studied for how they act on the GH axis in laboratory models. They fall into two groups: ghrelin-receptor agonists (GHRPs) such as <strong>Ipamorelin</strong> and <strong>GHRP-6</strong>, and GHRH analogues such as <strong>CJC-1295</strong> and <strong>Tesamorelin</strong>. Researchers often study the two classes together, which is why CJC-1295 + Ipamorelin is offered as a blend.</p><p>Each lot is tested by an independent lab (Janoshik Analytical) for purity and identity before it ships from Canada. Match the lot number on your vial to its certificate on the <a href=\"{{ROOT}}lab-results.html\">lab results</a> page.</p>" },
  { id: "metabolic", name: "Metabolic research", slug: "metabolic-research-peptides",
    h1: "Metabolic research peptides",
    title: "Retatrutide Canada | Metabolic Research Peptides | NXT",
    desc: "Metabolic research peptides for laboratory use, independently tested by Janoshik Analytical and shipped across Canada. Prices in CAD.",
    intro: "<p>Peptides in this range are studied in laboratory models of metabolic and incretin-receptor signalling. They are supplied as lyophilized powder for research use only.</p><p>Each lot is independently tested by Janoshik Analytical by HPLC and mass spectrometry, and the certificate is matched to the lot number on the vial.</p>" },
  { id: "longevity", name: "Mitochondrial & longevity", slug: "mitochondrial-longevity-research-peptides",
    h1: "Mitochondrial & longevity research",
    title: "MOTS-c, SS-31 & NAD+ Canada | Mitochondrial Research | NXT",
    desc: "MOTS-c, SS-31 and NAD+ for mitochondrial and cellular-ageing research. Janoshik-tested lots, shipped from Canada with tracking.",
    intro: "<p>This range is aimed at research into mitochondrial function and cellular ageing. <strong>MOTS-c</strong> is a mitochondrial-derived peptide studied in models of metabolic regulation. <strong>SS-31</strong> (elamipretide) is a cardiolipin-targeting tetrapeptide investigated in models of mitochondrial dysfunction. <strong>NAD+</strong> is the coenzyme central to cellular redox and sirtuin research.</p><p>All lots are tested independently by Janoshik Analytical, and each certificate is published against the lot number on the vial.</p>" },
  { id: "neuro", name: "Neuropeptide research", slug: "neuropeptide-research",
    h1: "Neuropeptide research",
    title: "Selank, Semax & DSIP Canada | Neuropeptide Research | NXT",
    desc: "Selank, Semax and DSIP neuropeptides for laboratory research. Independently tested by Janoshik Analytical, shipped across Canada.",
    intro: "<p>This range covers peptides studied in neuroscience research models. <strong>Selank</strong> is a synthetic analogue of the immunomodulatory peptide tuftsin. <strong>Semax</strong> is a synthetic fragment derived from ACTH(4-10). <strong>DSIP</strong> (delta sleep-inducing peptide) is a nonapeptide first isolated in sleep research.</p><p>Each lot is independently tested by Janoshik Analytical for purity and identity, with the certificate matched to the vial's lot number.</p>" },
  { id: "hpg", name: "Melanocortin & HPG axis", slug: "melanocortin-hpg-axis-peptides",
    h1: "Melanocortin & HPG axis research",
    title: "PT-141 & Kisspeptin-10 Canada | Research Peptides | NXT",
    desc: "PT-141 (bremelanotide) and Kisspeptin-10 for laboratory research. Janoshik-tested lots, shipped from Canada. Prices in CAD.",
    intro: "<p>This range covers peptides used in research on melanocortin receptors and the hypothalamic-pituitary-gonadal (HPG) axis. <strong>PT-141</strong> (bremelanotide) is a melanocortin-receptor agonist. <strong>Kisspeptin-10</strong> is the shortest active fragment of kisspeptin, studied for its role upstream of GnRH signalling.</p><p>Every lot is independently tested by Janoshik Analytical, and each certificate is published against the lot number on the vial.</p>" },
  { id: "supplies", name: "Lab supplies", slug: "lab-supplies",
    h1: "Lab supplies",
    title: "Bacteriostatic Water Canada | Lab Supplies | NXT",
    desc: "Bacteriostatic water for reconstituting lyophilized research peptides. Free 3 mL vial with every NXT Canada delivery.",
    intro: "<p>Supplies for reconstituting lyophilized research peptides. Bacteriostatic water is sterile water with 0.9% benzyl alcohol as a preservative, which allows a vial to be used more than once in the lab. A 3 mL vial is included free with every order.</p>" }
];

/* price: CAD, from the NXT Canada full product menu. img: optional, falls back to a plain vial. */
window.NXT_PRODUCTS = [
  { id: "bpc157", name: "BPC-157", size: "10 mg", price: 60, cat: "repair", cap: "#2f7fd8", img: "bpc157.jpg", best: true,
    tagline: "Synthetic pentadecapeptide",
    desc: "BPC-157 is a synthetic fragment of a gastric protective protein, investigated in animal models for roles in tissue repair, angiogenesis and protection of the gastrointestinal lining. It has been studied extensively in preclinical work on tendon-to-bone repair and musculoskeletal regeneration." },
  { id: "tb500", name: "TB-500", size: "10 mg", price: 75, cat: "repair", cap: "#8a1f4c", img: "tb500.jpg",
    tagline: "Synthetic thymosin beta-4",
    desc: "TB-500 is synthetic thymosin beta-4, a 43-amino-acid peptide involved in actin regulation and cell migration. It is studied in experimental models of wound healing, angiogenesis, and recovery from muscle and cardiac injury." },
  { id: "bpc157-tb500", name: "BPC-157 + TB-500", size: "10 mg", price: 70, cat: "blends", cap: "#6b6f76", img: "bpc157-tb500.jpg", best: true,
    tagline: "Two-peptide blend",
    desc: "A pre-formulated combination of BPC-157 and TB-500 for laboratory research into regenerative and repair pathways. BPC-157 is investigated for tissue and gastrointestinal protection in animal models; TB-500 is a thymosin beta-4-derived peptide studied for actin regulation and cell migration." },
  { id: "glow", name: "GLOW", size: "70 mg", price: 100, cat: "blends", cap: "#6a3fb5", img: "glow.jpg", best: true,
    tagline: "GHK-Cu 50 mg + BPC-157 10 mg + TB-500 10 mg",
    desc: "GLOW is a pre-formulated research blend combining GHK-Cu (50 mg), BPC-157 (10 mg) and TB-500 (10 mg), studied for complementary effects on tissue regeneration, collagen synthesis, angiogenesis and inflammation control. GHK-Cu is studied for dermal remodelling and extracellular-matrix signalling; BPC-157 for gastro-protective and soft-tissue repair pathways; TB-500 for cell migration through actin sequestration." },
  { id: "klow", name: "KLOW", size: "80 mg", price: 80, cat: "blends", cap: "#2e9a6b", img: "klow.jpg", best: true,
    tagline: "GHK-Cu 50 mg + KPV 10 mg + BPC-157 10 mg + TB-500 10 mg",
    desc: "KLOW is a four-peptide research formulation containing GHK-Cu (50 mg), KPV (10 mg), BPC-157 (10 mg) and TB-500 (10 mg). It targets complementary pathways in preclinical models: GHK-Cu for collagen production and gene-expression modulation; KPV for alpha-MSH-fragment anti-inflammatory signalling; BPC-157 for tissue repair and nitric-oxide-mediated pathways; TB-500 for cell migration and angiogenic coordination." },
  { id: "ghk-cu", name: "GHK-Cu", size: "50 mg", price: 30, cat: "repair", cap: "#c0392b", img: "ghk-cu.jpg",
    tagline: "Copper-binding tripeptide",
    desc: "GHK-Cu is a naturally occurring copper-binding tripeptide studied extensively for skin regeneration, wound healing, collagen synthesis, and modulation of gene expression related to tissue repair and extracellular-matrix remodelling." },
  { id: "cjc1295-ipamorelin", name: "CJC-1295 + Ipamorelin", size: "10 mg", price: 70, cat: "gh", cap: "#c0392b", img: "cjc1295-ipamorelin.jpg",
    tagline: "GHRH analogue + ghrelin-receptor agonist",
    desc: "A blend of CJC-1295 (no DAC), a modified analogue of growth-hormone-releasing hormone (GHRH 1-29), and Ipamorelin, a selective ghrelin-receptor agonist. The pairing is studied in research models for its combined effect on pulsatile growth-hormone release via two complementary receptor pathways." },
  { id: "ipamorelin", name: "Ipamorelin", size: "5 mg", price: 60, cat: "gh", cap: "#4f7a99", img: "ipamorelin.jpg",
    tagline: "Selective GH secretagogue",
    desc: "Ipamorelin is a selective growth-hormone-releasing peptide that activates the ghrelin receptor. It is studied for pulsatile growth-hormone release with relatively limited effects on cortisol and prolactin compared with earlier GHRPs." },
  { id: "ghrp6", name: "GHRP-6", size: "10 mg", price: 60, cat: "gh", cap: "#2a8c8c", img: "ghrp6.jpg",
    tagline: "Ghrelin-receptor agonist hexapeptide",
    desc: "GHRP-6 is a ghrelin-receptor agonist and one of the earliest growth-hormone secretagogues. It is frequently used in studies of muscle anabolism, gastric motility and cachexia models." },
  { id: "tesamorelin", name: "Tesamorelin", size: "5 mg", price: 70, cat: "gh", cap: "#8cc63f", img: "tesamorelin.jpg",
    tagline: "Stabilized GHRH analogue",
    desc: "Tesamorelin is a stabilized growth-hormone-releasing-hormone analogue, investigated in research settings for effects on visceral adipose tissue and metabolic markers." },
  { id: "retatrutide", name: "R3taa", size: "20 mg", price: 150, cat: "metabolic", cap: "#5aa9e6", img: "retatrutide.jpg",
    tagline: "GLP-1 / GIP / glucagon triple agonist",
    desc: "Retatrutide is a next-generation triple agonist of the GLP-1, GIP and glucagon receptors, researched for metabolic modulation. It is studied for effects on energy expenditure, glucose homeostasis and body-weight regulation in incretin-based research." },
  { id: "mots-c", name: "MOTS-c", size: "10 mg", price: 65, cat: "longevity", cap: "#c9ccd1", img: "mots-c.jpg",
    tagline: "Mitochondrial-derived peptide",
    desc: "MOTS-c is a mitochondrial-derived peptide encoded by mitochondrial DNA, studied for effects on insulin sensitivity, exercise capacity and cellular stress resistance in metabolic-disease and aging research models." },
  { id: "ss31", name: "SS-31", size: "10 mg", price: 70, cat: "longevity", cap: "#c9ccd1", img: "ss31.jpg",
    tagline: "Mitochondria-targeting tetrapeptide",
    desc: "SS-31 (elamipretide) is a mitochondria-targeting tetrapeptide that binds cardiolipin. It is investigated for mitochondrial function and bioenergetics, and for protecting tissue from ischemia-reperfusion injury in cardiac and metabolic research." },
  { id: "nad", name: "NAD+", size: "500 mg", price: 65, cat: "longevity", cap: "#c9ccd1", img: "nad.jpg",
    tagline: "Redox coenzyme",
    desc: "NAD+ (nicotinamide adenine dinucleotide) is an essential coenzyme in redox reactions and a substrate for sirtuin and PARP enzymes. It is central to research on cellular energy metabolism, aging and DNA-repair pathways." },
  { id: "pt141", name: "PT-141", size: "10 mg", price: 65, cat: "hpg", cap: "#e58fa6", img: "pt141.jpg",
    tagline: "Melanocortin-receptor agonist",
    desc: "PT-141 (bremelanotide) is a cyclic heptapeptide melanocortin-receptor agonist derived from alpha-MSH. It is studied for central melanocortin-4-receptor (MC4R) signalling and its effects on behavioural pathways in research models." },
  { id: "kisspeptin10", name: "Kisspeptin-10", size: "10 mg", price: 70, cat: "hpg", cap: "#2a8c8c", img: "kisspeptin10.jpg",
    tagline: "KISS1R agonist",
    desc: "Kisspeptin-10 is a truncated member of the kisspeptin family that potently stimulates the hypothalamic-pituitary-gonadal (HPG) axis through KISS1R activation. Research shows it stimulates GnRH secretion from the hypothalamus, with downstream increases in LH, FSH and sex-steroid production." },
  { id: "ghk-cu-100", name: "GHK-Cu", size: "100 mg", price: 55, cat: "repair", cap: "#c0392b", img: "ghk-cu-100.jpg",
    tagline: "Copper-binding tripeptide",
    desc: "GHK-Cu is a naturally occurring copper-binding tripeptide studied extensively for skin regeneration, wound healing, collagen synthesis, and modulation of gene expression related to tissue repair and extracellular-matrix remodelling." },
  { id: "retatrutide-40", name: "R3taa", size: "40 mg", price: 200, cat: "metabolic", cap: "#5aa9e6", img: "retatrutide-40.jpg",
    tagline: "GLP-1 / GIP / glucagon triple agonist",
    desc: "Retatrutide is a next-generation triple agonist of the GLP-1, GIP and glucagon receptors, researched for metabolic modulation. It is studied for effects on energy expenditure, glucose homeostasis and body-weight regulation in incretin-based research." },
  { id: "dsip", name: "DSIP", size: "5 mg", price: 60, cat: "neuro", cap: "#7b3fa0",
    tagline: "Delta sleep-inducing peptide",
    desc: "DSIP is a naturally occurring nonapeptide first isolated from rabbit brain during slow-wave sleep. It is studied in research models for effects on sleep architecture, stress-hormone regulation and neuroendocrine signalling." },
  { id: "selank", name: "Selank", size: "10 mg", price: 60, cat: "neuro", cap: "#c46a9c",
    tagline: "Synthetic tuftsin analogue",
    desc: "Selank is a synthetic heptapeptide analogue of the immunomodulatory peptide tuftsin. It is investigated in preclinical research for anxiolytic-like activity, modulation of GABAergic signalling and effects on BDNF expression." },
  { id: "semax", name: "Semax", size: "10 mg", price: 50, cat: "neuro", cap: "#3d7fbf",
    tagline: "ACTH(4-10) analogue",
    desc: "Semax is a synthetic heptapeptide derived from the ACTH(4-10) fragment. It is studied in research models for neurotrophic effects, including BDNF and NGF expression, and for neuroprotection in ischemia models." },
  { id: "bac-water", name: "Bacteriostatic Water", size: "3 mL", price: 0, cat: "supplies", cap: "#5aa9e6", img: "bac-water.jpg",
    tagline: "Free with every delivery",
    desc: "Sterile water containing a small amount of preservative (typically 0.9% benzyl alcohol), supplied for multi-use laboratory reconstitution of lyophilized peptides in research settings." }
];

/*
 * Published certificates of analysis (Janoshik Analytical, verify.janoshik.com).
 * Only list a COA here when the measured amount matches the vial size we sell.
 * Not listed (amount does not match our listing, checked 2026-11-09):
 *   BPC-157 #136713 5.34 mg, TB-500 #136721 5.35 mg (5 mg vials; we sell 10 mg),
 *   GHK-Cu #136717 34.88 mg GHK + 1.43 mg Cu (we sell 50/100 mg), Retatrutide #136720 27.45 mg (we sell 20/40 mg).
 */
window.NXT_COAS = {
  glow: { task: "136712", path: "136712-GLOW_1ZQG6ZWA5UEH", lot: "XN2601HYP", date: "2026-04-27", result: "GHK 46.28 mg · BPC-157 11.15 mg · TB-500 10.72 mg" },
  klow: { task: "136715", path: "136715-KLOW_96UU1FQXN2S8", lot: "XN2601HYP", date: "2026-04-27", result: "GHK 47.23 mg · BPC-157 11.24 mg · TB-500 11.05 mg · KPV 10.64 mg" },
  "cjc1295-ipamorelin": { task: "136714", path: "136714-CJC1295_mod_GRF_129_8FXZ38JBFWFK", lot: "XN2601HYP", date: "2026-04-27", result: "CJC-1295 no DAC (mod GRF 1-29) 5.22 mg · Ipamorelin 5.10 mg" },
  kisspeptin10: { task: "136716", path: "136716-Kisspeptin_5YA55QZPY87T", lot: "XN2601HYP", date: "2026-04-27", result: "11.22 mg · purity 99.929%" },
  ipamorelin: { task: "136718", path: "136718-Ipamorelin_9VDHPE9D39FU", lot: "XN2601HYP", date: "2026-04-27", result: "5.34 mg · purity 99.788%" },
  pt141: { task: "136719", path: "136719-PT141_JMCKIBSD38YA", lot: "XN2601HYP", date: "2026-04-27", result: "10.82 mg · purity 99.838%" },
  ghrp6: { task: "136722", path: "136722-GHRP6_73F4WZEYBUCV", lot: "XN2601HYP", date: "2026-04-27", result: "10.60 mg · purity 99.047%" }
};
