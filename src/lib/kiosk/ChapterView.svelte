<script lang="ts">
  import type { Chapter } from './chapters';

  import KioskButton from './KioskButton.svelte';
  import SplitViewLayout from './SplitViewLayout.svelte';
  import StoryCard from './StoryCard.svelte';
  import { chapterTransition, stationaryFade } from './viewTransition';

  type Props = {
    chapter: Chapter;
    chapterCount: number;
    chapterDirection: -1 | 1;
    flippedCards: number[];
    onBack: () => void;
    onNavigateChapter: (direction: -1 | 1) => void;
    onToggleCard: (index: number) => void;
    selectedChapterIndex: number;
  };

  let {
    chapter,
    chapterCount,
    chapterDirection,
    flippedCards,
    onBack,
    onNavigateChapter,
    onToggleCard,
    selectedChapterIndex
  }: Props = $props();
</script>

<div
  class="text-foreground relative z-10 grid h-full w-full grid-rows-[minmax(0,1fr)_88px]"
>
  <SplitViewLayout>
    <aside
      class="flex flex-col items-start self-stretch pt-9"
      aria-label="Chapter details"
    >
      <KioskButton
        class="!justify-start !gap-2 !border-2  !shadow-none"
        onclick={onBack}
      >
        <svg aria-hidden="true" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="m14.5 5-7 7 7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Topics</span>
      </KioskButton>
      <div class="relative min-h-0 flex-1 self-stretch">
        {#key chapter.number}
          <div class="absolute inset-0" transition:stationaryFade>
            <h1
              class="text-display mt-[110px] mb-0 max-w-[470px] tracking-[-0.065em] text-balance focus:outline-none"
              id={`chapter-view-title-${chapter.number}`}
              tabindex="-1"
            >
              {chapter.title}
            </h1>
            <p class="text-body mt-6 max-w-[430px]">
              {chapter.summary}
            </p>
          </div>
        {/key}
      </div>
      <div class="text-label mt-auto mb-24 flex items-center gap-4">
        <span class="h-0.5 w-11 bg-current"></span>Select a card to explore
      </div>
    </aside>

    <div class="relative h-[min(650px,92%)] min-h-0 w-full">
      {#key chapter.number}
        <div
          class="absolute inset-0"
          transition:chapterTransition={chapterDirection}
        >
          <div
            class="grid h-full w-full grid-cols-3 gap-6"
            class:grid-cols-2={chapter.cards.length === 2}
          >
            {#each chapter.cards as card, index (card.title)}
              <StoryCard
                {card}
                {index}
                flipped={flippedCards.includes(index)}
                onToggle={onToggleCard}
              />
            {/each}
          </div>
        </div>
      {/key}
    </div>
  </SplitViewLayout>

  <nav
    class="flex h-full min-h-[88px] items-center justify-between"
    aria-label="Chapter navigation"
  >
    <span class="text-[23px] font-bold tabular-nums">
      {chapter.number} <span class="opacity-55">/ 0{chapterCount}</span>
    </span>
    <div class="flex gap-8">
      <KioskButton
        ariaLabel="Previous chapter"
        class="!h-[72px] !min-h-[72px] !w-[72px] !min-w-[72px] !border-0 !px-0 !shadow-none"
        disabled={selectedChapterIndex === 0}
        onclick={() => onNavigateChapter(-1)}
      >
        <svg aria-hidden="true" class="size-7" viewBox="0 0 24 24" fill="none">
          <path d="m14.5 5-7 7 7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </KioskButton>
      <KioskButton
        ariaLabel="Next chapter"
        class="!h-[72px] !min-h-[72px] !w-[72px] !min-w-[72px] !border-0 !px-0 !shadow-none"
        disabled={selectedChapterIndex === chapterCount - 1}
        onclick={() => onNavigateChapter(1)}
      >
        <svg aria-hidden="true" class="size-7" viewBox="0 0 24 24" fill="none">
          <path d="m9.5 5 7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </KioskButton>
    </div>
  </nav>
</div>
