import type {
  ModerateResponse,
  RedactRequest,
  RedactResponse,
  AiChatRequest,
  AiChatResponse,
  SanitizeResponse,
  ShortenResponse,
  ShortUrlStats,
  RoastResponse,
  GatewayMode,
  CreditBalanceResponse,
  CreditTransactionResponse,
  ValidateResponse,
  OcrResponse,
  TranslateResponse,
  ScreenshotResponse,
  SentimentResponse,
  SummarizeResponse,
} from "@dl-io/shared";

interface DicklessConfig {
  apiKey: string;
  baseUrl?: string;
  defaultGatewayMode?: GatewayMode;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

class DicklessSDK {
  private apiKey: string;
  private baseUrl: string;
  private defaultGatewayMode?: GatewayMode;

  constructor(config: DicklessConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://dickless.io";
    this.defaultGatewayMode = config.defaultGatewayMode;
  }

  // Private fetch helper
  private async request<T>(
    path: string,
    options: { method?: string; body?: unknown } = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const json: ApiResponse<T> = await response.json();
    if (!json.success || !json.data) {
      throw new Error(json.error?.message || `API error: ${response.status}`);
    }
    return json.data;
  }

  // --- Content Moderation ---

  /** Analyze text for toxicity, hate speech, violence, and other harmful content */
  async moderateText(text: string): Promise<ModerateResponse> {
    return this.request("/api/v1/moderate/text", {
      method: "POST",
      body: { text },
    });
  }

  /** Analyze an image for NSFW content */
  async moderateImage(
    image: string,
    format?: "png" | "jpeg" | "webp",
  ): Promise<ModerateResponse> {
    return this.request("/api/v1/moderate/image", {
      method: "POST",
      body: { image, format },
    });
  }

  // --- PII Redaction ---

  /** Strip personally identifiable information from text */
  async redact(text: string, entities?: RedactRequest["entities"]): Promise<RedactResponse> {
    return this.request("/api/v1/redact", {
      method: "POST",
      body: { text, entities },
    });
  }

  // --- AI Gateway ---

  /** Send a chat completion request through the unified AI gateway */
  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    const body = { ...request };
    if (!body.gateway_mode && this.defaultGatewayMode) {
      body.gateway_mode = this.defaultGatewayMode;
    }
    return this.request("/api/v1/ai/chat", {
      method: "POST",
      body,
    });
  }

  /** Get current credit balance for dedicated mode */
  async getCreditBalance(): Promise<CreditBalanceResponse> {
    return this.request("/api/v1/ai/manage/credits/balance");
  }

  /** Get credit transaction history */
  async getCreditTransactions(): Promise<CreditTransactionResponse[]> {
    return this.request("/api/v1/ai/manage/credits/transactions");
  }

  // --- Prompt Sanitizer ---

  /** Detect and neutralize prompt injection attacks */
  async sanitize(prompt: string, strict?: boolean): Promise<SanitizeResponse> {
    return this.request("/api/v1/sanitize", {
      method: "POST",
      body: { prompt, strict },
    });
  }

  // --- URL Shortener ---

  /** Create a short URL with QR code */
  async shorten(url: string, customCode?: string): Promise<ShortenResponse> {
    return this.request("/api/v1/shorten", {
      method: "POST",
      body: { url, customCode },
    });
  }

  /** Get click analytics for a short URL */
  async getShortUrlStats(code: string): Promise<ShortUrlStats> {
    return this.request(`/api/v1/shorten/${code}/stats`);
  }

  // --- Roast Tool ---

  /** Generate an AI roast for text content */
  async roast(
    text: string,
    type?: "resume" | "landing_page" | "code" | "linkedin" | "general",
    severity?: "mild" | "medium" | "brutal",
  ): Promise<RoastResponse> {
    return this.request("/api/v1/roast", {
      method: "POST",
      body: { text, type, severity },
    });
  }

  // --- Input Validation ---

  /** Validate an email, phone, URL, or domain */
  async validate(
    type: "email" | "phone" | "url" | "domain",
    value: string,
    deep?: boolean,
  ): Promise<ValidateResponse> {
    return this.request("/api/v1/validate", {
      method: "POST",
      body: { type, value, deep },
    });
  }

  // --- OCR / Text Extraction ---

  /** Extract text from an image */
  async ocr(
    image: string,
    format?: "png" | "jpeg" | "webp" | "pdf",
    language?: string,
  ): Promise<OcrResponse> {
    return this.request("/api/v1/ocr", {
      method: "POST",
      body: { image, format, language },
    });
  }

  // --- Translation ---

  /** Translate text between languages */
  async translate(
    text: string,
    to: string,
    from?: string,
    model?: string,
  ): Promise<TranslateResponse> {
    return this.request("/api/v1/translate", {
      method: "POST",
      body: { text, to, from, model },
    });
  }

  // --- Screenshot ---

  /** Capture a screenshot of a URL */
  async screenshot(
    url: string,
    options?: {
      format?: "png" | "pdf";
      width?: number;
      height?: number;
      fullPage?: boolean;
      waitFor?: number;
    },
  ): Promise<ScreenshotResponse> {
    return this.request("/api/v1/screenshot", {
      method: "POST",
      body: { url, ...options },
    });
  }

  // --- Sentiment Analysis ---

  /** Analyze sentiment of text */
  async sentiment(
    text: string,
    granularity?: "document" | "sentence",
  ): Promise<SentimentResponse> {
    return this.request("/api/v1/sentiment", {
      method: "POST",
      body: { text, granularity },
    });
  }

  // --- Summarization ---

  /** Summarize text or a web page */
  async summarize(options: {
    text?: string;
    url?: string;
    maxLength?: number;
    format?: "bullets" | "paragraph";
  }): Promise<SummarizeResponse> {
    return this.request("/api/v1/summarize", {
      method: "POST",
      body: options,
    });
  }

  // --- PDF Generation ---

  /** Generate a PDF from HTML content or a URL */
  async generatePdf(options: {
    html?: string;
    url?: string;
    pageSize?: "A4" | "letter" | "legal" | "tabloid";
    margins?: { top?: string; right?: string; bottom?: string; left?: string };
    landscape?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    printBackground?: boolean;
    waitFor?: number;
  }) {
    return this.request("/api/v1/pdf", {
      method: "POST",
      body: options,
    });
  }

  // --- Email Verification ---

  /** Verify an email address for deliverability and validity */
  async verifyEmail(email: string, deep?: boolean) {
    return this.request("/api/v1/email-verify", {
      method: "POST",
      body: { email, deep },
    });
  }

  // --- DNS / WHOIS Lookup ---

  /** Look up DNS records and optionally WHOIS data for a domain */
  async dnsLookup(domain: string, types?: string[], whois?: boolean) {
    return this.request("/api/v1/dns", {
      method: "POST",
      body: { domain, types, whois },
    });
  }

  // --- IP Geolocation & Threat Intel ---

  /** Get geolocation and threat intelligence for an IP address */
  async ipIntel(ip: string, deep?: boolean) {
    return this.request("/api/v1/ip-intel", {
      method: "POST",
      body: { ip, deep },
    });
  }

  // --- Webhook Delivery ---

  /** Deliver a webhook to a URL with retry and signing support */
  async deliverWebhook(options: {
    url: string;
    event: string;
    payload: unknown;
    secret?: string;
    retry_policy?: { max_retries?: number; backoff_seconds?: number };
    idempotency_key?: string;
  }) {
    return this.request("/api/v1/webhook-deliver", {
      method: "POST",
      body: options,
    });
  }

  // --- HTML/Markdown Sanitizer ---

  /** Sanitize HTML or Markdown input by stripping dangerous tags and attributes */
  async sanitizeHtml(input: string, options?: {
    input_format?: "html" | "markdown";
    allow_tags?: string[];
    deny_tags?: string[];
    allow_attributes?: string[];
    deny_attributes?: string[];
    strip_comments?: boolean;
  }) {
    return this.request("/api/v1/html-sanitize", {
      method: "POST",
      body: { input, ...options },
    });
  }
}

export { DicklessSDK, type DicklessConfig, type ApiResponse };
export default DicklessSDK;
