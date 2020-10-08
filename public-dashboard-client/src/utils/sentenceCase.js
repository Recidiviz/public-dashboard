export default function sentenceCase(str) {
  return str.replace(/^\w/, (firstLetter) => firstLetter.toUpperCase());
}
