<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowDownToLine, ArrowUpRight, Layers, LoaderCircle, RefreshCw } from '@lucide/svelte';
  import { m } from '$lib/paraglide/messages.js';
  import { links } from '$lib/links';

  let { page = false }: { page?: boolean } = $props();

  type CatalogMod = {
    name: string;
    version: string;
    tag: string;
    description: string;
    repository: string;
    download: string;
    cover?: string;
    sha256: string;
    published: string | null;
  };
  type CatalogIndex = { schema: number; mods: CatalogMod[] };

  let mods = $state<CatalogMod[]>([]);
  let loading = $state(true);
  let failed = $state(false);
  let generation = 0;

  function validGitHubUrl(value: unknown, release: boolean): value is string {
    if (typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'github.com' &&
        !url.username && !url.password && !url.port &&
        (!release || url.pathname.includes('/releases/download/'));
    } catch { return false; }
  }

  function validCoverUrl(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'raw.githubusercontent.com' &&
        !url.username && !url.password && !url.port && !url.search && !url.hash;
    } catch { return false; }
  }

  function parseCatalog(value: unknown): CatalogMod[] {
    if (!value || typeof value !== 'object') throw new Error('Invalid catalog');
    const index = value as Partial<CatalogIndex>;
    if (index.schema !== 1 || !Array.isArray(index.mods) || index.mods.length > 500) {
      throw new Error('Unsupported catalog');
    }
    return index.mods.filter((mod): mod is CatalogMod => Boolean(
      mod && typeof mod.name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(mod.name) &&
      typeof mod.version === 'string' && typeof mod.tag === 'string' &&
      typeof mod.description === 'string' && (mod.cover === undefined || validCoverUrl(mod.cover)) && validGitHubUrl(mod.repository, false) &&
      validGitHubUrl(mod.download, true) && typeof mod.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(mod.sha256)
    ));
  }

  async function loadCatalog() {
    const current = ++generation;
    loading = true;
    failed = false;
    try {
      const response = await fetch(links.modsIndex, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
      const entries = parseCatalog(await response.json());
      if (current === generation) mods = entries.sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      if (current === generation) failed = true;
    } finally {
      if (current === generation) loading = false;
    }
  }

  onMount(() => { void loadCatalog(); });
</script>

<section id={page ? 'catalog' : 'mods'} class="mods-section" class:mods-page-catalog={page} aria-labelledby="mods-title">
  <div class="content-width mx-auto">
    <div class="mods-heading">
      <div>
        <span class="mods-source-mark"><span class="online-dot"></span>{m.catalog_source()}</span>
        {#if page}<h1 id="mods-title">{m.catalog_title()}</h1>{:else}<h2 id="mods-title">{m.catalog_title()}</h2>{/if}
        <p>{m.catalog_intro()}</p>
      </div>
      <div class="mods-heading-meta"><span>{mods.length}</span><p>{m.catalog_count()}</p></div>
    </div>

    {#if loading}
      <div class="mods-state" role="status"><LoaderCircle size={16} class="spin" /><span>{m.catalog_loading()}</span></div>
    {:else if failed}
      <div class="mods-state mods-state-error" role="alert"><p>{m.catalog_error()}</p><button class="button button-secondary" onclick={() => void loadCatalog()}><RefreshCw size={16} />{m.catalog_retry()}</button></div>
    {:else if !mods.length}
      <div class="mods-state"><Layers size={16} /><span>{m.catalog_empty()}</span></div>
    {:else}
      <div class="mods-grid">
        {#each mods as mod (mod.name)}
          <article class="mods-card">
            <div class="mods-card-top">
              <span class="mods-card-art"><span class="mods-card-mark"><Layers size={16} /></span>{#if mod.cover}<img class="mods-card-cover" src={mod.cover} alt="" loading="lazy" onerror={(event) => ((event.currentTarget as HTMLImageElement).hidden = true)} />{/if}</span>
              <span class="mods-card-version">v{mod.version}</span>
            </div>
            <h3>{mod.name}</h3>
            <p>{mod.description || m.catalog_no_description()}</p>
            <div class="mods-card-actions">
              <a class="mods-project-link" href={mod.repository} target="_blank" rel="noopener noreferrer">{m.catalog_repository()} <ArrowUpRight size={16} /></a>
              <a class="mods-download-link" href={mod.download} target="_blank" rel="noopener noreferrer"><ArrowDownToLine size={16} />{m.catalog_download()}</a>
            </div>
          </article>
        {/each}
      </div>
    {/if}

    <p class="mods-source-note">{m.catalog_source()}: <a href={links.mods} target="_blank" rel="noopener noreferrer">KatanaZeroModding/mods <ArrowUpRight size={16} /></a></p>
  </div>
</section>
