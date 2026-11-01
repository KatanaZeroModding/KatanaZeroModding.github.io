<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  let { barAria, barSr }: { barAria: string; barSr: string } = $props();
  import sprites from './bar-sprites.json';
  import { sampleScene, type SpriteName, type SpriteFrame } from './bar-animation';

  const sceneScale = 2.134;
  // Center the scaled background inside the fixed canvas before viewport cropping.
  const sceneOffsetX = (1280 - sprites.bg_bar.width * sceneScale) / 2;
  // The sign spans x=290–400 in the original 640px background.
  const signAnchorX = `${((345 * sceneScale + sceneOffsetX) / 1280) * 100}%`;

  let canvas = $state<HTMLCanvasElement>();
  let failed = $state(false);

  onMount(() => {
    const element = canvas;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) { failed = true; return; }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motion.matches;
    let disposed = false;
    let raf = 0;
    let visible = !document.hidden;
    let inView = true;
    let elapsed = 0;
    let last = 0;
    let lastDraw = -1;
    const images = new Map<SpriteName, CanvasImageSource>();

    function matchSiteBackdrop(img: HTMLImageElement) {
      const surface = document.createElement('canvas');
      surface.width = img.naturalWidth;
      surface.height = img.naturalHeight;
      const gfx = surface.getContext('2d', { willReadFrequently: true });
      if (!gfx) return img;
      gfx.drawImage(img, 0, 0);
      const frame = gfx.getImageData(0, 0, surface.width, surface.height);
      const pixels = frame.data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] < 8 && pixels[i + 1] < 8 && pixels[i + 2] < 8 && pixels[i + 3] > 200) {
          pixels[i] = 0x10;
          pixels[i + 1] = 0x10;
          pixels[i + 2] = 0x14;
        }
      }
      gfx.putImageData(frame, 0, 0);
      return surface;
    }

    function drawSprite(item: SpriteFrame) {
      const sprite = sprites[item.name];
      const img = images.get(item.name);
      if (!img) return;
      const frame = item.frame;
      const scale = item.scale ?? 1;
      context!.save();
      context!.globalAlpha = item.opacity ?? 1;
      context!.translate(item.x, item.y);
      context!.scale(item.mirror ? -scale : scale, scale);
      context!.drawImage(img, frame * sprite.width, 0, sprite.width, sprite.height,
        -sprite.originX, -sprite.originY, sprite.width, sprite.height);
      context!.restore();
    }

    function draw() {
      context!.imageSmoothingEnabled = false;
      context!.clearRect(0, 0, 1280, 500);
      context!.fillStyle = '#101014';
      context!.fillRect(0, 0, 1280, 500);
      context!.save();
      // bg_bar art ends at y=273; scale so that row lands on the canvas bottom.
      context!.translate(sceneOffsetX, 0);
      context!.scale(sceneScale, sceneScale);
      context!.translate(0, -39);
      drawSprite({ name: 'bg_bar', x: 0, y: 0, frame: 0 });
      sampleScene(elapsed).actors.forEach(drawSprite);
      context!.restore();
    }

    function tick(now: number) {
      raf = 0;
      if (disposed) return;
      if (visible && inView && !reduceMotion) {
        if (last) elapsed += Math.min((now - last) / 1000, 0.1);
        if (now - lastDraw >= 1000 / 30) { draw(); lastDraw = now; }
        last = now;
        raf = requestAnimationFrame(tick);
      } else { last = 0; draw(); }
    }

    const render = () => {
      if (raf) cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => { visible = !document.hidden; render(); };
    const onMotion = () => { reduceMotion = motion.matches; render(); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; render(); });

    Promise.all((Object.keys(sprites) as SpriteName[]).map((name) => new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => { images.set(name, name === 'bg_bar' ? matchSiteBackdrop(img) : img); resolve(); };
      img.onerror = () => reject(new Error(`Could not load ${name}`));
      img.src = `${base}${sprites[name].src}`;
    }))).then(() => {
      if (disposed) return;
      draw();
      observer.observe(element);
      render();
    }).catch(() => { if (!disposed) failed = true; });

    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
    };
  });
</script>

<div class="bar-scene" style:--scene-sign-x={signAnchorX}>
  <img class="bar-fallback" src="{base}/bar/poster.png" alt="" aria-hidden="true" width="1280" height="500" fetchpriority="high" />
  {#if !failed}
    <canvas bind:this={canvas} width="1280" height="500" aria-label={barAria}></canvas>
  {:else}
    <span class="sr-only">{barSr}</span>
  {/if}
</div>
