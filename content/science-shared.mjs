/* Shared helpers for content/science*.mjs. Same rules as content/science.mjs. */

export const P_STATUS = "None of these compounds is authorized by Health Canada as a drug. The literature summarised here is preclinical unless stated otherwise, and it is provided as background for laboratory researchers, not as evidence of any effect in people.";

export const storageQ = (name) => ({
  q: `How should lyophilized ${name} be stored?`,
  a: `Keep sealed vials refrigerated at 2–8 °C, dry and away from light. For storage longer than a few months, many laboratories keep lyophilized peptides frozen at −20 °C. Let the vial reach room temperature before opening to limit moisture uptake.`
});
export const testingQ = (name) => ({
  q: `How is each lot of ${name} tested?`,
  a: `Every lot is tested by an independent laboratory (Janoshik Analytical) for purity (HPLC) and identity (mass spectrometry). The lot number printed on the vial matches the certificate of analysis on our lab results page.`
});
export const statusQ = (name) => ({
  q: `Is ${name} approved for use in people?`,
  a: `No. ${name} is not authorized by Health Canada or the US FDA as a drug. It is sold strictly for in-vitro and laboratory research. We do not provide dosing, administration or usage guidance.`
});
