#!/bin/sh
# Encode a capture.mjs frame folder to a web-ready MP4 with correct colour.
#   ./encode.sh <framesDir> <out.mp4> <firstFrame> <frameCount> [fps]
# firstFrame is the 1-based index of the first frame to keep; frameCount how many to keep.
# FFMPEG overrides the binary. The JPEG frames are full-range BT.601; the output is limited-range
# BT.709 and tagged as such, so players do not guess and shift the colours.
set -eu
FFMPEG="${FFMPEG:-ffmpeg}"
DIR=$1; OUT=$2; FIRST=$3; COUNT=$4; FPS=${5:-60}
"$FFMPEG" -hide_banner -loglevel error -y -framerate "$FPS" -start_number "$FIRST" -i "$DIR/f_%05d.jpg" -frames:v "$COUNT" \
  -vf "scale=in_range=full:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
  -c:v libx264 -preset slow -crf 14 -profile:v high -level 4.2 \
  -x264-params "colorprim=bt709:transfer=bt709:colormatrix=bt709:fullrange=off" \
  -movflags +faststart -an "$OUT"
echo "wrote $OUT"
