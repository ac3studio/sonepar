<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { onMount } from 'svelte';

  type View = 'idle' | 'intro' | 'topics' | 'chapter';
  type Card = { title: string; example: string; image?: string };
  type Chapter = { number: string; title: string; cards: Card[] };
  const IDLE_TIMEOUT_MS = 60_000;

  const chapters: Chapter[] = [
    {
      number: '01',
      title: 'Topic 01',
      cards: [
        {
          title: 'Use products longer',
          example:
            'When equipment needs attention, consider whether inspection or repair could help keep it in use. Follow the supplier’s guidance for each product.',
          image: '/images/circuit-board.jpg',
        },
        {
          title: 'Give materials another use',
          example:
            'Before disposing of unused items, check whether another team or project could use them.',
        },
      ],
    },
    {
      number: '02',
      title: 'Topic 02',
      cards: [
        {
          title: 'Reduce packaging',
          example:
            'Ask suppliers about packaging choices and how the materials can be separated for reuse or recycling.',
        },
        {
          title: 'Group deliveries',
          example:
            'When schedules and stock allow, combine orders into fewer deliveries.',
        },
        {
          title: 'Recover materials',
          example:
            'At the end of use, sort materials according to the collection options available in your area.',
        },
      ],
    },
    {
      number: '03',
      title: 'Topic 03',
      cards: [
        {
          title: 'Plan ahead',
          example:
            'Review existing stock and project requirements before ordering. Clear information can help avoid ordering items already on hand.',
        },
        {
          title: 'Choose what fits',
          example:
            'Use the project specification to compare options and choose products that meet the intended requirements.',
        },
      ],
    },
    {
      number: '04',
      title: 'Topic 04',
      cards: [
        {
          title: 'Use less energy',
          example:
            'Compare energy requirements when selecting equipment. Rooftop solar panels illustrate one way to generate renewable electricity.',
          image: '/images/solar-panels.jpg',
        },
        {
          title: 'Maintain equipment',
          example:
            'Regular inspection and timely maintenance may help equipment remain useful. Follow the supplier’s instructions for each product.',
        },
      ],
    },
    {
      number: '05',
      title: 'Topic 05',
      cards: [
        {
          title: 'Avoid unused stock',
          example:
            'Estimate quantities from the work planned and check current stock before ordering.',
        },
        {
          title: 'Share surplus',
          example:
            'Make usable surplus visible to other teams so they can check whether it meets their project needs.',
        },
      ],
    },
    {
      number: '06',
      title: 'Topic 06',
      cards: [
        {
          title: 'Separate materials',
          example:
            'Keep different materials separate where local collection guidance recommends it.',
        },
        {
          title: 'Return what can be reused',
          example:
            'Ask about return options for unused items and products that can be reused.',
        },
      ],
    },
  ];

  const styles = {
    stage: 'fixed inset-0 overflow-hidden bg-white',
    screen:
      'absolute top-1/2 left-1/2 grid h-[1920px] w-[1080px] origin-center overflow-hidden bg-white px-14 pt-12 pb-10 text-[#171717] [transform:translate(-50%,-50%)_scale(var(--screen-scale))] [touch-action:manipulation] select-none',
    appTitle: 'text-[3.5rem] leading-none font-medium tracking-[-0.05em]',
    appInstruction: 'mt-5 text-[1.5rem] text-[#555]',
    chapterGrid: 'grid min-h-0 grid-cols-2 grid-rows-3 border-t border-l border-[#bdbdbd]',
    chapterButton:
      'flex min-h-0 flex-col items-start justify-between border-r border-b border-[#bdbdbd] p-7 text-left active:bg-[#ededed]',
    chapterIndex: 'text-xl tabular-nums text-[#666]',
    chapterTitle: 'text-[1.75rem] leading-tight font-medium tracking-[-0.025em]',
    backButton:
      'mb-7 flex h-24 w-full items-center gap-5 border border-[#bdbdbd] bg-white px-7 text-left text-[1.75rem] text-[#171717] active:bg-[#ededed]',
    chapterHeading: 'pb-8',
    chapterEyebrow: 'mb-4 text-lg tabular-nums text-[#666]',
    cardGrid:
      'isolate grid h-[1080px] min-h-0 max-h-full w-full max-w-[840px] gap-5 justify-self-center self-center',
    flipCard:
      'relative z-0 min-h-0 w-full bg-transparent p-0 text-left [perspective:1200px]',
    flipInner:
      'absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500 motion-reduce:transition-none',
    cardFace:
      'absolute inset-0 flex flex-col items-start justify-between border border-[#bdbdbd] p-8 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]',
    cardFront: 'bg-white',
    cardBack: 'bg-[#f1f1f1] [transform:rotateY(180deg)]',
    cardTitle: 'text-[1.25rem] text-[#555]',
    cardImage: 'max-h-60 min-h-32 w-full flex-1 object-cover',
    cardText: 'max-w-full text-[1.875rem] leading-snug font-medium tracking-[-0.025em]',
    cardDescription: 'max-w-full text-[1.5rem] leading-relaxed',
    cardHint: 'text-base text-[#666]',
    chapterNav: 'flex items-center justify-between pt-7',
    navButton:
      'min-h-20 min-w-28 border border-[#999] bg-white px-5 text-xl active:bg-[#ededed] disabled:border-[#ddd] disabled:text-[#aaa]',
    pageCount: 'text-xl tabular-nums text-[#555]',
    fullButton:
      'flex h-full w-full flex-col items-center justify-center gap-8 border-0 bg-white text-center active:bg-[#f1f1f1]',
    introPage: 'flex h-full flex-col justify-between py-8',
  };

  let view = $state<View>('idle');
  let selectedChapter = $state<number | null>(null);
  let flippedCards = $state<number[]>([]);
  let screenScale = $state(1);
  let idleTimer = 0;

  function fitScreen() {
    screenScale = Math.min(1, window.innerWidth / 1080, window.innerHeight / 1920);
  }

  function showView(nextView: View) {
    view = nextView;
    window.clearTimeout(idleTimer);
    if (nextView !== 'idle') {
      idleTimer = window.setTimeout(returnToIdle, IDLE_TIMEOUT_MS);
    }
  }

  function returnToIdle() {
    selectedChapter = null;
    flippedCards = [];
    showView('idle');
  }

  function resetIdleTimer() {
    if (view !== 'idle') showView(view);
  }

  function openChapter(index: number) {
    selectedChapter = index;
    flippedCards = [];
    showView('chapter');
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
      window.clearTimeout(idleTimer);
    };
  });
</script>

<svelte:head>
  <title>Sustainability | Sonepar</title>
  <meta name="description" content="Sustainability touch experience" />
</svelte:head>

<main class={styles.stage}>
  <section
    class={styles.screen}
    style={`--screen-scale: ${screenScale}`}
    aria-label="Sustainability touch experience"
  >
    {#if view === 'idle'}
      <button class={styles.fullButton} onclick={() => showView('intro')}>
        <span class={styles.appTitle}>Sustainability</span>
        <span class={styles.appInstruction}>Tap to start</span>
      </button>
    {:else if view === 'intro'}
      <div class={styles.introPage}>
        <p class={styles.chapterEyebrow}>SUSTAINABILITY</p>
        <div>
          <h1 class={styles.appTitle}>A short interactive guide</h1>
          <p class={styles.appInstruction}>Explore six topics. Tap a card to see more.</p>
        </div>
        <button class={styles.navButton} onclick={() => showView('topics')}>Choose a topic</button>
      </div>
    {:else if view === 'topics'}
      <div class="grid min-h-0 grid-rows-[auto_1fr]">
        <div class="pb-8">
          <h1 class={styles.appTitle}>Choose a topic</h1>
        </div>
        <nav class={styles.chapterGrid} aria-label="Topics">
          {#each chapters as chapter, index (chapter.number)}
            <button class={styles.chapterButton} onclick={() => openChapter(index)}>
              <span class={styles.chapterIndex}>{chapter.number}</span>
              <span class={styles.chapterTitle}>{chapter.title}</span>
            </button>
          {/each}
        </nav>
      </div>
    {:else if selectedChapter !== null}
      {@const chapter = chapters[selectedChapter]}
      <div class="grid min-h-0 grid-rows-[auto_auto_1fr_auto]">
        <button class={styles.backButton} onclick={() => showView('topics')}>
          <span aria-hidden="true">←</span><span>All topics</span>
        </button>

        <div class={styles.chapterHeading}>
          <p class={styles.chapterEyebrow}>
            {chapter.number} / {String(chapters.length).padStart(2, '0')}
          </p>
          <h1 class={styles.appTitle}>{chapter.title}</h1>
        </div>

        <div class={cn(styles.cardGrid, chapter.cards.length === 3 ? 'grid-rows-3' : 'grid-rows-2')}>
          {#each chapter.cards as card, index (card.title)}
            {@const flipped = flippedCards.includes(index)}
            <button
              class={cn(styles.flipCard, flipped && 'z-10')}
              aria-pressed={flipped}
              onclick={() => toggleCard(index)}
            >
              <span class={cn(styles.flipInner, flipped && '[transform:rotateY(180deg)]')}>
                <span class={cn(styles.cardFace, styles.cardFront)}>
                  <span class={styles.cardTitle}>0{index + 1}</span>
                  {#if card.image}
                    <img class={styles.cardImage} src={card.image} alt="" draggable="false" />
                  {/if}
                  <span class={styles.cardText}>{card.title}</span>
                  <span class={styles.cardHint}>Tap to reveal</span>
                </span>
                <span class={cn(styles.cardFace, styles.cardBack)}>
                  <span class={styles.cardTitle}>Sample idea</span>
                  <span class={styles.cardText}>{card.title}</span>
                  <span class={styles.cardDescription}>{card.example}</span>
                  <span class={styles.cardHint}>Tap to close</span>
                </span>
              </span>
            </button>
          {/each}
        </div>

        <nav class={styles.chapterNav} aria-label="Chapter navigation">
          <button
            class={styles.navButton}
            disabled={selectedChapter === 0}
            onclick={() => openChapter(selectedChapter! - 1)}
          >
            Previous
          </button>
          <span class={styles.pageCount}>{chapter.number} / 06</span>
          <button
            class={styles.navButton}
            disabled={selectedChapter === chapters.length - 1}
            onclick={() => openChapter(selectedChapter! + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    {/if}
  </section>
</main>
