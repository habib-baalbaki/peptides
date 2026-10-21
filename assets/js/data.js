/*
 * NXT Peptides Canada: site config + catalogue.
 * Source: NXT_Catalogue_0426.pdf, with the copy errors noted in
 * research/canadian-peptide-competitors.md (section 0) fixed.
 *
 * Every value marked TODO must be confirmed before launch.
 */
window.NXT_CONFIG = {
  brand: "NXT Peptides Canada",
  tagline: "Canadian-based · UK-tested & validated · Bringing NXT to Canada",
  currency: "CAD",
  freeShippingThreshold: 300,
  firstOrderDiscount: 0.20,       // new customers, first order
  flatShipping: 15,               // TODO confirm (Canada Post Xpresspost)
  sameDayCutoff: "2 PM ET",       // TODO confirm
  ukLabName: "",                  // TODO name of the UK testing lab, e.g. "XYZ Analytical Ltd (UK)"
  email: "orders@example.ca",     // TODO real address on own domain
  phone: "",                      // TODO Canadian phone number
  pricesArePlaceholders: false,
  domain: "nxtpeptides.ca",       // TODO the one official domain
  // TODO paste your receiving addresses. Empty = we email the address after the order.
  wallets: {
    BTC: "",                      // bc1...
    USDT: "",                     // state the network too, e.g. "T... (TRC-20)"
    ETH: ""                       // 0x...
  }
};

window.NXT_CATEGORIES = [
  { id: "repair",    name: "Tissue & repair research" },
  { id: "blends",    name: "Research blends" },
  { id: "gh",        name: "GH secretagogues" },
  { id: "metabolic", name: "Metabolic research" },
  { id: "longevity", name: "Mitochondrial & longevity" },
  { id: "neuro",     name: "Neuropeptide research" },
  { id: "hpg",       name: "Melanocortin & HPG axis" },
  { id: "supplies",  name: "Lab supplies" }
];

/* price: CAD, from the NXT Canada full product menu. img: optional, falls back to a plain vial. */
window.NXT_PRODUCTS = [
  { id: "bpc157", name: "BPC-157", size: "10 mg", price: 60, cat: "repair", cap: "#2f7fd8", img: "bpc157.jpg", best: true,
    tagline: "Synthetic pentadecapeptide",
    desc: "BPC-157 is a synthetic fragment of a gastric protective protein, investigated in animal models for roles in tissue repair, angiogenesis and protection of the gastrointestinal lining. It has been studied extensively in preclinical work on tendon-to-bone repair and musculoskeletal regeneration." },
  { id: "tb500", name: "TB-500", size: "10 mg", price: 75, cat: "repair", cap: "#8a1f4c", img: "tb500.jpg",
    tagline: "Thymosin beta-4 fragment",
    desc: "TB-500 is a research fragment of thymosin beta-4, involved in actin regulation and cell migration. It is studied in experimental models of wound healing, angiogenesis, and recovery from muscle and cardiac injury." },
  { id: "bpc157-tb500", name: "BPC-157 + TB-500", size: "10 mg", price: 70, cat: "blends", cap: "#6b6f76", img: "bpc157-tb500.jpg", best: true,
    tagline: "Two-peptide blend",
    desc: "A pre-formulated combination of BPC-157 and TB-500 for laboratory research into regenerative and repair pathways. BPC-157 is investigated for tissue and gastrointestinal protection in animal models; TB-500 is a thymosin beta-4 fragment studied for actin regulation and cell migration." },
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
  { id: "retatrutide", name: "Retatrutide (RETA)", size: "20 mg", price: 150, cat: "metabolic", cap: "#5aa9e6", img: "retatrutide.jpg",
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
  { id: "ghk-cu-100", name: "GHK-Cu", size: "100 mg", price: 55, cat: "repair", cap: "#c0392b", img: "ghk-cu.jpg",
    tagline: "Copper-binding tripeptide",
    desc: "GHK-Cu is a naturally occurring copper-binding tripeptide studied extensively for skin regeneration, wound healing, collagen synthesis, and modulation of gene expression related to tissue repair and extracellular-matrix remodelling." },
  { id: "retatrutide-40", name: "Retatrutide (RETA)", size: "40 mg", price: 170, cat: "metabolic", cap: "#5aa9e6", img: "retatrutide.jpg",
    tagline: "GLP-1 / GIP / glucagon triple agonist",
    desc: "Retatrutide is a next-generation triple agonist of the GLP-1, GIP and glucagon receptors, researched for metabolic modulation. It is studied for effects on energy expenditure, glucose homeostasis and body-weight regulation in incretin-based research." },
  { id: "dsip", name: "DSIP", size: "5 mg", price: 60, cat: "neuro", cap: "#7b3fa0",
    tagline: "Delta sleep-inducing peptide",
    desc: "DSIP is a naturally occurring nonapeptide first isolated from rabbit brain during slow-wave sleep. It is studied in research models for effects on sleep architecture, stress-hormone regulation and neuroendocrine signalling." },
  { id: "selank", name: "Selank", size: "10 mg", price: 60, cat: "neuro", cap: "#c46a9c",
    tagline: "Synthetic tuftsin analogue",
    desc: "Selank is a synthetic heptapeptide analogue of the immunomodulatory peptide tuftsin. It is investigated in preclinical research for anxiolytic-like activity, modulation of GABAergic signalling and effects on BDNF expression." },
  { id: "semax", name: "Semax", size: "10 mg", price: 30, cat: "neuro", cap: "#3d7fbf",
    tagline: "ACTH(4-10) analogue",
    desc: "Semax is a synthetic heptapeptide derived from the ACTH(4-10) fragment. It is studied in research models for neurotrophic effects, including BDNF and NGF expression, and for neuroprotection in ischemia models." },
  { id: "bac-water", name: "Bacteriostatic Water", size: "3 mL", price: 0, cat: "supplies", cap: "#5aa9e6", img: "bac-water.jpg",
    tagline: "Free with every delivery",
    desc: "Sterile water containing a small amount of preservative (typically 0.9% benzyl alcohol), supplied for multi-use laboratory reconstitution of lyophilized peptides in research settings." }
];
