<script lang="ts">
  import type { Chapter } from './chapters';

  import KioskButton from './KioskButton.svelte';
  import SplitViewLayout from './SplitViewLayout.svelte';
  import StoryCard from './StoryCard.svelte';

  type Props = {
    chapter: Chapter;
    chapterCount: number;
    flippedCards: number[];
    onBack: () => void;
    onNavigateChapter: (direction: -1 | 1) => void;
    onToggleCard: (index: number) => void;
    selectedChapterIndex: number;
  };

  let {
    chapter,
    chapterCount,
    flippedCards,
    onBack,
    onNavigateChapter,
    onToggleCard,
    selectedChapterIndex
  }: Props = $props();
</script>

<div
  class="text-kiosk-ink relative z-10 grid h-full w-full grid-rows-[minmax(0,1fr)_90px]"
>
  <SplitViewLayout>
    <div class="flex flex-col items-start self-stretch pt-9">
      <KioskButton onclick={onBack}>
        <span aria-hidden="true">←</span> Topics
      </KioskButton>
      <p class="text-kiosk-label mt-auto mb-[18px] uppercase">
        Sustainability / {chapter.number}
      </p>
      <h1
        class="text-kiosk-display m-0 max-w-[470px] tracking-[-0.065em] text-balance"
        id="view-title"
        tabindex="-1"
      >
        {chapter.title}
      </h1>
      <p class="text-kiosk-body mt-6 max-w-[430px]">
        {chapter.summary}
      </p>
      <div class="text-kiosk-label mt-auto mb-[42px] flex items-center gap-4">
        <span class="h-0.5 w-11 bg-current"></span>Select a card to explore
      </div>
    </div>

    <div
      class="grid h-[min(595px,88%)] w-full grid-cols-3 gap-6"
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
  </SplitViewLayout>

  <nav
    class="border-kiosk-ink flex items-center justify-between border-t-2"
    aria-label="Chapter navigation"
  >
    <span class="text-[23px] font-bold tabular-nums">
      {chapter.number} <span class="opacity-55">/ 0{chapterCount}</span>
    </span>
    <div class="flex gap-8">
      <KioskButton
        disabled={selectedChapterIndex === 0}
        onclick={() => onNavigateChapter(-1)}
      >
        ← Previous
      </KioskButton>
      <KioskButton
        disabled={selectedChapterIndex === chapterCount - 1}
        onclick={() => onNavigateChapter(1)}
      >
        Next →
      </KioskButton>
    </div>
  </nav>
</div>
