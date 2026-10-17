export function decodeHtmlEntities(text: string): string {
  return text.replace(
    /&(?:amp|quot|apos|lt|gt|#\d+|#x[0-9a-f]+);/gi,
    (entity) => {
      const names: Record<string, string> = {
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&lt;': '<',
        '&gt;': '>',
      };
      return (
        names[entity] ??
        String.fromCodePoint(
          entity[2].toLowerCase() === 'x'
            ? parseInt(entity.slice(3, -1), 16)
            : Number(entity.slice(2, -1)),
        )
      );
    },
  );
}
