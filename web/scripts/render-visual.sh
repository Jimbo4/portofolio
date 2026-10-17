#!/usr/bin/env bash
# Render one view of an HTML composition in scripts/visuals/ to a WebP in public/. Not part of the site build.
#
# Each composition file holds several views (<section id="...">), picked with ?v=<id>.
# Usage (from web/, in Git Bash):
#   scripts/render-visual.sh <html> <view> <width>x<height> <out.webp> [output width]
# Example:
#   scripts/render-visual.sh scripts/visuals/ai-training-program.html hero 2400x1200 \
#     public/images/case-studies/ai-training-program/hero-v2.webp
#   scripts/render-visual.sh scripts/visuals/ai-training-program.html card 1200x1500 \
#     public/images/case-studies/ai-training-program/card-v2.webp 960
# BUDGET=<ms> overrides the virtual time budget (default 8000), e.g. for covers made of many iframes.
# Views that use three.js need WebGL: headless Chrome runs it on SwiftShader (flags below).
# SWIFTSHADER=0 drops those flags for CSS-only views with many layers, which can exhaust SwiftShader and render blank.
set -euo pipefail

html="$1"; view="$2"; size="$3"; out="$4"; out_width="${5:-}"
budget="${BUDGET:-8000}" # raise for views that load many iframes
gpu_flags=(--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist)
[[ "${SWIFTSHADER:-1}" == "0" ]] && gpu_flags=()
chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
ffmpeg_dir="${FFMPEG_DIR:-/c/Users/JacopoMarcolini/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin}"

tmp_png="$(mktemp -u).png"
html_url="file:///$(cygpath -m "$(realpath "$html")")?v=$view"

"$chrome" --headless=new --hide-scrollbars --allow-file-access-from-files \
  "${gpu_flags[@]}" \
  --virtual-time-budget="$budget" --force-device-scale-factor=1 --window-size="${size/x/,}" \
  --screenshot="$(cygpath -m "$tmp_png")" "$html_url" 2>/dev/null

filter=()
[[ -n "$out_width" ]] && filter=(-vf "scale=$out_width:-1:flags=lanczos")
"$ffmpeg_dir/ffmpeg" -v error -y -i "$tmp_png" "${filter[@]}" -c:v libwebp -quality 82 "$out"
rm -f "$tmp_png"
echo "$out"
