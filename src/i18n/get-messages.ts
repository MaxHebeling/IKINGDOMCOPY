import type { Locale } from "./config";
import es from "./messages/es";
import en from "./messages/en";

export type Messages = typeof es;

export function getMessages(lang: Locale): Messages {
  return lang === "en" ? en : es;
}
