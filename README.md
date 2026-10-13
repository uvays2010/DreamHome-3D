# DreamHome 3D

React + Three.js asosida 3D uy dizayn dasturi.

## O‘rnatish

```bash
npm install --legacy-peer-deps
npm run dev
```

## Netlify ga chiqarish

### 1-usul: Drag & Drop (eng oson)

1. Loyihani build qiling:
```bash
npm run build
```

2. `dist` papkasini Netlify ga tortib tashlang:  
   https://app.netlify.com/drop

### 2-usul: Git orqali

1. Loyihani GitHub ga yuklang
2. Netlify da **New site from Git** ni tanlang
3. Repo ni ulang
4. Build sozlamalari:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy qiling

`netlify.toml` fayli allaqachon tayyor — SPA routing uchun redirectlar qo‘shilgan.
