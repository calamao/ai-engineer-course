# Practice 4

Run with the default logical model:

```shell
npm run practice-4
```

Or choose a model explicitly:

```shell
npm run practice-4 -- rapido
npm run practice-4 -- potente
```

# Analisis

[analisis.md](./analisis.md)

# Adapter contract

The application does not depend directly on a provider SDK. It uses the `Adapter` interface:

- `complete(request, model, destination)` receives a shared `CompletionRequest` (`text`, optional `system`, and `maxTokens`) and returns a `UnifiedResponse`.
- The unified response always contains `text`, `finishReason`, normalized `usage` (`input`, `output`, `total`), `model`, and `destination`.
- `usage` values may be `null` when the provider does not return them.
- Each adapter translates provider requests and responses, including provider-specific errors.

The application chooses a logical model from `config.json`, and falls back to the next destination only for transient errors (timeouts, 429, or 5xx). A request error such as 400 stops immediately.

# Adding a new destination

1. **Create the adapter:** add a factory that implements `Adapter` and normalizes the provider response into `UnifiedResponse`. Read `api_key_env` and `base_url_env` from `DestinationConfig`, and use the destination name in the result.
2. **Register its format:** add the new format to `DestinationConfig["format"]` in `types.ts`, and extend `createAdapter()` in `adapters.ts` to return the new adapter.
3. **Configure the destination:** add an entry under `destinations` in `config.json`:

```json
"nuevo_destino": {
  "format": "nuevo_formato",
  "base_url_env": "NUEVO_BASE_URL",
  "api_key_env": "NUEVO_API_KEY"
}
```

4. **Add environment variables** to `.env` and optionally configure a timeout such as `NUEVO_TIMEOUT`.
5. **Use it from a logical model:** add `{ "destination": "nuevo_destino", "model": "provider-model" }` to `logical_models`, alone or before/after fallback destinations.

# Run screenshots

- [Fast result](./deliverables/result-curso-fast.png)
- [Chaos result](./deliverables/result-curso-chaos.png)
- [Fallback after chaos error](./deliverables/fallback-after-chaos-error-result-curso_anthropic.png)
