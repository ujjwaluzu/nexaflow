interface CloudflareEnv {
  ENQUIRY_RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
}
