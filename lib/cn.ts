export function cn(
  ...parts: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  return parts
    .flatMap((p) => {
      if (!p) return [];
      if (typeof p === "string") return [p];
      return Object.entries(p)
        .filter(([, v]) => v)
        .map(([k]) => k);
    })
    .join(" ");
}
