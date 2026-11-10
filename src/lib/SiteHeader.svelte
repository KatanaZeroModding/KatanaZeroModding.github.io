<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowUpRight, GitFork } from '@lucide/svelte';
  import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';
  import { links } from '$lib/links';
  import { m } from '$lib/paraglide/messages.js';
  import { localizeHref } from '$lib/paraglide/runtime';

  let { current }: { current: 'home' | 'mods' } = $props();
  const homeHref = $derived(localizeHref('/'));
  const aboutHref = $derived(`${homeHref}#about`);
  const modsHref = $derived(localizeHref('/mods/'));
</script>

<header id="top" class="site-header">
  <div class="header-inner mx-auto flex items-center justify-between gap-6">
    <a class="wordmark brand-lockup" href={homeHref} aria-label={m.brand_home()}>
      <img class="brand-logo" src="{base}/brand/logotype-pixel.png" alt="" width="32" height="32" />
      <span class="brand-word">KZM</span>
    </a>
    <nav aria-label={m.nav_label()} class="header-nav flex items-center gap-8">
      <a class="nav-link" href={aboutHref}>{m.nav_about()}</a>
      <a class="nav-link" href={modsHref} aria-current={current === 'mods' ? 'page' : undefined}>{m.nav_mods()}</a>
      <a class="nav-link" href={links.docs} target="_blank" rel="noopener noreferrer">{m.nav_devs()} <ArrowUpRight size={16} /></a>
      <LanguageSwitcher path={current === 'mods' ? '/mods/' : '/'} />
      <a class="header-github" href={links.source} target="_blank" rel="noopener noreferrer" aria-label={m.nav_github()}><GitFork size={16} /></a>
    </nav>
  </div>
</header>
