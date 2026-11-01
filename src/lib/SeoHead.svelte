<script lang="ts">
  import { base } from '$app/paths';
  import { links } from '$lib/links';
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale, localizeUrl } from '$lib/paraglide/runtime';
  import { SITE_ORIGIN } from '$lib/site';

  const locale = $derived(getLocale());
  const canonical = $derived(localizeUrl(`${SITE_ORIGIN}/`, { locale }).href.replace(/\/$/, '') + '/');
  const ruUrl = `${SITE_ORIGIN}/`;
  const enUrl = `${SITE_ORIGIN}/en/`;
  const ogLocale = $derived(locale === 'en' ? 'en_US' : 'ru_RU');
  const ogLocaleAlt = $derived(locale === 'en' ? 'ru_RU' : 'en_US');
  const inLanguage = $derived(locale === 'en' ? 'en' : 'ru');
  const ogImage = `${SITE_ORIGIN}/brand/og-kzm.png`;
  const logoUrl = `${SITE_ORIGIN}/brand/logotype-512.png`;
  const orgId = `${SITE_ORIGIN}/#organization`;
  const websiteId = `${SITE_ORIGIN}/#website`;
  const launcherId = `${SITE_ORIGIN}/#launcher`;

  const jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: m.seo_title(),
          description: m.seo_description(),
          inLanguage,
          isPartOf: { '@id': websiteId },
          mainEntity: { '@id': launcherId },
          publisher: { '@id': orgId },
          primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: ruUrl,
          name: 'KZM',
          alternateName: 'Katana ZERO Modding',
          description: m.seo_description(),
          inLanguage: ['ru', 'en'],
          publisher: { '@id': orgId },
        },
        {
          '@type': 'Organization',
          '@id': orgId,
          name: 'Katana ZERO Modding',
          alternateName: 'KZM',
          url: ruUrl,
          logo: { '@type': 'ImageObject', url: logoUrl, width: 512, height: 512 },
          sameAs: ['https://github.com/KatanaZeroModding', links.source],
        },
        {
          '@type': 'Person',
          '@id': `${links.author}#person`,
          name: 'An1by',
          url: links.author,
          sameAs: [links.support],
        },
        {
          '@type': 'SoftwareApplication',
          '@id': launcherId,
          name: 'KZM Launcher',
          alternateName: 'KZM',
          applicationCategory: 'UtilitiesApplication',
          applicationSubCategory: inLanguage === 'en' ? 'Game mod launcher' : 'Лаунчер модов',
          operatingSystem: 'Windows',
          url: ruUrl,
          description: m.seo_description(),
          image: ogImage,
          softwareRequirements: 'Katana ZERO for Windows',
          featureList:
            inLanguage === 'en'
              ? ['Install .kzm packages', 'Mod profiles', 'Launch Katana ZERO', 'Backup of game data']
              : ['Установка пакетов .kzm', 'Профили наборов модов', 'Запуск Katana ZERO', 'Резервная копия игровых данных'],
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          downloadUrl: links.download,
          softwareHelp: links.docs,
          isAccessibleForFree: true,
          author: { '@id': orgId },
          creator: { '@id': `${links.author}#person` },
        },
        {
          '@type': 'HowTo',
          '@id': `${canonical}#howto`,
          name: inLanguage === 'en' ? 'How to play with KZM mods' : 'Как играть с модами KZM',
          description: m.about_intro(),
          inLanguage,
          step: [
            { '@type': 'HowToStep', position: 1, name: m.step1_title(), text: m.step1_body() },
            { '@type': 'HowToStep', position: 2, name: m.step2_title(), text: m.step2_body() },
            { '@type': 'HowToStep', position: 3, name: m.step3_title(), text: m.step3_body() },
          ],
        },
      ],
    }).replace(/</g, '\\u003c'),
  );
</script>

<svelte:head>
  <title>{m.seo_title()}</title>
  <meta name="description" content={m.seo_description()} />
  <meta name="keywords" content={m.seo_keywords()} />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="author" content="Katana ZERO Modding community" />
  <meta name="application-name" content="KZM" />
  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="ru" href={ruUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={ruUrl} />
  <link rel="preload" as="image" href="{base}/bar/poster.png" type="image/png" fetchpriority="high" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="KZM" />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlt} />
  <meta property="og:title" content={m.seo_og_title()} />
  <meta property="og:description" content={m.seo_og_description()} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={m.seo_og_image_alt()} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={m.seo_og_title()} />
  <meta name="twitter:description" content={m.seo_og_description()} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content={m.seo_og_image_alt()} />
  <meta name="twitter:url" content={canonical} />

  {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

