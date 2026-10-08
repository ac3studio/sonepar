<script lang="ts">
  import {
    chapters,
    ChapterView,
    IdleScreen,
    KioskButton,
    TopicsView
  } from '$lib/kiosk';
  import { cn } from '$lib/utils';
  import { onMount, tick } from 'svelte';

  type View = 'chapter' | 'idle' | 'topics';
  const IDLE_TIMEOUT_MS = 240_000;
  const IDLE_WARNING_MS = 30_000;

  const styles = {
    screen:
      'experience-screen isolate absolute top-1/2 left-1/2 grid h-[1080px] w-[1920px] origin-center grid-rows-[105px_minmax(0,1fr)] overflow-hidden bg-kiosk-yellow px-14 pt-12 pb-10 text-kiosk-ink [transform:translate(-50%,-50%)_scale(var(--screen-scale))] [touch-action:manipulation]',
    stage: 'fixed inset-0 overflow-hidden bg-kiosk-yellow'
  };

  let view = $state<View>('idle');
  let selectedChapter = $state<null | number>(null);
  let flippedCards = $state<number[]>([]);
  let screenScale = $state(1);
  let idleTimer = 0;
  let warningTimer = 0;
  let warningInterval = 0;
  let secondsRemaining = $state(30);
  let showIdleWarning = $state(false);

  function clearIdleTimers() {
    window.clearTimeout(idleTimer);
    window.clearTimeout(warningTimer);
    window.clearInterval(warningInterval);
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

  function keepExploring() {
    startIdleTimer();
    void focusView();
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

  function resetIdleTimer(event: Event) {
    const target = event.target;
    if (
      showIdleWarning &&
      target instanceof Element &&
      target.closest('#idle-warning')
    ) {
      return;
    }
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
    clearIdleTimers();
    showIdleWarning = false;
    if (view === 'idle') return;
    warningTimer = window.setTimeout(() => {
      secondsRemaining = IDLE_WARNING_MS / 1000;
      showIdleWarning = true;
      warningInterval = window.setInterval(() => {
        secondsRemaining -= 1;
      }, 1000);
      idleTimer = window.setTimeout(returnToIdle, IDLE_WARNING_MS);
    }, IDLE_TIMEOUT_MS - IDLE_WARNING_MS);
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
      clearIdleTimers();
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
        'border-kiosk-ink relative z-10 flex items-start justify-between border-b [mix-blend-mode:multiply]',
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
    <span class="sr-only" role="status"
      >{showIdleWarning
        ? 'Returning to the start in 30 seconds. Select Keep exploring to stay here.'
        : ''}</span
    >
    {#if showIdleWarning}
      <div
        id="idle-warning"
        class="border-kiosk-ink bg-kiosk-paper text-kiosk-ink absolute bottom-28 left-14 z-30 flex items-center gap-6 rounded-xl border-2 px-5 py-[18px] text-[20px] font-bold shadow-[0_12px_24px_rgb(41_32_0/0.2)]"
      >
        <span>Returning to the start soon</span>
        <span aria-hidden="true">{secondsRemaining}s</span>
        <KioskButton
          class="bg-kiosk-ink text-kiosk-paper min-h-12 min-w-0 rounded-[7px] px-[18px] py-2.5 shadow-none"
          onclick={keepExploring}>Keep exploring</KioskButton
        >
      </div>
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
    background: color-mix(in srgb, var(--color-kiosk-yellow) 48%, transparent);
  }
</style>
