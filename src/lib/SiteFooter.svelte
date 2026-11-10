<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowUpRight } from '@lucide/svelte';
  import { links } from '$lib/links';
  import { m } from '$lib/paraglide/messages.js';
  import { localizeHref } from '$lib/paraglide/runtime';

  let { current }: { current: 'home' | 'mods' } = $props();
  const topHref = $derived(`${localizeHref(current === 'mods' ? '/mods/' : '/')}#top`);
</script>

<footer class="site-footer content-width mx-auto">
  <div class="footer-top flex flex-wrap items-center justify-between gap-6">
    <a class="wordmark brand-lockup" href={topHref} aria-label={m.brand_top()}>
      <img class="brand-logo" src="{base}/brand/logotype-pixel.png" alt="" width="32" height="32" />
      <span class="brand-word">KZM</span>
    </a>
    <p>{m.footer_made()} <a href={links.author} target="_blank" rel="noopener noreferrer">An1by <ArrowUpRight size={16} /></a></p>
    <a class="footer-domain" href={topHref}>kzm.bar</a>
  </div>
  <p class="legal">{m.footer_legal()}<br />{m.footer_legal2()}</p>
</footer>
