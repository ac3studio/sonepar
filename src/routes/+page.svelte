<script lang="ts">
  import { chapters, ChapterView, IdleScreen, TopicsView } from '$lib/kiosk';
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
  let flippedCards = $state<number[]>([]);
  let screenScale = $state(1);
  let idleTimer = 0;

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
    document
      .getElementById(view === 'idle' ? 'idle-start' : 'view-title')
      ?.focus({ preventScroll: true });
  }

  function navigateChapter(direction: -1 | 1) {
    if (selectedChapter === null) return;
    const next = selectedChapter + direction;
    if (next < 0 || next >= chapters.length) return;
    openChapter(next);
  }

  function openChapter(index: number) {
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

  onMount(() => {
    fitScreen();
    window.addEventListener('resize', fitScreen);
    document.addEventListener('pointerdown', resetIdleTimer);
    document.addEventListener('keydown', resetIdleTimer);
    return () => {
      window.removeEventListener('resize', fitScreen);
      document.removeEventListener('pointerdown', resetIdleTimer);
      document.removeEventListener('keydown', resetIdleTimer);
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

    {#if view === 'idle'}
      <IdleScreen onExplore={() => showView('topics')} />
    {:else if view === 'topics'}
      <TopicsView {chapters} onSelectChapter={openChapter} />
    {:else if selectedChapter !== null}
      <ChapterView
        chapter={chapters[selectedChapter]}
        chapterCount={chapters.length}
        {flippedCards}
        selectedChapterIndex={selectedChapter}
        onBack={() => showView('topics')}
        onNavigateChapter={navigateChapter}
        onToggleCard={toggleCard}
      />
    {/if}
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
    filter: blur(18px);
  }

  .experience-screen::after {
    inset: 0;
    background: color-mix(in srgb, var(--color-brand) 48%, transparent);
  }
</style>
