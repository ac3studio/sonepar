<script lang="ts">
  import type { Chapter } from './chapters';
  import SplitViewLayout from './SplitViewLayout.svelte';

  type Props = {
    chapters: Chapter[];
    onSelectChapter: (index: number) => void;
  };

  let { chapters, onSelectChapter }: Props = $props();
</script>

<SplitViewLayout
  class="relative z-10 max-[70rem]:grid-rows-[auto_auto] max-[70rem]:py-[34px] max-[70rem]:pb-5"
>
  <div
    class="flex flex-col items-start self-stretch pt-9 max-[70rem]:items-start max-[70rem]:pt-0 max-[43rem]:block"
  >
    <div class="mt-auto max-[70rem]:mt-0">
      <p class="mb-[18px] text-[18px] font-bold tracking-[0.12em] uppercase">
        Sustainability / Explore
      </p>
      <h1
        class="m-0 text-[67px] leading-[1.02] font-extrabold tracking-[-0.06em] max-[43rem]:text-[clamp(38px,10vw,60px)]"
        id="view-title"
        tabindex="-1"
      >
        Choose a topic
      </h1>
    </div>
    <p
      class="mt-6 max-w-[430px] text-[23px] leading-[1.4] max-[43rem]:mt-4"
    >
      Six themes. Real examples from across the Sonepar network.
    </p>
    <div
      class="mt-auto mb-[42px] flex -translate-y-[62px] items-center gap-4 text-[18px] font-semibold max-[70rem]:mt-6 max-[70rem]:mb-0 max-[70rem]:translate-y-0"
    >
      <span class="h-0.5 w-11 bg-current"></span>Select a topic to explore
    </div>
  </div>

  <nav
    class="grid h-[min(595px,88%)] min-h-0 w-full grid-cols-3 grid-rows-2 gap-4 max-[70rem]:h-auto max-[70rem]:grid-cols-2 max-[70rem]:grid-rows-none max-[43rem]:grid-cols-1"
    aria-label="Topics"
  >
    {#each chapters as chapter, index (chapter.number)}
      <button
        class="flex min-h-0 min-w-0 cursor-pointer flex-col justify-between rounded-[14px] border border-[#171913]/14 bg-[#f7f4e8]/94 px-[30px] py-[27px] text-left text-[#171913] hover:bg-[#fffdf4] focus-visible:outline-4 focus-visible:outline-offset-[-6px] focus-visible:outline-[#171913] active:bg-[#e9dfbd] max-[70rem]:min-h-[220px] max-[43rem]:min-h-[180px]"
        onclick={() => onSelectChapter(index)}
      >
        <span class="text-[17px] font-bold tracking-[0.1em] tabular-nums">
          {chapter.number} / 06
        </span>
        <span
          class="max-w-[480px] text-[36px] leading-[1.14] font-bold tracking-[-0.04em] text-balance max-[43rem]:text-[30px]"
        >
          {chapter.title}
        </span>
      </button>
    {/each}
  </nav>
</SplitViewLayout>
