# 🔥 Kıvılcım

Arkadaş ortamı için kart oyunu. 100 soru, telefonu elden ele dolaştır, ortamı kızıştır.

## Özellikler

- **100 hazır soru** — kızıştırıcı, utandırıcı, derin
- **Sıra tabanlı** — telefon elden ele dolaşır, herkes sırayla kart çeker
- **Tekrarsız** — bir soru, bir seansta yalnızca bir kez çıkar
- **Kart düzenleme** — kendi sorularını ekle/sil/düzenle, localStorage'da saklanır
- **PWA** — "Ana ekrana ekle" deyip uygulama gibi aç
- **Tamamen istemci tarafı** — backend yok, Vercel free tier'da ücretsiz

## Yerelde Çalıştır

```bash
npm install
npm run dev
```

`http://localhost:3000`

## Vercel'e Deploy

### Yöntem 1: GitHub + Vercel (önerilen)

```bash
git init
git add .
git commit -m "init kivilcim"
gh repo create kivilcim --private --source=. --push
# veya manuel: GitHub'da repo aç, push et
```

Sonra [vercel.com/new](https://vercel.com/new) → GitHub repo'sunu seç → Deploy. Tamam.

### Yöntem 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

Sorulanları geç, `vercel --prod` ile canlıya al.

## Mobilde PWA Olarak Kullan

1. Deploy ettikten sonra üretilen URL'yi (örn. `kivilcim.vercel.app`) telefonda Safari/Chrome'da aç
2. **iOS**: Paylaş menüsü → "Ana Ekrana Ekle"
3. **Android**: Menü (⋮) → "Ana ekrana ekle" veya "Uygulamayı yükle"

Artık ana ekranda ikon olarak durur, uygulama gibi tam ekran açılır.

## Dosya Yapısı

```
app/
  layout.tsx        # PWA meta etiketleri, viewport
  page.tsx          # Ana sayfa
  globals.css       # Tailwind + özel animasyonlar
  manifest.ts       # PWA manifest
  icon.tsx          # Dinamik ikon (favicon + PWA)
  apple-icon.tsx    # iOS ana ekran ikonu
components/
  KivilcimApp.tsx   # Tüm uygulama mantığı tek dosyada
lib/
  questions.ts      # 100 varsayılan soru
  storage.ts        # localStorage wrapper
```

## Özelleştirme

- **Sorular**: `lib/questions.ts` dosyasında düzenle (ya da uygulamadan)
- **Renkler**: `tailwind.config.ts` içindeki `colors`
- **Uygulama adı/ikon**: `app/manifest.ts`, `app/icon.tsx`, `app/apple-icon.tsx`

## Lisans

Kişisel kullanım için. İstediğin gibi fork'la, değiştir.
