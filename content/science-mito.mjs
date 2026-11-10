/*
 * Science content batch: mitochondrial & longevity (mots-c; ss31 and nad later).
 * Merged into content/science.mjs; same rules as that file (PubChem CIDs, real PMIDs, preclinical language only).
 */
import { P_STATUS, storageQ, testingQ, statusQ } from "./science-shared.mjs";

export const REFS = {
  lee2015: { pmid: "25738459", doi: "10.1016/j.cmet.2015.02.009",
    cite: "Lee C, Zeng J, Drew BG, et al. The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces obesity and insulin resistance. Cell Metab. 2015." },
  reynolds2021: { pmid: "33473109", doi: "10.1038/s41467-020-20790-0",
    cite: "Reynolds JC, Lai RW, Woodhead JST, et al. MOTS-c is an exercise-induced mitochondrial-encoded regulator of age-dependent physical decline and muscle homeostasis. Nat Commun. 2021." }
};

export const COMPOUNDS = {
  // PubChem CID 146675088 (synonym H-MRWQEMGYIFYPRKLR-OH)
  motsc: {
    name: "MOTS-c",
    rows: [
      ["Sequence", "Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg (MRWQEMGYIFYPRKLR)"],
      ["Length", "16 amino acids"],
      ["Origin", "Encoded by a short open reading frame in the mitochondrial 12S rRNA gene"],
      ["Molecular formula", "C<sub>101</sub>H<sub>152</sub>N<sub>28</sub>O<sub>22</sub>S<sub>2</sub>"],
      ["Molecular weight", "2174.6 g/mol"],
      ["CAS number", "1627580-64-6"]
    ],
    cas: "1627580-64-6", mw: "2174.6", cid: "146675088"
  }
};

const P_MOTSC = "<strong>MOTS-c</strong> (mitochondrial open reading frame of the 12S rRNA-c) is a 16-amino-acid peptide encoded within mitochondrial DNA, in the gene for 12S ribosomal RNA. In the study that first described it, its main target appeared to be skeletal muscle, where it inhibited the folate cycle and de novo purine synthesis, leading to AMPK activation; in mice it was investigated in models of age-dependent and high-fat-diet-induced insulin resistance and of diet-induced obesity [ref:lee2015]. Later work reported that exercise raised endogenous MOTS-c in human skeletal muscle and plasma, and studied MOTS-c treatment in mouse models of age-related decline in physical capacity [ref:reynolds2021].";

export const PRODUCTS = {
  "mots-c": {
    compounds: [["motsc", "10 mg"]],
    overview: [P_MOTSC, P_STATUS],
    faq: [
      { q: "What is MOTS-c?", a: "MOTS-c is a 16-amino-acid peptide (MRWQEMGYIFYPRKLR) encoded by mitochondrial DNA, first described in 2015. Its name stands for mitochondrial open reading frame of the 12S rRNA-c. It is studied mainly in mouse models of metabolism and ageing." },
      { q: "What is the molecular weight of MOTS-c?", a: "2174.6 g/mol. Its molecular formula is C101H152N28O22S2 and its CAS number is 1627580-64-6 (PubChem CID 146675088)." },
      { q: "Why is MOTS-c called a mitochondrial-derived peptide?", a: "Almost all proteins are encoded by nuclear DNA. MOTS-c is encoded by a short open reading frame inside the mitochondrial genome, in the 12S rRNA gene. Humanin is another peptide of this class." },
      testingQ("MOTS-c"), storageQ("MOTS-c"), statusQ("MOTS-c")
    ]
  }
};
