#!/usr/bin/env bash
# Optimizează imagini și video generate cu AI pentru site și scrie tag-ul HTML.
#
#   optimizeaza.sh img   <sursa> <nume> [dir] [latimi]  → <nume>-900.webp, <nume>-1800.webp + <img srcset>
#   optimizeaza.sh video <sursa> <nume> [dir] [latime]  → <nume>.mp4, <nume>.webm, <nume>-poster.webp + <video>
#
# dir implicit: assets/img (imagini) și assets/video (video), convenția din acest repo.
# Pe Arch: sudo pacman -S ffmpeg. Alt binar: FFMPEG=/cale/ffmpeg optimizeaza.sh …
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
command -v "$FFMPEG" >/dev/null || { echo "Lipsește ffmpeg (Arch: sudo pacman -S ffmpeg)" >&2; exit 1; }

# Dimensiunea unui fișier media, citită din ieșirea lui ffmpeg (nu depinde de ffprobe).
dimensiuni() {
  "$FFMPEG" -hide_banner -i "$1" 2>&1 | grep -m1 -oE 'Video: .*' | grep -oE '[0-9]{2,5}x[0-9]{2,5}' | head -1
}

img() {
  local src="$1" nume="$2" dir="${3:-assets/img}" latimi="${4:-900 1800}"
  mkdir -p "$dir"
  local srcset="" ultim="" w h
  for lat in $latimi; do
    local out="$dir/$nume-$lat.webp"
    # Nu mări niciodată peste rezoluția sursei; -2 păstrează proporția cu înălțime pară.
    # Calitatea 80 e punctul în care WebP nu mai are artefacte vizibile la fotografii.
    "$FFMPEG" -hide_banner -loglevel error -y -i "$src" \
      -vf "scale='min($lat,iw)':-2" -c:v libwebp -quality 80 -compression_level 6 "$out"
    srcset+="${srcset:+, }$out ${lat}w"
    ultim="$out"
    echo "  $out  $(du -h "$out" | cut -f1)" >&2
  done
  IFS=x read -r w h <<<"$(dimensiuni "$ultim")"
  cat <<EOF
<img src="$ultim" srcset="$srcset" sizes="100vw" width="$w" height="$h" loading="lazy" alt="DESCRIE IMAGINEA ÎN ROMÂNĂ">
EOF
}

video() {
  local src="$1" nume="$2" dir="${3:-assets/video}" lat="${4:-1280}"
  mkdir -p "$dir"
  # Fără sunet (hero video e mereu mut), 24 fps ajunge pentru fundal, scalat la lățimea cerută.
  local vf="scale='min($lat,iw)':-2,fps=24"
  # CRF 28 pe H.264 / 36 pe VP9: clipurile AI nu au zgomot de senzor, deci suportă compresie mare.
  "$FFMPEG" -hide_banner -loglevel error -y -i "$src" -an -vf "$vf" \
    -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart "$dir/$nume.mp4"
  "$FFMPEG" -hide_banner -loglevel error -y -i "$src" -an -vf "$vf" \
    -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 "$dir/$nume.webm"
  # Posterul e primul cadru, ca trecerea de la poster la video să nu se vadă.
  "$FFMPEG" -hide_banner -loglevel error -y -i "$src" -frames:v 1 \
    -vf "scale='min($lat,iw)':-2" -c:v libwebp -quality 75 "$dir/$nume-poster.webp"
  for f in "$dir/$nume.mp4" "$dir/$nume.webm" "$dir/$nume-poster.webp"; do
    echo "  $f  $(du -h "$f" | cut -f1)" >&2
  done
  local w h
  IFS=x read -r w h <<<"$(dimensiuni "$dir/$nume.mp4")"
  cat <<EOF
<video autoplay muted loop playsinline preload="metadata" poster="$dir/$nume-poster.webp" width="$w" height="$h" aria-hidden="true">
  <source src="$dir/$nume.webm" type="video/webm">
  <source src="$dir/$nume.mp4" type="video/mp4">
</video>
EOF
}

case "${1:-}" in
  img)   shift; [ $# -ge 2 ] || { echo "Folosire: $0 img <sursa> <nume> [dir] [latimi]" >&2; exit 1; }; img "$@" ;;
  video) shift; [ $# -ge 2 ] || { echo "Folosire: $0 video <sursa> <nume> [dir] [latime]" >&2; exit 1; }; video "$@" ;;
  *) sed -n '2,8p' "$0"; exit 1 ;;
esac
