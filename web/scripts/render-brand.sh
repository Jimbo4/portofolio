#!/usr/bin/env bash
# Render the site icons and the default link preview from scripts/visuals/brand.html. Not part of the site build.
# Usage (from web/, in Git Bash): scripts/render-brand.sh
#
# Outputs:
#   src/app/favicon.ico            16, 32 and 48px (bolder "icon-sm" tile), browser tabs
#   src/app/icon.png               32px, high-density tabs
#   src/app/apple-icon.png         180px full-bleed square, iOS home screen (iOS rounds the corners)
#   public/icon-192.png, -512.png  rounded tile with transparent corners, web app manifest
#   src/app/opengraph-image.png    1200x630 link preview, also copied to twitter-image.png
set -euo pipefail

chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
ffmpeg="${FFMPEG_DIR:-/c/Users/JacopoMarcolini/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin}/ffmpeg"
html_url="file:///$(cygpath -m "$(realpath scripts/visuals/brand.html)")"
tmp="$(mktemp -d)"

# shot <view> <width> <height> <out.png> [scale]: transparent background, device scale factor 1 unless given
shot() {
  "$chrome" --headless=new --hide-scrollbars --default-background-color=00000000 \
    --virtual-time-budget=6000 --force-device-scale-factor="${5:-1}" --window-size="$2,$3" \
    --screenshot="$(cygpath -m "$4")" "$html_url?v=$1" 2>/dev/null
}

# resize <in.png> <size> <out.png>: square downscale that keeps the alpha channel
resize() { "$ffmpeg" -v error -y -i "$1" -vf "scale=$2:$2:flags=lanczos,format=rgba" "$3"; }

shot icon-sm 512 512 "$tmp/sm.png"
shot icon 512 512 "$tmp/icon.png"
shot apple 512 512 "$tmp/apple.png"
shot og 1200 630 "$tmp/og@2x.png" 2

for size in 16 32 48; do resize "$tmp/sm.png" "$size" "$tmp/sm-$size.png"; done
cp "$tmp/sm-32.png" src/app/icon.png
"$ffmpeg" -v error -y -i "$tmp/apple.png" -vf "scale=180:180:flags=lanczos,format=rgb24" src/app/apple-icon.png
resize "$tmp/icon.png" 192 public/icon-192.png
resize "$tmp/icon.png" 512 public/icon-512.png
"$ffmpeg" -v error -y -i "$tmp/og@2x.png" -vf "scale=1200:630:flags=lanczos,format=rgb24" src/app/opengraph-image.png
cp src/app/opengraph-image.png src/app/twitter-image.png

# Pack the three PNGs into one .ico (PNG-compressed entries, supported by every current browser)
python - "$tmp/sm-16.png" "$tmp/sm-32.png" "$tmp/sm-48.png" src/app/favicon.ico <<'PY'
import struct, sys
*pngs, out = sys.argv[1:]
data = [open(p, "rb").read() for p in pngs]
sizes = [struct.unpack(">II", d[16:24]) for d in data]
offset = 6 + 16 * len(data)
header = struct.pack("<HHH", 0, 1, len(data))
entries = b""
for (w, h), d in zip(sizes, data):
    entries += struct.pack("<BBBBHHII", w % 256, h % 256, 0, 0, 1, 32, len(d), offset)
    offset += len(d)
open(out, "wb").write(header + entries + b"".join(data))
PY

rm -rf "$tmp"
ls -la src/app/favicon.ico src/app/icon.png src/app/apple-icon.png src/app/opengraph-image.png public/icon-*.png
