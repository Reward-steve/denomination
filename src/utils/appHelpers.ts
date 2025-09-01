// Dependencies (first, logically grouped)
import React from "react";
import { Buffer } from "buffer";
import { openDB } from "idb";
import { DateTime } from "luxon";
import SimpleCrypto from "simple-crypto-js";
import type { PlainData } from "simple-crypto-js";
import type { PaletteColor } from "@mui/material";

// === IndexedDB Setup ===
export const getGeneralDB = () => {
  return openDB("generalDB", 1, {
    upgrade(db) {
      db.createObjectStore("generalStore");
    },
  });
};

// === Storage Functions (Session/Local) ===
export const saveInStore = (
  key: string,
  data: object | string | number | boolean,
  storage: "session" | "local" = "session"
) => {
  try {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(_secret);
    const payload = simpleCrypto.encrypt(data);

    if (storage === "session") {
      sessionStorage.setItem(key, payload);
    } else {
      localStorage.setItem(key, payload);
    }
  } catch {
    return null;
  }
};

export const getFromStore = <T>(
  key: string,
  storage: "session" | "local" = "session"
): T | null => {
  try {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(_secret);
    const data =
      storage === "session"
        ? sessionStorage.getItem(key)
        : localStorage.getItem(key);

    return data ? (simpleCrypto.decrypt(data) as T) : null;
  } catch {
    return null;
  }
};

export const removeFromStore = (
  key: string,
  storage: "session" | "local" = "session"
) => {
  if (storage === "session") {
    sessionStorage.removeItem(key);
  } else {
    localStorage.removeItem(key);
  }
};

// === Async IndexedDB Functions ===
export const saveInStoreAsync = async (
  key: string,
  data: object | string | number | boolean,
  encrypt: boolean = false
) => {
  let payload = data;
  if (encrypt) {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(_secret);
    payload = simpleCrypto.encrypt(data);
  }

  const db = await getGeneralDB();
  return db.put("generalStore", payload, key);
};

export const getFromStoreAsync = async <T>(
  key: string,
  encrypt: boolean = false
): Promise<T | null> => {
  const db = await getGeneralDB();
  const data = await db.get("generalStore", key);

  if (encrypt && data) {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(_secret);
    return simpleCrypto.decrypt(data) as T;
  }

  return data as T | null;
};

export const removeFromStoreAsync = async (key: string) => {
  const db = await getGeneralDB();
  await db.delete("generalStore", key);
};

// === Crypto Utilities ===
export const encrypt = (data: PlainData) => {
  try {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    return new SimpleCrypto(_secret).encrypt(data);
  } catch {
    return null;
  }
};

export const decrypt = (data: string) => {
  try {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    return new SimpleCrypto(_secret).decrypt(data);
  } catch {
    return null;
  }
};

// === General Utilities ===
export const handleError = (err: any, def: any = null) => {
  if (err?.code === "ERR_CANCELED") return "";
  if (typeof err === "string") return err;
  if (err?.response?.data?.message) {
    const message = err.response.data.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message.Errors)) {
      const mErr: string[] = message.Errors;
      const last = mErr.pop();
      return mErr.length ? `${mErr.join(", ")} and ${last}` : last;
    }
  }
  if (err?.response?.message) return err.response.message;
  if (def) return def;
  if (err?.message) return err.message;

  return React.isValidElement(err)
    ? err
    : "Oops !!! Something went wrong, please try again.";
};

export const getAccurateGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
};

export const allowOnClick = (
  onClick: (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => void
): React.HTMLAttributes<HTMLElement> => ({
  role: "button",
  tabIndex: 0,
  onClick,
  onKeyPress: (e) => {
    if (["Enter", " "].includes(e.key)) onClick(e);
  },
});

export const uid = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const base64Encode = (str: string) =>
  Buffer.from(str).toString("base64");
export const base64Decode = (base64String: string) =>
  Buffer.from(base64String, "base64").toString();

export const formatStat = (
  n: string | number | null | undefined
): number | null => {
  if (n === null || n === undefined) return null;
  const num = Number(n);
  return isNaN(num) ? null : Math.max(num, 0);
};

export const ObjectToURLQuery = (param?: Record<string, string | number>) =>
  param
    ? Object.entries(param)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")
    : "";

export const getColor = (
  colors: PaletteColor[],
  uniqueNum: number
): PaletteColor => colors[uniqueNum % colors.length] || colors[0];

const hexVal = "abcdefghijklmnopqrstuvwxyz";
export const sumNumStr = (numStr: string) =>
  numStr
    .toLowerCase()
    .split("")
    .reduce(
      (acc, c) => acc + (isNaN(parseInt(c)) ? hexVal.indexOf(c) : parseInt(c)),
      0
    );

export const trimSlash = (
  route: string,
  type: "left" | "right" | "both" = "both"
): string => {
  route = route.trim();
  if (["both", "right"].includes(type)) {
    route = route.endsWith("/") ? route.slice(0, -1) : route;
  }
  if (["both", "left"].includes(type)) {
    route = route.startsWith("/") ? route.slice(1) : route;
  }
  return route;
};

export const formAbbr = (name: string, maxSize = 4): string => {
  const words = name.trim().split(" ").filter(Boolean);
  if (!words.length) return "";
  const charsPerWord = Math.max(Math.floor(maxSize / words.length), 1);
  const abbr = words.reduce(
    (acc, word) => acc + word.substring(0, charsPerWord),
    ""
  );
  return abbr.substring(0, maxSize);
};

export const getInitials = (str: string, length = 2) =>
  str
    .split(" ")
    .slice(0, length)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

export const randomCharacters = (
  length: number,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string => {
  let result = "";
  while (length--)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};

export const getAbbr = (str = "", maxChar = 3) => {
  const parts = str.trim().split(" ").filter(Boolean);
  return parts.length === 1
    ? parts[0].charAt(0)
    : parts.reduce(
        (acc, curr, i) => (i < maxChar ? acc + curr.charAt(0) : acc),
        ""
      );
};

export type fileSizeUnit = "KB" | "MB" | "GB" | "TB" | "Bytes";
export function convertBytes(
  bytes: number,
  size?: fileSizeUnit,
  decimalPlaces = 2
): { value: number; label: string; unit: fileSizeUnit } {
  const sizes = {
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    Bytes: 1,
  };
  const get = (u: fileSizeUnit) => {
    const val = bytes / sizes[u];
    return { value: val, label: `${val.toFixed(decimalPlaces)} ${u}`, unit: u };
  };
  if (size) return get(size);
  if (bytes >= sizes.TB) return get("TB");
  if (bytes >= sizes.GB) return get("GB");
  if (bytes >= sizes.MB) return get("MB");
  if (bytes >= sizes.KB) return get("KB");
  return get("Bytes");
}

export function getDateString(date: DateTime): string | null {
  const now = DateTime.now();
  if (date.hasSame(now, "day")) return "Today";
  if (date.hasSame(now.minus({ days: 1 }), "day")) return "Yesterday";
  if (date >= now.startOf("week") && date <= now.endOf("week"))
    return date.weekdayLong;
  return date.toFormat("dd/LL/yy");
}

export const manualReverse = <T>(arr: T[]): T[] =>
  arr.reduce<T[]>((acc, val) => [val, ...acc], []);

export function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
