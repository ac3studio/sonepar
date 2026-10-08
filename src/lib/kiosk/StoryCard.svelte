<script lang="ts">
  import type { Card } from '$lib/kiosk/chapters';

  import { cn } from '$lib/utils/cn';

  type Props = {
    card: Card;
    flipped: boolean;
    index: number;
    onToggle: (index: number) => void;
  };

  let { card, flipped, index, onToggle }: Props = $props();
</script>

<button
  class="focus-visible:outline-foreground relative min-w-0 cursor-pointer rounded-[22px] border-0 bg-transparent p-0 text-left text-inherit [perspective:1200px] focus-visible:outline-4 focus-visible:outline-offset-[5px] disabled:cursor-default enabled:active:[&_.story-card-face]:brightness-[0.94]"
  aria-label={`${card.location ? `${card.location}. ` : ''}${card.title}${card.logos?.length ? `. ${card.logos.map((logo) => logo.alt).join(', ')}` : ''}. ${card.example ? (flipped ? (card.image ? 'Show image' : 'Show logos') : 'Show story') : 'Story text pending correction'}`}
  disabled={!card.example}
  aria-expanded={flipped}
  aria-controls={`story-card-copy-${index}`}
  aria-describedby={flipped && card.example
    ? `story-card-copy-${index}`
    : undefined}
  onclick={() => onToggle(index)}
>
  <span
    class={cn(
      'absolute inset-0 [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]',
      flipped && '[transform:rotateY(180deg)]'
    )}
  >
    <span
      class="story-card-face bg-surface text-foreground absolute inset-0 flex flex-col overflow-hidden rounded-[18px] shadow-[0_14px_26px_rgb(41_32_0/0.13)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
      aria-hidden={flipped}
    >
      <span
        class={cn(
          'bg-media-surface relative flex min-h-0 flex-1 overflow-hidden',
          !card.image &&
            'bg-surface grid place-items-center px-7 pt-[60px] pb-6'
        )}
      >
        {#if card.image}
          <img
            class="absolute inset-0 h-full w-full object-cover"
            src={card.image}
            alt=""
            draggable="false"
          />
        {:else}
          <span
            class={cn(
              'flex h-full w-full flex-col items-center justify-center gap-6',
              card.logos?.length === 1 && 'gap-6'
            )}
          >
            {#each card.logos ?? [] as logo (logo.src)}
              <img
                class={cn(
                  'block max-h-[84px] max-w-[88%] object-contain [mix-blend-mode:multiply]',
                  card.logos?.length === 1 && 'max-h-40 max-w-[92%]'
                )}
                src={logo.src}
                alt=""
                draggable="false"
              />
            {/each}
          </span>
        {/if}
        {#if card.location}<span
            class="bg-foreground text-surface absolute bottom-[18px] left-[18px] px-4 py-2.5 text-[18px] leading-[1.1] font-bold"
            >{card.location}</span
          >{/if}
      </span>
      <span
        class="flex h-[158px] flex-[0_0_158px] flex-col justify-between px-[22px] pt-[18px] pb-5"
      >
        {#if card.image && card.logos?.length}
          <span class="flex h-11 items-center gap-[14px]">
            {#each card.logos as logo (logo.src)}
              <img
                class="block max-h-9 max-w-[125px] object-contain [mix-blend-mode:multiply]"
                src={logo.src}
                alt=""
                draggable="false"
              />
            {/each}
          </span>
        {/if}
        {#if !card.example}<span class="text-[16px] font-bold tracking-[0.03em]"
            >Story text pending</span
          >{/if}
        <span class="mt-auto flex items-end justify-between gap-3">
          <span class="text-card-title block">{card.title}</span>
        </span>
      </span>
    </span>
    <span
      class="story-card-face bg-foreground text-surface absolute inset-0 flex [transform:rotateY(180deg)] flex-col justify-between overflow-hidden rounded-[18px] p-7 [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
      aria-hidden={!flipped}
    >
      <span class="flex items-start justify-between gap-4">
        {#if card.image && card.logos?.length === 1}<img
            class="bg-surface block max-h-10 max-w-[125px] rounded-sm object-contain p-2"
            src={card.logos[0].src}
            alt=""
            draggable="false"
          />{/if}
      </span>
      <span class="p-0">
        <span class="text-story-title block">{card.title}</span>
        <span
          id={`story-card-copy-${index}`}
          class="text-description mt-7 block [text-wrap:pretty]"
          >{card.example ?? 'Story text pending correction.'}</span
        >
      </span>
    </span>
  </span>
</button>
