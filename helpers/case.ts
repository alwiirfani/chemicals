function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function convertSnakeToCamel<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeToCamel(item)) as T;
  }

  if (isObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = convertSnakeToCamel(
        (obj as Record<string, unknown>)[key]
      );
    }
    return result as T;
  }

  return obj as T;
}
