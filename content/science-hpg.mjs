/*
 * Science content batch: HPG axis (kisspeptin10; pt141 later).
 * Merged into content/science.mjs; same rules as that file (PubChem CIDs, real PMIDs, preclinical language only).
 */
import { P_STATUS, storageQ, testingQ, statusQ } from "./science-shared.mjs";

export const REFS = {
  kotani2001: { pmid: "11457843", doi: "10.1074/jbc.M104847200",
    cite: "Kotani M, Detheux M, Vandenbogaerde A, et al. The metastasis suppressor gene KiSS-1 encodes kisspeptins, the natural ligands of the orphan G protein-coupled receptor GPR54. J Biol Chem. 2001." },
  messager2005: { pmid: "15665093", doi: "10.1073/pnas.0409330102",
    cite: "Messager S, Chatzidaki EE, Ma D, et al. Kisspeptin directly stimulates gonadotropin-releasing hormone release via G protein-coupled receptor 54. Proc Natl Acad Sci U S A. 2005." }
};

export const COMPOUNDS = {
  // PubChem CID 25240297; the 10-residue C-terminal fragment of kisspeptin-54 (metastin 45-54)
  kisspeptin10: {
    name: "Kisspeptin-10",
    rows: [
      ["Sequence", "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH<sub>2</sub> (YNWNSFGLRF-NH<sub>2</sub>)"],
      ["Length", "10 amino acids, C-terminal amide (an RF-amide peptide)"],
      ["Also known as", "KP-10, metastin 45–54, kisspeptin-54 C-terminal fragment"],
      ["Molecular formula", "C<sub>63</sub>H<sub>83</sub>N<sub>17</sub>O<sub>14</sub>"],
      ["Molecular weight", "1302.4 g/mol"],
      ["CAS number", "374675-21-5"]
    ],
    cas: "374675-21-5", mw: "1302.4", cid: "25240297"
  }
};

const P_KISS = "<strong>Kisspeptin-10</strong> is the C-terminal 10-amino-acid fragment of kisspeptin-54, a peptide encoded by the metastasis-suppressor gene <em>KISS1</em>. Kisspeptins were isolated from human placenta and identified as the natural ligands of the G-protein-coupled receptor GPR54 (also called KISS1R), binding it with low-nanomolar affinity in cell assays [ref:kotani2001]. In mice, GPR54 transcripts were found in gonadotropin-releasing hormone (GnRH) neurons of the hypothalamus; kisspeptin raised luteinizing hormone and follicle-stimulating hormone in wild-type mice but not in GPR54-knockout mice, and in sheep central administration released GnRH into cerebrospinal fluid, which identified this receptor as a control point of the hypothalamic-pituitary-gonadal axis [ref:messager2005].";

export const PRODUCTS = {
  kisspeptin10: {
    compounds: [["kisspeptin10", "10 mg"]],
    overview: [P_KISS, P_STATUS],
    faq: [
      { q: "What is Kisspeptin-10?", a: "Kisspeptin-10 is a 10-amino-acid peptide (YNWNSFGLRF-NH2) corresponding to the C-terminal end of kisspeptin-54, the product of the KISS1 gene. It is an agonist of the receptor GPR54 / KISS1R and is studied in reproductive-axis research." },
      { q: "What is the molecular weight of Kisspeptin-10?", a: "1302.4 g/mol. Its molecular formula is C63H83N17O14 and its CAS number is 374675-21-5 (PubChem CID 25240297)." },
      { q: "What is the difference between Kisspeptin-10 and Kisspeptin-54?", a: "Kisspeptin-54, also called metastin, is the 54-amino-acid peptide produced from the KISS1 gene. Kisspeptin-10 is its last 10 residues, the shortest fragment that retains receptor activity. Both share the same RF-amide C-terminus." },
      { q: "What receptor does Kisspeptin-10 act on?", a: "GPR54, also named KISS1R. In mouse studies this receptor is found on hypothalamic GnRH neurons, and kisspeptin had no effect on gonadotropin release in mice lacking it." },
      testingQ("Kisspeptin-10"), storageQ("Kisspeptin-10"), statusQ("Kisspeptin-10")
    ]
  }
};
