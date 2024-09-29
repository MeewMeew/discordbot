interface MatchResult {
  string: string;
  rating: number;
}
interface FindBestMatchOptions {
  substringLength?: number;
  caseSensitive?: boolean;
  threshold?: number;
}

export const stringSimilarity = (str1: string, str2: string, substringLength = 2, caseSensitive = false) => {
  if (!caseSensitive) { str1 = str1.toLowerCase(); str2 = str2.toLowerCase(); }
  if (str1.length < substringLength || str2.length < substringLength) return 0;
  const map = new Map(); for (let i = 0; i <= str1.length - substringLength; i++) map.set(str1.substr(i, substringLength), (map.get(str1.substr(i, substringLength)) || 0) + 1);
  let match = 0; for (let j = 0; j <= str2.length - substringLength; j++) {
    const substr = str2.substr(j, substringLength);
    if (map.has(substr)) {
      match++;
      map.set(substr, map.get(substr) - 1);
    }
  }
  return (match * 2) / (str1.length + str2.length - (substringLength - 1) * 2);
};

export const findBestMatch = (string1: string, arrayStrings: string[], options: FindBestMatchOptions = {}) => {
  const { substringLength = 2, caseSensitive = false, threshold = 0 } = options;
  const results = arrayStrings.map(str => ({ string: str, rating: stringSimilarity(string1, str, substringLength, caseSensitive) }));
  const filteredResults = results.filter(result => result.rating >= threshold);
  const bestMatch = filteredResults.reduce((best, current) => (current.rating > best.rating ? current : best), { string: '', rating: 0 } as MatchResult);
  return { matches: filteredResults, bestMatch: bestMatch.rating > 0 ? bestMatch : null };
};
