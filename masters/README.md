# Masters

Originales a máxima calidad. **No se despliegan**: viven fuera de `public/`
para que no se suban al servidor ni cuenten en el peso del sitio.

- `scooter_video.mp4` — 3852×2152, 24 fps, 8,2 Mbps, 5,1 MB.
  Fuente de `public/videos/hero.mp4` y `public/videos/hero-movil.mp4`.

Regenerar las variantes web:

```
ffmpeg -i masters/scooter_video.mp4 -vf scale=1920:-2:flags=lanczos \
  -c:v libx264 -profile:v high -preset slow -crf 21 -pix_fmt yuv420p \
  -movflags +faststart -an public/videos/hero.mp4

ffmpeg -i masters/scooter_video.mp4 -vf scale=960:-2:flags=lanczos \
  -c:v libx264 -profile:v main -preset slow -crf 25 -pix_fmt yuv420p \
  -movflags +faststart -an public/videos/hero-movil.mp4
```
