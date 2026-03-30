"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import FitIntake from "@/app/fit/page";

export default function LocaleFitPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  if (!locales.includes(lang as Locale)) notFound();
  return <FitIntake />;
}
