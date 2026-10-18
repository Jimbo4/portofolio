#!/usr/bin/env bash
# Write a 1200x600 JPG next to every case study hero (hero-v3.webp → hero-v3.jpg), used as the link preview image:
# LinkedIn and some chat apps don't show WebP previews. Run after adding or replacing a hero. Not part of the build.
# Usage (from web/, in Git Bash): scripts/render-og.sh
set -euo pipefail
ffmpeg="${FFMPEG_DIR:-/c/Users/JacopoMarcolini/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin}/ffmpeg"

for mdx in content/case-studies/*.mdx; do
  hero="$(sed -n 's/^  hero: *\(\/images\/[^ ]*\.webp\).*/\1/p' "$mdx")"
  [[ -z "$hero" ]] && { echo "no hero in $mdx" >&2; exit 1; }
  out="public${hero%.webp}.jpg"
  "$ffmpeg" -v error -y -i "public$hero" -vf "scale=1200:600:flags=lanczos" -q:v 3 "$out"
  echo "$out"
done
