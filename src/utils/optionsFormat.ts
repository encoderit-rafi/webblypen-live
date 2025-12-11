type OptionFormatType = {
  id?: string | number | undefined;
  name?: string | undefined;
  value?: string;
};

export const optionFormat = (item: any) => {
  return {
    id: item?.id || "",
    label: item?.name || "",
    value: String(item?.value || item?.id || ""),
    ...item,
  };
};
// export const optionsFormat = (items: any) => {
//   return items.map((item: any) => ({
//     id: item.id,
//     label: item.name,
//     value: String(item.value || item.id),
//     ...item,
//   }));
// };
export const optionsFormat = <T extends Record<string, any>>(
  items: T[],
  extraKeys: (keyof T)[] = []
) => {
  return items.map((item) => {
    const base = {
      id: item.id,
      label: item.name,
      name: item.name,
      value: String(item.value ?? item.id),
    };

    // Pick only whitelisted keys
    const extras = extraKeys.reduce((acc, key) => {
      if (key in item) {
        acc[key as string] = item[key];
      }
      return acc;
    }, {} as Record<string, any>);

    return { ...base, ...extras };
  });
};
