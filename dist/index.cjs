"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DicklessSDK: () => DicklessSDK,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var DicklessSDK = class {
  apiKey;
  baseUrl;
  defaultGatewayMode;
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://dickless.io";
    this.defaultGatewayMode = config.defaultGatewayMode;
  }
  // Private fetch helper
  async request(path, options = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: options.body ? JSON.stringify(options.body) : void 0
    });
    const json = await response.json();
    if (!json.success || !json.data) {
      throw new Error(json.error?.message || `API error: ${response.status}`);
    }
    return json.data;
  }
  // --- Content Moderation ---
  /** Analyze text for toxicity, hate speech, violence, and other harmful content */
  async moderateText(text) {
    return this.request("/api/v1/moderate/text", {
      method: "POST",
      body: { text }
    });
  }
  /** Analyze an image for NSFW content */
  async moderateImage(image, format) {
    return this.request("/api/v1/moderate/image", {
      method: "POST",
      body: { image, format }
    });
  }
  // --- PII Redaction ---
  /** Strip personally identifiable information from text */
  async redact(text, entities) {
    return this.request("/api/v1/redact", {
      method: "POST",
      body: { text, entities }
    });
  }
  // --- AI Gateway ---
  /** Send a chat completion request through the unified AI gateway */
  async chat(request) {
    const body = { ...request };
    if (!body.gateway_mode && this.defaultGatewayMode) {
      body.gateway_mode = this.defaultGatewayMode;
    }
    return this.request("/api/v1/ai/chat", {
      method: "POST",
      body
    });
  }
  /** Get current credit balance for dedicated mode */
  async getCreditBalance() {
    return this.request("/api/v1/ai/manage/credits/balance");
  }
  /** Get credit transaction history */
  async getCreditTransactions() {
    return this.request("/api/v1/ai/manage/credits/transactions");
  }
  // --- Prompt Sanitizer ---
  /** Detect and neutralize prompt injection attacks */
  async sanitize(prompt, strict) {
    return this.request("/api/v1/sanitize", {
      method: "POST",
      body: { prompt, strict }
    });
  }
  // --- URL Shortener ---
  /** Create a short URL with QR code */
  async shorten(url, customCode) {
    return this.request("/api/v1/shorten", {
      method: "POST",
      body: { url, customCode }
    });
  }
  /** Get click analytics for a short URL */
  async getShortUrlStats(code) {
    return this.request(`/api/v1/shorten/${code}/stats`);
  }
  // --- Roast Tool ---
  /** Generate an AI roast for text content */
  async roast(text, type, severity) {
    return this.request("/api/v1/roast", {
      method: "POST",
      body: { text, type, severity }
    });
  }
  // --- Input Validation ---
  /** Validate an email, phone, URL, or domain */
  async validate(type, value, deep) {
    return this.request("/api/v1/validate", {
      method: "POST",
      body: { type, value, deep }
    });
  }
  // --- OCR / Text Extraction ---
  /** Extract text from an image */
  async ocr(image, format, language) {
    return this.request("/api/v1/ocr", {
      method: "POST",
      body: { image, format, language }
    });
  }
  // --- Translation ---
  /** Translate text between languages */
  async translate(text, to, from, model) {
    return this.request("/api/v1/translate", {
      method: "POST",
      body: { text, to, from, model }
    });
  }
  // --- Screenshot ---
  /** Capture a screenshot of a URL */
  async screenshot(url, options) {
    return this.request("/api/v1/screenshot", {
      method: "POST",
      body: { url, ...options }
    });
  }
  // --- Sentiment Analysis ---
  /** Analyze sentiment of text */
  async sentiment(text, granularity) {
    return this.request("/api/v1/sentiment", {
      method: "POST",
      body: { text, granularity }
    });
  }
  // --- Summarization ---
  /** Summarize text or a web page */
  async summarize(options) {
    return this.request("/api/v1/summarize", {
      method: "POST",
      body: options
    });
  }
  // --- PDF Generation ---
  /** Generate a PDF from HTML content or a URL */
  async generatePdf(options) {
    return this.request("/api/v1/pdf", {
      method: "POST",
      body: options
    });
  }
  // --- Email Verification ---
  /** Verify an email address for deliverability and validity */
  async verifyEmail(email, deep) {
    return this.request("/api/v1/email-verify", {
      method: "POST",
      body: { email, deep }
    });
  }
  // --- DNS / WHOIS Lookup ---
  /** Look up DNS records and optionally WHOIS data for a domain */
  async dnsLookup(domain, types, whois) {
    return this.request("/api/v1/dns", {
      method: "POST",
      body: { domain, types, whois }
    });
  }
  // --- IP Geolocation & Threat Intel ---
  /** Get geolocation and threat intelligence for an IP address */
  async ipIntel(ip, deep) {
    return this.request("/api/v1/ip-intel", {
      method: "POST",
      body: { ip, deep }
    });
  }
  // --- Webhook Delivery ---
  /** Deliver a webhook to a URL with retry and signing support */
  async deliverWebhook(options) {
    return this.request("/api/v1/webhook-deliver", {
      method: "POST",
      body: options
    });
  }
  // --- HTML/Markdown Sanitizer ---
  /** Sanitize HTML or Markdown input by stripping dangerous tags and attributes */
  async sanitizeHtml(input, options) {
    return this.request("/api/v1/html-sanitize", {
      method: "POST",
      body: { input, ...options }
    });
  }
};
var index_default = DicklessSDK;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DicklessSDK
});
