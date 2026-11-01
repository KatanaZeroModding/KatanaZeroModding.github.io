# Вывеска KZMOD

Создана встроенным imagegen из оригинального `static/bar/bg_bar.png`.
Файл результата: `static/bar/kzmod-sign-source.png`.
В сцене используется только внутренний прямоугольник вывески x=293, y=163,
104×19 исходных пикселей. Canvas переносит его с nearest-neighbor;
остальной фон, рамка и персонажи остаются исходными. Статичный запасной
кадр использует тот же фрагмент. Оригинальные изображения сохранены.

Промпт: Replace ONLY the Asian lettering in the neon sign with exactly
KZMOD, spelled K Z M O D, uppercase Latin letters. Match the original
lettering character: expressive, sprawling, loose handwritten angular
strokes, slightly forward slanted, irregular lively shapes, open counters,
modest thin red strokes about 1–2 original pixels thick with occasional
3px joins. Use nearly the whole inner sign width. NOT heavy bold block
font, NOT evenly typeset, NOT a clean modern geometric logo. Think quick
confident gestural neon graffiti in authentic original game pixel art,
with broken pixel edges and sparse brighter red highlight pixels.
Preserve legibility of all five letters. Preserve the existing frame,
dark interior, surrounding background, layout, black margins, and original
640×360 composition. No characters, extra words, decorative swooshes,
or watermark.

Уточнение к промпту: Image 1 (the first block-letter variant) is the
authoritative sign background. Preserve its small, dense, subtle
low-contrast pixel dither / fine diagonal micro-mesh. Image 2 is only
the lettering reference: thin sweeping forward-slanted red handwritten
KZMOD. Replace the thick letters of image 1 with the thin letters of
image 2. Keep the mesh as dense and fine-grained as image 1, with tiny
1–2 native pixel cells. No large diamond lattice or bright crossing lines.
