<script lang="ts">
  import { base } from '$app/paths';
  import { ArrowDownToLine, ArrowUpRight, BookOpen, Coffee, GitFork, Monitor } from '@lucide/svelte';
  import BarScene from '$lib/BarScene.svelte';
  import SiteHeader from '$lib/SiteHeader.svelte';
  import SiteFooter from '$lib/SiteFooter.svelte';
  import SeoHead from '$lib/SeoHead.svelte';
  import { links } from '$lib/links';
  import { m } from '$lib/paraglide/messages.js';
  import { getLocale } from '$lib/paraglide/runtime';

  const playingHref = $derived(getLocale() === 'en' ? links.playing.en : links.playing.ru);

  const resources = $derived([
    {
      icon: ArrowDownToLine,
      title: m.resource_download_title(),
      description: m.resource_download_desc(),
      href: links.download,
      label: m.resource_download_label(),
    },
    {
      icon: BookOpen,
      title: m.resource_docs_title(),
      description: m.resource_docs_desc(),
      href: links.docs,
      label: m.resource_docs_label(),
    },
    {
      icon: GitFork,
      title: m.resource_source_title(),
      description: m.resource_source_desc(),
      href: links.source,
      label: m.resource_source_label(),
    },
    {
      icon: Coffee,
      title: m.resource_support_title(),
      description: m.resource_support_desc(),
      href: links.support,
      label: m.resource_support_label(),
    },
  ] as const);
</script>

<SeoHead />

<a class="skip-link" href="#main">{m.skip_link()}</a>

<SiteHeader current="home" />

<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="scene-wrap mx-auto">
      <BarScene barAria={m.bar_aria()} barSr={m.bar_sr()} />
    </div>

    <div class="hero-copy mx-auto">
      <h1 id="hero-title" class="hero-name flex items-center">
        <span class="sr-only">{m.hero_brand()}</span>
        <span class="hero-title-lockup">
          <img class="brand-logo hero-logo" src="{base}/brand/logotype-pixel.png" alt="" aria-hidden="true" width="52" height="52" />
        </span>
        <span class="full-name">{m.hero_line1()}<br class="full-name-break" aria-hidden="true" /><span class="full-name-line2">{m.hero_line2()}</span></span>
      </h1>
      <p class="hero-detail">{m.hero_detail()}</p>
      <div class="hero-actions flex flex-wrap items-center gap-3">
        <a class="button button-primary" href={links.download} target="_blank" rel="noopener noreferrer"><ArrowDownToLine size={16} /> {m.hero_download()}</a>
        <a class="button button-secondary" href={links.docs} target="_blank" rel="noopener noreferrer"><BookOpen size={16} /> {m.hero_create_mod()} <ArrowUpRight size={16} /></a>
      </div>
      <p class="download-note flex flex-wrap items-center gap-x-4 gap-y-2">
        <span class="inline-flex items-center gap-2"><Monitor size={16} /> {m.hero_windows()}</span>
        <span>{m.hero_free()}</span>
      </p>
    </div>
  </section>

  <section id="about" class="about-section content-width mx-auto" aria-labelledby="about-title">
    <div class="about-intro">
      <h2 id="about-title">{m.about_title()}</h2>
      <p>{m.about_intro()}</p>
    </div>

    <div class="workflow">
      <div class="workflow-copy">
        <ol class="steps" role="list">
          <li>
            <span class="step-number" aria-hidden="true">1</span>
            <div><h3>{m.step1_title()}</h3><p>{m.step1_body()}</p></div>
          </li>
          <li>
            <span class="step-number" aria-hidden="true">2</span>
            <div><h3>{m.step2_title()}</h3><p>{m.step2_body()}</p></div>
          </li>
          <li>
            <span class="step-number" aria-hidden="true">3</span>
            <div><h3>{m.step3_title()}</h3><p>{m.step3_body()}</p></div>
          </li>
        </ol>
        <a class="inline-link" href={playingHref} target="_blank" rel="noopener noreferrer">{m.about_guide()} <ArrowUpRight size={16} /></a>
      </div>
    </div>

    <p class="compatibility-note">{m.about_compat()}</p>
  </section>

  <section id="resources" class="resources-section" aria-labelledby="resources-title">
    <div class="content-width mx-auto">
      <div class="resources-intro">
        <h2 id="resources-title">{m.resources_title()}</h2>
        <p>{m.resources_intro()}</p>
      </div>
      <div class="resource-links">
        {#each resources as resource (resource.href)}
          <a class="resource-link" href={resource.href} target="_blank" rel="noopener noreferrer">
            <resource.icon class="resource-icon" size={16} />
            <div class="resource-text"><h3>{resource.title}</h3><p>{resource.description}</p></div>
            <span class="resource-label">{resource.label}</span><ArrowUpRight class="resource-arrow" size={16} />
          </a>
        {/each}
      </div>
    </div>
  </section>
</main>

<SiteFooter current="home" />










