"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type QueryValue = string | number | boolean | null | undefined | Date;
type QueryParams = Record<string, QueryValue>;

export function useManageUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // const setParams = useCallback(
  //   (
  //     params: QueryParams,
  //     removeKeys: string[] = [],
  //     replace: boolean = false
  //   ) => {
  //     const newSearchParams = new URLSearchParams(searchParams.toString());

  //     for (const key in params) {
  //       const value = params[key];
  //       if (value === undefined || value === null || value === "") {
  //         newSearchParams.delete(key);
  //       } else {
  //         newSearchParams.set(key, String(value));
  //       }
  //     }

  //     removeKeys.forEach((key) => newSearchParams.delete(key));

  //     const queryString = newSearchParams.toString();
  //     const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

  //     if (replace) {
  //       router.replace(newUrl);
  //     } else {
  //       router.push(newUrl);
  //     }
  //   },
  //   [pathname, searchParams, router]
  // );

  const getParams = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );
  const buildUrl = useCallback(
    (params: QueryParams, removeKeys: string[] = []) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const key in params) {
        const value = params[key];
        if (!value) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      removeKeys.forEach((key) => newSearchParams.delete(key));
      const queryString = newSearchParams.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [pathname, searchParams]
  );

  const setParams = useCallback(
    (params: QueryParams, removeKeys: string[] = [], replace = false) => {
      const url = buildUrl(params, removeKeys);
      if (replace) router.replace(url);
      else router.push(url);
    },
    [buildUrl, router]
  );

  return { buildUrl, setParams, getParams, getParam };
  // return { setParams, getParams, getParam };
}
