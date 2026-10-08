<script lang="ts">
  import type { Chapter } from './chapters';

  import SplitViewLayout from './SplitViewLayout.svelte';

  type Props = {
    chapters: Chapter[];
    onSelectChapter: (index: number) => void;
  };

  let { chapters, onSelectChapter }: Props = $props();
</script>

<SplitViewLayout class="relative z-10 py-[34px] pb-5">
  <div class="flex flex-col items-start self-stretch pt-9">
    <div class="mt-auto">
      <p class="text-label mb-[18px] uppercase">Sustainability / Explore</p>
      <h1 class="text-display m-0" id="view-title" tabindex="-1">
        Choose a topic
      </h1>
    </div>
    <p class="text-body mt-6 max-w-[430px]">
      Six themes. Real examples from across the Sonepar network.
    </p>
    <div
      class="text-label mt-auto mb-[42px] flex -translate-y-[62px] items-center gap-4"
    >
      <span class="h-0.5 w-11 bg-current"></span>Select a topic to explore
    </div>
  </div>

  <nav
    class="grid h-[min(595px,88%)] min-h-0 w-full grid-cols-3 grid-rows-2 gap-4"
    aria-label="Topics"
  >
    {#each chapters as chapter, index (chapter.number)}
      <button
        class="border-foreground/50 bg-surface/94 text-foreground focus-visible:outline-foreground flex min-h-0 min-w-0 cursor-pointer flex-col justify-between rounded-[14px] border px-[30px] py-[27px] text-left hover:brightness-[1.02] focus-visible:outline-4 focus-visible:outline-offset-[-6px] enabled:active:brightness-95"
        onclick={() => onSelectChapter(index)}
      >
        <span class="text-[17px] font-bold tracking-[0.1em] tabular-nums">
          {chapter.number} / 06
        </span>
        <span class="text-heading max-w-[480px] text-balance">
          {chapter.title}
        </span>
      </button>
    {/each}
  </nav>
</SplitViewLayout>
