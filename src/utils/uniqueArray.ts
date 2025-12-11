export const uniqueArray = (items: any[]) => {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
};
