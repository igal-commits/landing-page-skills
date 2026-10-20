"""Per-frame analysis of a capture.mjs folder: frozen runs and motion spikes.

    python3 analyze.py <framesDir> [fps]

A frozen run is a stretch of identical frames. Short ones inside a pinned scene are normal (the
scene is holding). Long ones in the middle of a scroll are dead zones: speed the scroll up there.
"""
import glob, sys
import numpy as np
from PIL import Image

d = sys.argv[1]; fps = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
frames = sorted(glob.glob(d + '/f_*.jpg'))
prev = None; diffs = []
for f in frames:
    a = np.asarray(Image.open(f).convert('L').resize((480, 270)), dtype=np.float64)
    if prev is not None:
        diffs.append(np.abs(a - prev).mean())
    prev = a
diffs = np.array(diffs)
runs, run = [], 0
for i, x in enumerate(diffs):
    if x < 0.02: run += 1
    else:
        if run >= 6: runs.append((round((i - run + 1) / fps, 2), round(run / fps, 2)))
        run = 0
if run >= 6: runs.append((round((len(diffs) - run + 1) / fps, 2), round(run / fps, 2)))
print(f'{len(frames)} frames, {len(frames) / fps:.2f} s')
print('frozen runs of 0.1 s or more (start s, length s):', runs)
top = np.argsort(diffs)[-5:][::-1]
print('largest frame-to-frame changes (time s, change):', [(round((int(i) + 2) / fps, 2), round(float(diffs[i]), 1)) for i in top])
