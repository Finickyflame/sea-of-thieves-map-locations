# Sea of Thieves map locations
## Init
Install packages:
```bash
npm install
```

Install workbox (to generate service worker)
```bash
npm install workbox-cli -g
```

Install and Login to firebase (to deploy):
```bash
npm install firebase -g
firebase login
```

## Scripts
Build everything:
```bash
npm run build
```

Build only Json `./data/locations.json`:
```bash
npm run build json
```

Build only public html `./public/index.html`:
```bash
npm run build html
```

Build only public images `./public/images/*.png`:
```bash
npm run build images
```

Build service worker:
```bash
workbox generateSW workbox-config.js
```

Publish:
```bash
npm run publish
```