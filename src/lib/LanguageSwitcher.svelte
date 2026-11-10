<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale, localizeHref } from '$lib/paraglide/runtime';

  const locale = $derived(getLocale());
  let { path = '/' }: { path?: string } = $props();
  const ruHref = $derived(localizeHref(path, { locale: 'ru' }));
  const enHref = $derived(localizeHref(path, { locale: 'en' }));
</script>

<nav class="lang-switch" aria-label={m.lang_switch()}>
  <a
    href={ruHref}
    class:active={locale === 'ru'}
    hreflang="ru"
    lang="ru"
    data-sveltekit-reload
    aria-current={locale === 'ru' ? 'page' : undefined}
  >{m.lang_ru()}</a>
  <span class="lang-divider" aria-hidden="true">/</span>
  <a
    href={enHref}
    class:active={locale === 'en'}
    hreflang="en"
    lang="en"
    data-sveltekit-reload
    aria-current={locale === 'en' ? 'page' : undefined}
  >{m.lang_en()}</a>
</nav>

<style>
  .lang-switch {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-size: var(--text-small);
    color: var(--secondary);
  }
  .lang-switch a {
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
    padding: 0 .25rem;
    color: inherit;
  }
  .lang-switch a:hover { color: var(--ink); }
  .lang-switch a.active { color: var(--ink); font-weight: 500; }
  .lang-divider { opacity: .45; user-select: none; }
</style>
