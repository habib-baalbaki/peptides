/*
 * Science content batch: growth-hormone secretagogues (cjc1295-ipamorelin, ipamorelin; ghrp6 and tesamorelin later).
 * Merged into content/science.mjs; same rules as that file (PubChem CIDs, real PMIDs, preclinical language only).
 *
 * CJC-1295 in our blend is the no-DAC form (Janoshik #136714: "CJC-1295 no DAC (mod GRF 1-29) 5.22 mg").
 * PubChem's main "CJC-1295" record (CID 91971820, C165H269N47O46, 3647.2) is the DAC form, so it is NOT used here.
 */
import { P_STATUS, storageQ, testingQ, statusQ } from "./science-shared.mjs";

export const REFS = {
  raun1998: { pmid: "9849822", doi: "10.1530/eje.0.1390552",
    cite: "Raun K, Hansen BS, Johansen NL, et al. Ipamorelin, the first selective growth hormone secretagogue. Eur J Endocrinol. 1998." },
  jette2005: { pmid: "15817669", doi: "10.1210/en.2004-1286",
    cite: "Jetté L, Léger R, Thibaudeau K, et al. Human growth hormone-releasing factor (hGRF)1-29-albumin bioconjugates activate the GRF receptor on the anterior pituitary in rats: identification of CJC-1295 as a long-lasting GRF analog. Endocrinology. 2005." }
};

export const COMPOUNDS = {
  // PubChem CID 56841945 (CAS 863288-34-0): YaDAIFTQSYRKVLAQLSARKLLQDILSR-NH2, i.e. GHRH(1-29) with D-Ala2, Gln8, Ala15, Leu27
  modgrf: {
    name: "CJC-1295 (no DAC)",
    rows: [
      ["Also known as", "Mod GRF 1-29, modified GRF (1-29), tetrasubstituted GRF (1-29)"],
      ["Sequence", "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-NH<sub>2</sub>"],
      ["Length", "29 amino acids, C-terminal amide; substitutions D-Ala2, Gln8, Ala15, Leu27 versus GHRH(1-29)"],
      ["DAC", "None (no maleimidopropionyl-lysine albumin linker)"],
      ["Molecular formula", "C<sub>152</sub>H<sub>252</sub>N<sub>44</sub>O<sub>42</sub>"],
      ["Molecular weight", "3367.9 g/mol"],
      ["CAS number", "863288-34-0"]
    ],
    cas: "863288-34-0", mw: "3367.9", cid: "56841945"
  },
  ipamorelin: {
    name: "Ipamorelin",
    rows: [
      ["Sequence", "Aib-His-D-2-Nal-D-Phe-Lys-NH<sub>2</sub> (Aib = α-aminoisobutyric acid, 2-Nal = 2-naphthylalanine)"],
      ["Length", "5 residues (pentapeptide), C-terminal amide"],
      ["Molecular formula", "C<sub>38</sub>H<sub>49</sub>N<sub>9</sub>O<sub>5</sub>"],
      ["Molecular weight", "711.9 g/mol"],
      ["CAS number", "170851-70-4"]
    ],
    cas: "170851-70-4", mw: "711.9", cid: "9831659"
  }
};

const P_MODGRF = "<strong>CJC-1295 (no DAC)</strong>, also called Mod GRF 1-29, is the first 29 amino acids of growth-hormone-releasing hormone (GHRH) with four amino-acid substitutions (D-Ala2, Gln8, Ala15, Leu27) intended to slow its enzymatic breakdown. It acts at the GHRH receptor of the anterior pituitary. The name CJC-1295 was first given to this tetrasubstituted peptide with an added maleimido-lysine linker, the Drug Affinity Complex (DAC), which binds serum albumin; in rats that DAC form remained in plasma beyond 72 hours [ref:jette2005]. The peptide supplied here has no DAC linker.";
const P_IPA = "<strong>Ipamorelin</strong> is a synthetic pentapeptide growth-hormone secretagogue (Aib-His-D-2-Nal-D-Phe-Lys-NH<sub>2</sub>) that acts at the GH secretagogue (ghrelin) receptor. In its original pharmacology study it released growth hormone from rat pituitary cells, and in rats and swine, with potency similar to GHRP-6. Unlike GHRP-6 and GHRP-2, it did not raise ACTH or cortisol in swine above the levels seen with GHRH, which is why it was described as the first selective GH secretagogue [ref:raun1998].";
const P_PAIR = "The two peptides act through different receptors: CJC-1295 (no DAC) at the GHRH receptor and Ipamorelin at the GH secretagogue receptor. Research designs that examine both pathways together use them in combination.";

export const PRODUCTS = {
  "cjc1295-ipamorelin": {
    compounds: [["modgrf", "5 mg"], ["ipamorelin", "5 mg"]],
    composition: "CJC-1295 no DAC (Mod GRF 1-29) 5 mg + Ipamorelin 5 mg (10 mg total)",
    overview: [P_MODGRF, P_IPA, P_PAIR, P_STATUS],
    faq: [
      { q: "What is in the CJC-1295 + Ipamorelin vial?", a: "CJC-1295 without DAC (Mod GRF 1-29), 5 mg, and Ipamorelin, 5 mg, in one 10 mg lyophilized vial. For lot XN2601HYP, Janoshik Analytical measured 5.22 mg and 5.10 mg." },
      { q: "What is the difference between CJC-1295 with DAC and without DAC?", a: "Both share the same modified 29-amino-acid GHRH sequence. The DAC (Drug Affinity Complex) version adds a lysine carrying a maleimidopropionyl group that binds albumin in blood, which kept it in circulation beyond 72 hours in rats. This vial contains the version without DAC (3367.9 g/mol); the DAC version is about 3647 g/mol." },
      { q: "Is CJC-1295 without DAC the same as Mod GRF 1-29?", a: "Yes. Mod GRF 1-29, modified GRF (1-29), tetrasubstituted GRF (1-29) and CJC-1295 without DAC are names for the same peptide (CAS 863288-34-0, PubChem CID 56841945)." },
      { q: "Why are CJC-1295 and Ipamorelin combined?", a: "They act on two different receptors: CJC-1295 (no DAC) on the GHRH receptor and Ipamorelin on the GH secretagogue (ghrelin) receptor. The blend is supplied for research designs that study both pathways together." },
      testingQ("CJC-1295 + Ipamorelin"), storageQ("CJC-1295 + Ipamorelin"), statusQ("CJC-1295 + Ipamorelin")
    ]
  },
  ipamorelin: {
    compounds: [["ipamorelin", "5 mg"]],
    overview: [P_IPA, P_STATUS],
    faq: [
      { q: "What is Ipamorelin?", a: "Ipamorelin is a synthetic pentapeptide (Aib-His-D-2-Nal-D-Phe-Lys-NH2) that acts as a growth-hormone secretagogue at the ghrelin receptor. It was first described by Novo Nordisk researchers in 1998." },
      { q: "What is the molecular weight of Ipamorelin?", a: "711.9 g/mol. Its molecular formula is C38H49N9O5 and its CAS number is 170851-70-4 (PubChem CID 9831659)." },
      { q: "How is Ipamorelin different from GHRP-6?", a: "Both release growth hormone through the same receptor with similar potency in rat and swine studies. In swine, GHRP-6 and GHRP-2 also raised ACTH and cortisol, while ipamorelin did not raise them above the levels seen with GHRH. That selectivity is why it is called the first selective GH secretagogue." },
      { q: "What is the difference between this vial and CJC-1295 + Ipamorelin?", a: "This vial contains 5 mg of Ipamorelin only. The CJC-1295 + Ipamorelin vial combines 5 mg of Ipamorelin with 5 mg of CJC-1295 without DAC (Mod GRF 1-29)." },
      testingQ("Ipamorelin"), storageQ("Ipamorelin"), statusQ("Ipamorelin")
    ]
  }
};
