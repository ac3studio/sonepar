<script lang="ts">
  import { chapters, ChapterView, IdleScreen, TopicsView } from '$lib/kiosk';
  import { viewTransition } from '$lib/kiosk/viewTransition';
  import { cn } from '$lib/utils';
  import { onMount, tick } from 'svelte';

  type View = 'chapter' | 'idle' | 'topics';
  const IDLE_TIMEOUT_MS = 240_000;

  const styles = {
    screen:
      'experience-screen isolate absolute top-1/2 left-1/2 grid h-[1080px] w-[1920px] origin-center grid-rows-[105px_minmax(0,1fr)] overflow-hidden bg-brand px-14 pt-12 pb-10 text-foreground [transform:translate(-50%,-50%)_scale(var(--screen-scale))] [touch-action:manipulation]',
    stage: 'fixed inset-0 overflow-hidden bg-brand'
  };

  let view = $state<View>('idle');
  let selectedChapter = $state<null | number>(null);
  let chapterDirection = $state<-1 | 1>(1);
  let flippedCards = $state<number[]>([]);
  let screenScale = $state(1);
  let idleTimer = 0;
  const preloadedChapterImages = new Map<string, HTMLImageElement>();

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
    flippedCards = chapters[index].initiallyFlippedCardIndexes ?? [];
    showView('chapter');
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

  function preloadChapterImages() {
    const sources = new Set<string>();
    for (const chapter of chapters) {
      for (const card of chapter.cards) {
        if (card.image) sources.add(card.image);
        card.logos?.forEach((logo) => sources.add(logo.src));
      }
    }

    for (const src of sources) {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      preloadedChapterImages.set(src, image);
      void image.decode().catch(() => {});
    }
  }

  onMount(() => {
    fitScreen();
    window.addEventListener('resize', fitScreen);
    document.addEventListener('pointerdown', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);
    let preloadFrame = 0;
    const firstPaintFrame = window.requestAnimationFrame(() => {
      preloadFrame = window.requestAnimationFrame(preloadChapterImages);
    });
    return () => {
      window.removeEventListener('resize', fitScreen);
      document.removeEventListener('pointerdown', resetIdleTimer);
      document.removeEventListener('keydown', resetIdleTimer);
      window.cancelAnimationFrame(firstPaintFrame);
      window.cancelAnimationFrame(preloadFrame);
      preloadedChapterImages.clear();
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
        'border-foreground relative z-10 flex items-start justify-between border-b [mix-blend-mode:multiply]',
        view === 'idle' && 'items-end justify-center gap-28 border-b-0'
      )}
    >
      <img
        class={cn(
          'block h-auto w-[112px] brightness-0',
          view === 'idle' && 'w-[150px]'
        )}
        src="/images/strategic-supplier-summit.svg"
        alt="Strategic Supplier Summit"
      />
      <img
        class={cn(
          'mt-[-8px] block h-auto w-[205px]',
          view === 'idle' && 'mt-0 w-[270px]'
        )}
        src="/images/sonepar-logo.png"
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
              onBack={() => showView('topics')}
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
