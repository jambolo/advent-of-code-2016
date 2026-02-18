// Utility functions

// Splits a string at the first occurrence of a delimiter, returning the part before and after the delimiter.
export function splitAt(str: string, delim: string): [string, string] {
  const i = str.indexOf(delim);
  return i === -1 ? [str, ""] : [str.slice(0, i), str.slice(i)];
}

// Returns the key/value pair with the smallest value.
export function minEntryByValue<K, V>(entries: [K, V][]): [K, V] {
  return entries.reduce((a, b) => a[1] < b[1] ? a : b);
}

// Returns the key/value pair with the largest value.
export function maxEntryByValue<K, V>(entries: [K, V][]): [K, V] {
  return entries.reduce((a, b) => a[1] > b[1] ? a : b);
}

// Returns a map of the number of occurrences of each element in the array.
export function mapCounts<T>(arr: T[]): Map<T, number> {
  const counts = new Map<T, number>();
  return arr.reduce((m, key) => m.set(key, (m.get(key) ?? 0) + 1), counts);
}