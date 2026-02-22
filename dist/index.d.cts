import { GatewayMode, ModerateResponse, RedactRequest, RedactResponse, AiChatRequest, AiChatResponse, CreditBalanceResponse, CreditTransactionResponse, SanitizeResponse, ShortenResponse, ShortUrlStats, RoastResponse, ValidateResponse, OcrResponse, TranslateResponse, ScreenshotResponse, SentimentResponse, SummarizeResponse } from '@dl-io/shared';

interface DicklessConfig {
    apiKey: string;
    baseUrl?: string;
    defaultGatewayMode?: GatewayMode;
}
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}
declare class DicklessSDK {
    private apiKey;
    private baseUrl;
    private defaultGatewayMode?;
    constructor(config: DicklessConfig);
    private request;
    /** Analyze text for toxicity, hate speech, violence, and other harmful content */
    moderateText(text: string): Promise<ModerateResponse>;
    /** Analyze an image for NSFW content */
    moderateImage(image: string, format?: "png" | "jpeg" | "webp"): Promise<ModerateResponse>;
    /** Strip personally identifiable information from text */
    redact(text: string, entities?: RedactRequest["entities"]): Promise<RedactResponse>;
    /** Send a chat completion request through the unified AI gateway */
    chat(request: AiChatRequest): Promise<AiChatResponse>;
    /** Get current credit balance for dedicated mode */
    getCreditBalance(): Promise<CreditBalanceResponse>;
    /** Get credit transaction history */
    getCreditTransactions(): Promise<CreditTransactionResponse[]>;
    /** Detect and neutralize prompt injection attacks */
    sanitize(prompt: string, strict?: boolean): Promise<SanitizeResponse>;
    /** Create a short URL with QR code */
    shorten(url: string, customCode?: string): Promise<ShortenResponse>;
    /** Get click analytics for a short URL */
    getShortUrlStats(code: string): Promise<ShortUrlStats>;
    /** Generate an AI roast for text content */
    roast(text: string, type?: "resume" | "landing_page" | "code" | "linkedin" | "general", severity?: "mild" | "medium" | "brutal"): Promise<RoastResponse>;
    /** Validate an email, phone, URL, or domain */
    validate(type: "email" | "phone" | "url" | "domain", value: string, deep?: boolean): Promise<ValidateResponse>;
    /** Extract text from an image */
    ocr(image: string, format?: "png" | "jpeg" | "webp" | "pdf", language?: string): Promise<OcrResponse>;
    /** Translate text between languages */
    translate(text: string, to: string, from?: string, model?: string): Promise<TranslateResponse>;
    /** Capture a screenshot of a URL */
    screenshot(url: string, options?: {
        format?: "png" | "pdf";
        width?: number;
        height?: number;
        fullPage?: boolean;
        waitFor?: number;
    }): Promise<ScreenshotResponse>;
    /** Analyze sentiment of text */
    sentiment(text: string, granularity?: "document" | "sentence"): Promise<SentimentResponse>;
    /** Summarize text or a web page */
    summarize(options: {
        text?: string;
        url?: string;
        maxLength?: number;
        format?: "bullets" | "paragraph";
    }): Promise<SummarizeResponse>;
    /** Generate a PDF from HTML content or a URL */
    generatePdf(options: {
        html?: string;
        url?: string;
        pageSize?: "A4" | "letter" | "legal" | "tabloid";
        margins?: {
            top?: string;
            right?: string;
            bottom?: string;
            left?: string;
        };
        landscape?: boolean;
        headerTemplate?: string;
        footerTemplate?: string;
        printBackground?: boolean;
        waitFor?: number;
    }): Promise<unknown>;
    /** Verify an email address for deliverability and validity */
    verifyEmail(email: string, deep?: boolean): Promise<unknown>;
    /** Look up DNS records and optionally WHOIS data for a domain */
    dnsLookup(domain: string, types?: string[], whois?: boolean): Promise<unknown>;
    /** Get geolocation and threat intelligence for an IP address */
    ipIntel(ip: string, deep?: boolean): Promise<unknown>;
    /** Deliver a webhook to a URL with retry and signing support */
    deliverWebhook(options: {
        url: string;
        event: string;
        payload: unknown;
        secret?: string;
        retry_policy?: {
            max_retries?: number;
            backoff_seconds?: number;
        };
        idempotency_key?: string;
    }): Promise<unknown>;
    /** Sanitize HTML or Markdown input by stripping dangerous tags and attributes */
    sanitizeHtml(input: string, options?: {
        input_format?: "html" | "markdown";
        allow_tags?: string[];
        deny_tags?: string[];
        allow_attributes?: string[];
        deny_attributes?: string[];
        strip_comments?: boolean;
    }): Promise<unknown>;
}

export { type ApiResponse, type DicklessConfig, DicklessSDK, DicklessSDK as default };
