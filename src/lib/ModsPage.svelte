<script lang="ts">
  import ModCatalog from '$lib/ModCatalog.svelte';
  import SiteFooter from '$lib/SiteFooter.svelte';
  import SiteHeader from '$lib/SiteHeader.svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale, localizeUrl } from '$lib/paraglide/runtime';
  import { SITE_ORIGIN } from '$lib/site';

  const locale = $derived(getLocale());
  const canonical = $derived(localizeUrl(`${SITE_ORIGIN}/mods/`, { locale }).href);
  const ruUrl = $derived(localizeUrl(`${SITE_ORIGIN}/mods/`, { locale: 'ru' }).href);
  const enUrl = $derived(localizeUrl(`${SITE_ORIGIN}/mods/`, { locale: 'en' }).href);
</script>

<svelte:head>
  <title>{m.catalog_seo_title()}</title>
  <meta name="description" content={m.catalog_seo_description()} />
  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="ru" href={ruUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="KZM" />
  <meta property="og:title" content={m.catalog_seo_title()} />
  <meta property="og:description" content={m.catalog_seo_description()} />
  <meta property="og:url" content={canonical} />
</svelte:head>

<a class="skip-link" href="#main">{m.skip_link()}</a>
<SiteHeader current="mods" />
<main id="main" class="mods-page">
  <ModCatalog page />
</main>
<SiteFooter current="mods" />
