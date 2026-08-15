# SvelteKit Bunny Demo.

Minimale SvelteKit app (Home / About / Contact) met [`sveltekit-adapter-bunny`](https://github.com/planza-digital/sveltekit-adapter-bunny) om Bunny.net Edge Scripting uit te proberen.

## Lokaal

Node 22+ aanbevolen (Vite 8).

```bash
npm install
npm run dev
```

Pagina's:

- `/` — Home
- `/about` — About
- `/contact` — Contactformulier (form action)

## Build voor Bunny

```bash
npm run build
```

Output staat in `.svelte-kit/bunny.net/`:

- `index.js` — Edge Script bundle
- `client/` — static/client assets

## Deploy naar Bunny

1. Maak een **Storage Zone** voor assets en een **Edge Script**.
2. Kopieer `.env.example` naar `.env` en vul je Bunny-waarden in.
3. Zet dezelfde asset-env vars ook op je Edge Script (runtime).
4. Build + deploy:

```bash
cp .env.example .env
# vul .env in
npm run build
npm run deploy
```

`npm run deploy` uploadt de scriptcode en client assets via de CLI van de adapter.

### Env vars

| Var | Gebruik |
| --- | --- |
| `BUNNY_ASSETS_PREFIX` | Map/prefix in Storage |
| `BUNNY_ASSETS_REGION` | Storage hostname (bijv. `storage.bunnycdn.com`) |
| `BUNNY_ASSETS_ZONE` | Storage zone naam |
| `BUNNY_ASSETS_KEY` | Read access key (runtime) |
| `BUNNY_ASSETS_UPLOAD_KEY` | Write access key (deploy) |
| `BUNNY_CODE_ID` | Edge Script ID |
| `BUNNY_CODE_KEY` | Bunny API AccessKey |

## Notities

- De adapter staat (nog) niet op npm; dit project installeert hem vanaf GitHub.
- Bunny Edge Scripting is Deno-gebaseerd: één serverbundle, assets via Storage.
- Zie [adapter README](https://github.com/planza-digital/sveltekit-adapter-bunny) en [Bunny Edge Scripting limits](https://docs.bunny.net/docs/edge-scripting-limits).
