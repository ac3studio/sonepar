<script lang="ts">
  import KioskButton from './KioskButton.svelte';
  import StoryCard from './StoryCard.svelte';
  import SplitViewLayout from './SplitViewLayout.svelte';
  import type { Chapter } from './chapters';

  type Props = {
    chapter: Chapter;
    chapterCount: number;
    flippedCards: number[];
    selectedChapterIndex: number;
    onBack: () => void;
    onNavigateChapter: (direction: -1 | 1) => void;
    onToggleCard: (index: number) => void;
  };

  let {
    chapter,
    chapterCount,
    flippedCards,
    selectedChapterIndex,
    onBack,
    onNavigateChapter,
    onToggleCard
  }: Props = $props();
</script>

<div
  class="relative z-10 grid h-full w-full grid-rows-[minmax(0,1fr)_90px] text-[#171913] max-[70rem]:h-auto max-[70rem]:grid-rows-[auto_auto] max-[70rem]:gap-8"
>
  <SplitViewLayout class="max-[70rem]:gap-8">
    <div class="flex flex-col items-start self-stretch pt-9 max-[70rem]:pt-6">
      <KioskButton
        class="max-[43rem]:px-3"
        onclick={onBack}
      >
        <span aria-hidden="true">←</span> Topics
      </KioskButton>
      <p
        class="mt-auto mb-[18px] text-[19px] font-bold tracking-[0.12em] uppercase max-[70rem]:mt-8"
      >
        Sustainability / {chapter.number}
      </p>
      <h1
        class="m-0 max-w-[470px] text-[67px] leading-[1.02] font-extrabold tracking-[-0.065em] text-balance max-[70rem]:max-w-full max-[43rem]:text-[clamp(38px,10vw,60px)]"
        id="view-title"
        tabindex="-1"
      >
        {chapter.title}
      </h1>
      <p class="mt-6 max-w-[430px] text-[23px] leading-[1.4] max-[70rem]:max-w-full">
        {chapter.summary}
      </p>
      <div
        class="mt-auto mb-[42px] flex items-center gap-4 text-[18px] font-semibold max-[70rem]:mt-6 max-[70rem]:mb-0"
      >
        <span class="h-0.5 w-11 bg-current"></span>Select a card to explore
      </div>
    </div>

    <div
      class="grid h-[min(595px,88%)] w-full grid-cols-3 gap-6 max-[70rem]:h-auto max-[43rem]:grid-cols-1"
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
    class="flex items-center justify-between border-t-2 border-[#171913] max-[70rem]:min-h-[90px] max-[43rem]:items-stretch max-[43rem]:flex-col max-[43rem]:gap-4 max-[43rem]:pt-4"
    aria-label="Chapter navigation"
  >
    <span class="text-[23px] font-bold tabular-nums">
      {chapter.number} <span class="opacity-55">/ 0{chapterCount}</span>
    </span>
    <div class="flex gap-8 max-[43rem]:justify-between max-[43rem]:gap-3">
      <KioskButton
        disabled={selectedChapterIndex === 0}
        onclick={() => onNavigateChapter(-1)}
        class="max-[43rem]:min-w-0 max-[43rem]:flex-1 max-[43rem]:px-3"
      >
        ← Previous
      </KioskButton>
      <KioskButton
        disabled={selectedChapterIndex === chapterCount - 1}
        onclick={() => onNavigateChapter(1)}
        class="max-[43rem]:min-w-0 max-[43rem]:flex-1 max-[43rem]:px-3"
      >
        Next →
      </KioskButton>
    </div>
  </nav>
</div>
