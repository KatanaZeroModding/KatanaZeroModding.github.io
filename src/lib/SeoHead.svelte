<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale, localizeUrl } from '$lib/paraglide/runtime';
  import { SITE_ORIGIN } from '$lib/site';

  const locale = $derived(getLocale());
  const canonical = $derived(localizeUrl(`${SITE_ORIGIN}/`, { locale }).href.replace(/\/$/, '') + '/');
  const ruUrl = `${SITE_ORIGIN}/`;
  const enUrl = `${SITE_ORIGIN}/en/`;
  const ogLocale = $derived(locale === 'en' ? 'en_US' : 'ru_RU');
  const ogLocaleAlt = $derived(locale === 'en' ? 'ru_RU' : 'en_US');

  const jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_ORIGIN}/#website`,
          url: SITE_ORIGIN,
          name: 'KZM',
          description: m.seo_description(),
          inLanguage: [locale],
          publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        },
        {
          '@type': 'Organization',
          '@id': `${SITE_ORIGIN}/#organization`,
          name: 'Katana ZERO Modding (KZM)',
          url: SITE_ORIGIN,
          logo: `${SITE_ORIGIN}/brand/logotype-512.png`,
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${SITE_ORIGIN}/#launcher`,
          name: 'KZM Launcher',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Windows',
          description: m.seo_description(),
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          downloadUrl: 'https://github.com/KatanaZeroModding/KZM/releases/latest',
          softwareHelp: 'https://github.com/KatanaZeroModding/KZM/blob/main/docs/MODDING.md',
          isAccessibleForFree: true,
        },
        {
          '@type': 'HowTo',
          name: locale === 'ru' ? 'Как играть с модами KZM' : 'How to play with KZM mods',
          description: m.about_intro(),
          step: [
            { '@type': 'HowToStep', name: m.step1_title(), text: m.step1_body() },
            { '@type': 'HowToStep', name: m.step2_title(), text: m.step2_body() },
            { '@type': 'HowToStep', name: m.step3_title(), text: m.step3_body() },
          ],
        },
      ],
    }),
  );
</script>

<svelte:head>
  <title>{m.seo_title()}</title>
  <meta name="description" content={m.seo_description()} />
  <meta name="keywords" content={m.seo_keywords()} />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="author" content="Katana ZERO Modding community" />
  <meta name="application-name" content="KZM" />
  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="ru" href={ruUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={ruUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="KZM" />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlt} />
  <meta property="og:title" content={m.seo_og_title()} />
  <meta property="og:description" content={m.seo_og_description()} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="{SITE_ORIGIN}/brand/og-kzm.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={m.seo_og_image_alt()} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={m.seo_og_title()} />
  <meta name="twitter:description" content={m.seo_og_description()} />
  <meta name="twitter:image" content="{SITE_ORIGIN}/brand/og-kzm.png" />
  <meta name="twitter:image:alt" content={m.seo_og_image_alt()} />

  {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
