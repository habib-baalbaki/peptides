/*
 * Science content batch: neuropeptides (semax; selank and dsip later).
 * Merged into content/science.mjs; same rules as that file (PubChem CIDs, real PMIDs, preclinical language only).
 */
import { P_STATUS, storageQ, testingQ, statusQ } from "./science-shared.mjs";

export const REFS = {
  dolotov2006: { pmid: "16996037", doi: "10.1016/j.brainres.2006.07.108",
    cite: "Dolotov OV, Karpenko EA, Inozemtseva LS, et al. Semax, an analog of ACTH(4-10) with cognitive effects, regulates BDNF and trkB expression in the rat hippocampus. Brain Res. 2006." }
};

export const COMPOUNDS = {
  // PubChem CID 9811102; ACTH(4-7) MEHF extended with the C-terminal tripeptide Pro-Gly-Pro
  semax: {
    name: "Semax",
    rows: [
      ["Sequence", "Met-Glu-His-Phe-Pro-Gly-Pro (MEHFPGP)"],
      ["Length", "7 amino acids"],
      ["Relationship to ACTH", "ACTH(4-7) with a C-terminal Pro-Gly-Pro tripeptide added"],
      ["Molecular formula", "C<sub>37</sub>H<sub>51</sub>N<sub>9</sub>O<sub>10</sub>S"],
      ["Molecular weight", "813.9 g/mol"],
      ["CAS number", "80714-61-0"]
    ],
    cas: "80714-61-0", mw: "813.9", cid: "9811102"
  }
};

const P_SEMAX = "<strong>Semax</strong> is a synthetic heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro) made up of the ACTH(4-7) fragment extended with the tripeptide Pro-Gly-Pro, an addition intended to slow enzymatic breakdown. It is described in the literature as an analogue of ACTH(4-10) without the hormone's corticotropic activity. In rats, a single application raised brain-derived neurotrophic factor (BDNF) protein and the phosphorylation of its receptor trkB in the hippocampus, together with increases in BDNF and trkB mRNA, which the authors linked to the peptide's reported effects on learning in that model [ref:dolotov2006].";

export const PRODUCTS = {
  semax: {
    compounds: [["semax", "10 mg"]],
    overview: [P_SEMAX, P_STATUS],
    faq: [
      { q: "What is Semax?", a: "Semax is a synthetic seven-amino-acid peptide (MEHFPGP) derived from the ACTH(4-7) fragment with a Pro-Gly-Pro tail added. It was developed in Russia and is studied in rodent models of learning and neuroprotection." },
      { q: "What is the molecular weight of Semax?", a: "813.9 g/mol. Its molecular formula is C37H51N9O10S and its CAS number is 80714-61-0 (PubChem CID 9811102)." },
      { q: "How is Semax related to ACTH?", a: "It reproduces a short fragment of adrenocorticotropic hormone, residues 4 to 7, with three extra residues (Pro-Gly-Pro) at the C-terminus that slow its breakdown. The fragment does not carry the corticotropic activity of the full hormone." },
      { q: "What does the research on Semax look at?", a: "Published work is mainly preclinical and examines neurotrophic signalling. In rats, Semax increased hippocampal BDNF and trkB expression and trkB phosphorylation. Our pages do not describe effects in people." },
      testingQ("Semax"), storageQ("Semax"), statusQ("Semax")
    ]
  }
};
