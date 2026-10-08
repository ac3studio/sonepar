<script lang="ts">
  import { ChapterView, chapters, IdleScreen, TopicsView } from '$lib/kiosk';
  import { cn } from '$lib/utils';
  import { onMount, tick } from 'svelte';

  type View = 'idle' | 'topics' | 'chapter';
  const IDLE_TIMEOUT_MS = 240_000;
  const IDLE_WARNING_MS = 30_000;

  const styles = {
    stage:
      'fixed inset-0 overflow-hidden bg-[#f4c400] max-[70rem]:relative max-[70rem]:min-h-dvh max-[70rem]:overflow-visible',
    screen:
      'experience-screen isolate absolute top-1/2 left-1/2 grid h-[1080px] w-[1920px] origin-center grid-rows-[105px_minmax(0,1fr)] overflow-hidden bg-[#f4c400] px-14 pt-12 pb-10 text-[#171913] [transform:translate(-50%,-50%)_scale(var(--screen-scale))] [touch-action:manipulation] max-[70rem]:relative max-[70rem]:top-auto max-[70rem]:left-auto max-[70rem]:h-auto max-[70rem]:min-h-dvh max-[70rem]:w-full max-[70rem]:grid-rows-[auto_minmax(0,1fr)] max-[70rem]:transform-none max-[70rem]:p-6 max-[43rem]:p-4'
  };

  let view = $state<View>('idle');
  let selectedChapter = $state<number | null>(null);
  let flippedCards = $state<number[]>([]);
  let screenScale = $state(1);
  let idleTimer = 0;
  let warningTimer = 0;
  let warningInterval = 0;
  let secondsRemaining = $state(30);
  let showIdleWarning = $state(false);

  function fitScreen() {
    screenScale = Math.min(
      1,
      window.innerWidth / 1920,
      window.innerHeight / 1080
    );
  }

  function clearIdleTimers() {
    window.clearTimeout(idleTimer);
    window.clearTimeout(warningTimer);
    window.clearInterval(warningInterval);
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

  async function focusView() {
    await tick();
    window.scrollTo(0, 0);
    document
      .getElementById(view === 'idle' ? 'idle-start' : 'view-title')
      ?.focus({ preventScroll: true });
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

  function returnToIdle() {
    selectedChapter = null;
    flippedCards = [];
    showView('idle');
  }

  function resetIdleTimer() {
    if (view !== 'idle') startIdleTimer();
  }

  function openChapter(index: number) {
    selectedChapter = index;
    flippedCards = chapters[index].initiallyFlippedCardIndexes ?? [];
    showView('chapter');
  }

  function navigateChapter(direction: -1 | 1) {
    if (selectedChapter === null) return;
    const next = selectedChapter + direction;
    if (next < 0 || next >= chapters.length) return;
    openChapter(next);
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
      view === 'idle' &&
        'grid-rows-[150px_minmax(0,1fr)] max-[43rem]:grid-rows-[120px_minmax(0,1fr)]'
    )}
    style={`--screen-scale: ${screenScale}`}
    aria-label="Sustainability touch experience"
  >
    <header
      class={cn(
        'relative z-10 flex items-start justify-between border-b border-[#171913] [mix-blend-mode:multiply] max-[70rem]:min-h-[85px]',
        view === 'idle' &&
          'items-end justify-center gap-28 border-b-0 max-[70rem]:gap-16 max-[43rem]:gap-6'
      )}
    >
      <img
        class={cn(
          'block h-auto w-[112px] brightness-0 max-[43rem]:w-[86px]',
          view === 'idle' &&
            'w-[150px] max-[70rem]:w-[130px] max-[43rem]:w-[100px]'
        )}
        src="/images/strategic-supplier-summit.svg"
        alt="Strategic Supplier Summit"
      />
      <img
        class={cn(
          'mt-[-8px] block h-auto w-[205px] max-[43rem]:mt-0 max-[43rem]:w-[130px]',
          view === 'idle' &&
            'mt-0 w-[270px] max-[70rem]:w-[235px] max-[43rem]:w-[160px]'
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
        class="absolute bottom-28 left-14 z-30 flex items-center gap-6 rounded-xl border-2 border-[#171913] bg-[#f7f4e8] px-5 py-[18px] text-[20px] font-bold text-[#171913] shadow-[0_12px_24px_rgb(41_32_0/0.2)] max-[70rem]:fixed max-[70rem]:bottom-6 max-[70rem]:left-6 max-[43rem]:right-4 max-[43rem]:bottom-4 max-[43rem]:left-4 max-[43rem]:flex-wrap"
      >
        <span>Returning to the start soon</span>
        <span aria-hidden="true">{secondsRemaining}s</span>
        <button
          class="min-h-12 rounded-[7px] bg-[#171913] px-[18px] py-2.5 text-[#f7f4e8] focus-visible:outline-4 focus-visible:outline-offset-[3px] focus-visible:outline-[#171913]"
          onclick={startIdleTimer}>Keep exploring</button
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
    background: rgb(244 196 0 / 0.48);
  }
</style>
