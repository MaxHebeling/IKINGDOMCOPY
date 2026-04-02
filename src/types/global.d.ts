interface Window {
  dataLayer: Record<string, unknown>[];
  fbq: (event: string, eventName: string, params?: Record<string, unknown>) => void;
}
