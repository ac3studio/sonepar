<script lang="ts">
  import { chapters, ChapterView, IdleScreen, TopicsView } from '$lib/kiosk';
  import { viewTransition } from '$lib/kiosk/viewTransition';
  import { cn } from '$lib/utils';
  import { onMount, tick } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';

  type View = 'chapter' | 'idle' | 'topics';
  const IDLE_TIMEOUT_MS = 240_000;

  const styles = {
    screen:
      'experience-screen isolate absolute top-1/2 left-1/2 grid h-[1080px] w-[1920px] origin-center grid-rows-[105px_minmax(0,1fr)] overflow-hidden bg-brand px-[96px] pt-12 pb-10 text-foreground [transform:translate(-50%,-50%)_scale(var(--screen-scale))] [touch-action:manipulation]',
    stage: 'fixed inset-0 overflow-hidden bg-brand'
  };

  let view = $state<View>('idle');
  let selectedChapter = $state<null | number>(null);
  let chapterDirection = $state<-1 | 1>(1);
  let flippedCards = $state<number[]>([]);
  let screenScale = $state(1);
  let idleTimer = 0;
  const preloadedImages: HTMLImageElement[] = [];

  function backToTopics() {
    flippedCards = [];
    showView('topics');
  }

  function clearIdleTimer() {
    window.clearTimeout(idleTimer);
  }

  function fitScreen() {
    screenScale = Math.min(
      1,
      window.innerWidth / 1920,
      window.innerHeight / 1080
    );
  }

  async function focusView() {
    await tick();
    window.scrollTo(0, 0);
    const titleId =
      view === 'idle'
        ? 'idle-start'
        : view === 'chapter' && selectedChapter !== null
          ? `chapter-view-title-${chapters[selectedChapter].number}`
          : 'view-title';
    document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  function navigateChapter(direction: -1 | 1) {
    if (selectedChapter === null) return;
    const next = selectedChapter + direction;
    if (next < 0 || next >= chapters.length) return;
    openChapter(next);
  }

  function openChapter(index: number) {
    chapterDirection =
      view === 'chapter' && selectedChapter !== null
        ? index > selectedChapter
          ? 1
          : -1
        : 1;
    selectedChapter = index;
    flippedCards = [];
    showView('chapter');
  }

  function preloadMedia() {
    const sources = new SvelteSet<string>();
    for (const chapter of chapters) {
      sources.add(chapter.image);
      for (const card of chapter.cards) {
        if (card.image) sources.add(card.image);
        card.logos?.forEach((logo) => sources.add(logo.src));
      }
    }

    for (const src of sources) {
      const image = new Image();
      image.src = src;
      preloadedImages.push(image);
    }
  }

  function resetIdleTimer() {
    if (view !== 'idle') startIdleTimer();
  }

  function returnToIdle() {
    selectedChapter = null;
    flippedCards = [];
    showView('idle');
  }

  function showView(nextView: View) {
    view = nextView;
    document.title =
      nextView === 'chapter' && selectedChapter !== null
        ? `${chapters[selectedChapter].title} | Sonepar`
        : nextView === 'topics'
          ? 'Choose a topic | Sonepar'
          : 'Sustainability | Sonepar';
    startIdleTimer();
    void focusView();
  }

  function startIdleTimer() {
    clearIdleTimer();
    if (view === 'idle') return;
    idleTimer = window.setTimeout(returnToIdle, IDLE_TIMEOUT_MS);
  }

  function toggleCard(index: number) {
    flippedCards = flippedCards.includes(index)
      ? flippedCards.filter((cardIndex) => cardIndex !== index)
      : [...flippedCards, index];
  }

  onMount(() => {
    fitScreen();
    window.addEventListener('resize', fitScreen);
    document.addEventListener('pointerdown', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);
    let preloadFrame = 0;
    const firstPaintFrame = window.requestAnimationFrame(() => {
      preloadFrame = window.requestAnimationFrame(preloadMedia);
    });
    return () => {
      window.removeEventListener('resize', fitScreen);
      document.removeEventListener('pointerdown', resetIdleTimer);
      document.removeEventListener('keydown', resetIdleTimer);
      window.cancelAnimationFrame(firstPaintFrame);
      window.cancelAnimationFrame(preloadFrame);
      preloadedImages.length = 0;
      clearIdleTimer();
    };
  });
</script>

<svelte:head>
  <title>Sustainability | Sonepar</title>
  <meta name="description" content="Sustainability touch experience" />
</svelte:head>

<main class={styles.stage}>
  <section
    class={cn(
      styles.screen,
      view === 'idle' && 'grid-rows-[150px_minmax(0,1fr)]'
    )}
    style={`--screen-scale: ${screenScale}`}
    aria-label="Sustainability touch experience"
  >
    <header
      class={cn(
        'border-foreground/25 relative z-10 flex items-start justify-between border-b',
        view === 'idle' && 'border-b-0'
      )}
    >
      <img
        class="block h-auto w-[112px] brightness-0"
        src="/images/strategic-supplier-summit.svg"
        alt="Strategic Supplier Summit"
      />
      <img
        class="mt-[-8px] ml-auto block h-auto w-[205px] brightness-0"
        src="/images/sonepar-logo.svg"
        alt="Sonepar"
      />
    </header>

    <div class="relative h-full min-h-0">
      {#key view}
        <div class="absolute inset-0" transition:viewTransition>
          {#if view === 'idle'}
            <IdleScreen onExplore={() => showView('topics')} />
          {:else if view === 'topics'}
            <TopicsView {chapters} onSelectChapter={openChapter} />
          {:else if selectedChapter !== null}
            <ChapterView
              chapter={chapters[selectedChapter]}
              chapterCount={chapters.length}
              {chapterDirection}
              {flippedCards}
              selectedChapterIndex={selectedChapter}
              onBack={backToTopics}
              onNavigateChapter={navigateChapter}
              onToggleCard={toggleCard}
            />
          {/if}
        </div>
      {/key}
    </div>
  </section>
</main>

<style>
  .experience-screen::before,
  .experience-screen::after {
    position: absolute;
    z-index: 0;
    content: '';
    pointer-events: none;
  }

  .experience-screen::before {
    inset: -28px;
    background: url('/images/chapter-background.jpg') center / cover no-repeat;
    filter: blur(10px);
  }

  .experience-screen::after {
    inset: 0;
    background: color-mix(in srgb, var(--color-brand) 48%, transparent);
  }
</style>
