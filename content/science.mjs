/*
 * Product science content: chemical specs, research overview with citations, product FAQ.
 * Read by scripts/build.mjs only (rendered into products/<id>.html), never loaded by the browser.
 *
 * Rules for anything added here:
 * - Every number comes from PubChem (cite the CID); every citation is a real PubMed record (cite the PMID).
 * - Preclinical language only: "studied in", "investigated in animal models". No human benefit claims,
 *   no dosing, no reconstitution or administration instructions.
 * - A compound with pending: true shows no chemistry until its identity is confirmed against the supplier COA.
 */

export const REFS = {
  seiwerth2018: { pmid: "29998800", doi: "10.2174/1381612824666180712110447",
    cite: "Seiwerth S, Rucman R, Turkovic B, et al. BPC 157 and standard angiogenic growth factors. Gastrointestinal tract healing, lessons from tendon, ligament, muscle and bone healing. Curr Pharm Des. 2018." },
  gwyer2019: { pmid: "30915550", doi: "10.1007/s00441-019-03016-8",
    cite: "Gwyer D, Wragg NM, Wilson SL. Gastric pentadecapeptide body protection compound BPC 157 and its role in accelerating musculoskeletal soft tissue healing. Cell Tissue Res. 2019." },
  vasireddi2025: { pmid: "40756949", doi: "10.1177/15563316251355551",
    cite: "Vasireddi N, Hahamyan H, Salata MJ, et al. Emerging use of BPC-157 in orthopaedic sports medicine: a systematic review. HSS J. 2025." },
  goldstein2012: { pmid: "22074294", doi: "10.1517/14712598.2012.634793",
    cite: "Goldstein AL, Hannappel E, Sosne G, Kleinman HK. Thymosin β4: a multi-functional regenerative peptide. Basic properties and clinical applications. Expert Opin Biol Ther. 2012." },
  pickart2018: { pmid: "29986520", doi: "10.3390/ijms19071987",
    cite: "Pickart L, Margolina A. Regenerative and protective actions of the GHK-Cu peptide in the light of the new gene data. Int J Mol Sci. 2018." },
  dalmasso2008: { pmid: "18061177", doi: "10.1053/j.gastro.2007.10.026",
    cite: "Dalmasso G, Charrier-Hisamuddin L, Nguyen HT, et al. PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation. Gastroenterology. 2008." }
};

export const COMPOUNDS = {
  bpc157: {
    name: "BPC-157",
    rows: [
      ["Sequence", "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val (GEPPPGKPADDAGLV)"],
      ["Length", "15 amino acids"],
      ["Molecular formula", "C<sub>62</sub>H<sub>98</sub>N<sub>16</sub>O<sub>22</sub>"],
      ["Molecular weight", "1419.5 g/mol"],
      ["CAS number", "137525-51-0"]
    ],
    cas: "137525-51-0", mw: "1419.5", cid: "9941957"
  },
  tb500: {
    name: "TB-500",
    // Our TB-500 is full-length thymosin beta-4: Janoshik test #136721 (batch XN2601HYP) identifies the
    // sample as "TB-500 (TB4)". Sequence: UniProt P62328 (chain 2-44, N-acetylserine).
    // Not PubChem's "TB-500" entry (CID 62707662), which is the Ac-LKKTETQ fragment, MW 889.0.
    rows: [
      ["Identity", "Thymosin β4 (Tβ4), full length; INN timbetasin"],
      ["Sequence", "Ac-SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES"],
      ["Length", "43 amino acids, N-terminal acetylation"],
      ["Molecular formula", "C<sub>212</sub>H<sub>350</sub>N<sub>56</sub>O<sub>78</sub>S"],
      ["Molecular weight", "≈ 4963 g/mol"],
      ["CAS number", "77591-33-4"]
    ],
    cas: "77591-33-4", mw: "4963", cid: "16132341"
  },
  ghkcu: {
    name: "GHK-Cu",
    rows: [
      ["Peptide", "Gly-His-Lys (GHK), glycyl-L-histidyl-L-lysine"],
      ["Form", "1:1 copper(II) complex"],
      ["Peptide formula", "C<sub>14</sub>H<sub>24</sub>N<sub>6</sub>O<sub>4</sub> (340.4 g/mol, before copper binding)"],
      ["Complex molecular weight", "≈ 402.9 g/mol"],
      ["CAS number", "89030-95-5 (GHK-Cu); the free peptide GHK is 49557-75-7"]
    ],
    cas: "89030-95-5", mw: "402.9", cid: "71587328"
  },
  kpv: {
    name: "KPV",
    rows: [
      ["Sequence", "Lys-Pro-Val (KPV), the C-terminal tripeptide of α-MSH"],
      ["Molecular formula", "C<sub>16</sub>H<sub>30</sub>N<sub>4</sub>O<sub>4</sub>"],
      ["Molecular weight", "342.4 g/mol"],
      ["CAS number", "67727-97-3"]
    ],
    cas: "67727-97-3", mw: "342.4", cid: "125672"
  }
};

// Reusable overview paragraphs. [ref:key] becomes a numbered citation link.
const P_BPC = "<strong>BPC-157</strong> is a 15-amino-acid synthetic peptide whose sequence is taken from a larger protein (body protection compound) isolated from gastric juice. Most of the published work is in rodent models of gastrointestinal, tendon, ligament, muscle and bone injury, where it has been studied alongside angiogenic growth-factor signalling [ref:seiwerth2018] [ref:gwyer2019]. A 2025 systematic review found 36 eligible studies, 35 of them preclinical and one clinical, and no clinical safety data [ref:vasireddi2025].";
const P_TB = "<strong>TB-500</strong> is the research-supply name for synthetic thymosin β4 (Tβ4), a 43-amino-acid peptide present in most cells that binds and sequesters G-actin. The name is also used elsewhere for a short Tβ4 fragment; ours is the full-length peptide, identified by independent lab analysis. Tβ4 has been investigated in experimental models of wound repair, angiogenesis, and corneal and cardiac injury [ref:goldstein2012].";
const P_GHK = "<strong>GHK-Cu</strong> is the copper(II) complex of the tripeptide Gly-His-Lys, first identified in human plasma. Cell-culture and animal wound-model studies have examined it in relation to collagen and extracellular-matrix synthesis, and gene-expression analyses report that GHK is associated with changes in the expression of a large number of genes [ref:pickart2018].";
const P_KPV = "<strong>KPV</strong> (Lys-Pro-Val) is the C-terminal tripeptide of alpha-melanocyte-stimulating hormone (α-MSH). In mouse colitis models it was taken up by intestinal epithelial cells through the PepT1 transporter and reduced markers of intestinal inflammation [ref:dalmasso2008].";
const P_STATUS = "None of these compounds is authorized by Health Canada as a drug. The literature summarised here is preclinical unless stated otherwise, and it is provided as background for laboratory researchers, not as evidence of any effect in people.";

const storageQ = (name) => ({
  q: `How should lyophilized ${name} be stored?`,
  a: `Keep sealed vials refrigerated at 2–8 °C, dry and away from light. For storage longer than a few months, many laboratories keep lyophilized peptides frozen at −20 °C. Let the vial reach room temperature before opening to limit moisture uptake.`
});
const testingQ = (name) => ({
  q: `How is each lot of ${name} tested?`,
  a: `Every lot is tested by an independent UK laboratory for purity (HPLC) and identity (mass spectrometry). The lot number printed on the vial matches the certificate of analysis on our lab results page.`
});
const statusQ = (name) => ({
  q: `Is ${name} approved for use in people?`,
  a: `No. ${name} is not authorized by Health Canada or the US FDA as a drug. It is sold strictly for in-vitro and laboratory research. We do not provide dosing, administration or usage guidance.`
});

export const PRODUCTS = {
  bpc157: {
    compounds: [["bpc157", "10 mg"]],
    overview: [P_BPC, P_STATUS],
    faq: [
      { q: "What is BPC-157?", a: "BPC-157 is a synthetic 15-amino-acid peptide (GEPPPGKPADDAGLV) based on a sequence from body protection compound, a protein found in gastric juice. It is studied mainly in rodent models of tissue injury." },
      { q: "What is the molecular weight of BPC-157?", a: "1419.5 g/mol. Its molecular formula is C62H98N16O22 and its CAS number is 137525-51-0 (PubChem CID 9941957)." },
      { q: "What is the difference between BPC-157 and the BPC-157 + TB-500 blend?", a: "This vial contains BPC-157 only. The BPC-157 + TB-500 blend combines it with TB-500, a thymosin β4-derived peptide, in one vial for research designs that study both together." },
      testingQ("BPC-157"), storageQ("BPC-157"), statusQ("BPC-157")
    ]
  },
  tb500: {
    compounds: [["tb500", "10 mg"]],
    overview: [P_TB, P_STATUS],
    faq: [
      { q: "What is TB-500?", a: "TB-500 is the research-supply name for synthetic thymosin β4, a 43-amino-acid actin-binding peptide (molecular weight about 4963 g/mol, CAS 77591-33-4). Thymosin β4 has been studied in experimental models of wound repair and angiogenesis." },
      { q: "Is TB-500 the same as thymosin β4?", a: "It depends on the supplier. Some sell a short seven-amino-acid fragment of thymosin β4 (Ac-LKKTETQ, about 889 g/mol) under the name TB-500. Ours is full-length thymosin β4, as identified by independent lab analysis of the batch." },
      testingQ("TB-500"), storageQ("TB-500"), statusQ("TB-500")
    ]
  },
  "bpc157-tb500": {
    compounds: [["bpc157", null], ["tb500", null]],
    composition: "BPC-157 and TB-500, 10 mg total per vial",
    overview: [P_BPC, P_TB, P_STATUS],
    faq: [
      { q: "What is in the BPC-157 + TB-500 blend?", a: "Two peptides in one lyophilized vial: BPC-157, a 15-amino-acid gastric-derived peptide, and TB-500, a thymosin β4-derived peptide. The vial contains 10 mg in total." },
      { q: "Why are BPC-157 and TB-500 studied together?", a: "They have been investigated through different mechanisms in tissue-injury models: BPC-157 mostly alongside angiogenic growth-factor signalling, thymosin β4 through actin binding and cell migration. A single vial suits research designs that examine both." },
      testingQ("the BPC-157 + TB-500 blend"), storageQ("BPC-157 + TB-500"), statusQ("The BPC-157 + TB-500 blend")
    ]
  },
  glow: {
    compounds: [["ghkcu", "50 mg"], ["bpc157", "10 mg"], ["tb500", "10 mg"]],
    composition: "GHK-Cu 50 mg + BPC-157 10 mg + TB-500 10 mg (70 mg total)",
    overview: [P_GHK, P_BPC, P_TB, P_STATUS],
    faq: [
      { q: "What is in GLOW?", a: "GLOW is a three-peptide research blend: GHK-Cu (50 mg), BPC-157 (10 mg) and TB-500 (10 mg), 70 mg in one lyophilized vial." },
      { q: "What is the difference between GLOW and KLOW?", a: "KLOW contains everything in GLOW plus 10 mg of KPV, a tripeptide fragment of α-MSH studied in intestinal inflammation models. GLOW has three peptides (70 mg); KLOW has four (80 mg)." },
      { q: "Why does GLOW look blue?", a: "GHK-Cu is a copper(II) complex, and copper gives the powder and any solution a blue tint. The colour is expected." },
      testingQ("GLOW"), storageQ("GLOW"), statusQ("GLOW")
    ]
  },
  klow: {
    compounds: [["ghkcu", "50 mg"], ["kpv", "10 mg"], ["bpc157", "10 mg"], ["tb500", "10 mg"]],
    composition: "GHK-Cu 50 mg + KPV 10 mg + BPC-157 10 mg + TB-500 10 mg (80 mg total)",
    overview: [P_GHK, P_KPV, P_BPC, P_TB, P_STATUS],
    faq: [
      { q: "What is in KLOW?", a: "KLOW is a four-peptide research blend: GHK-Cu (50 mg), KPV (10 mg), BPC-157 (10 mg) and TB-500 (10 mg), 80 mg in one lyophilized vial." },
      { q: "What is KPV?", a: "KPV (Lys-Pro-Val) is the C-terminal tripeptide of alpha-melanocyte-stimulating hormone. It has been studied in mouse models of intestinal inflammation. Molecular weight 342.4 g/mol, CAS 67727-97-3." },
      { q: "What is the difference between KLOW and GLOW?", a: "KLOW is GLOW plus 10 mg of KPV. Both contain GHK-Cu, BPC-157 and TB-500 in the same amounts." },
      testingQ("KLOW"), storageQ("KLOW"), statusQ("KLOW")
    ]
  }
};
