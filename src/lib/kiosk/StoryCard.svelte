<script lang="ts">
  import type { Card } from '$lib/kiosk/chapters';
  import { cn } from '$lib/utils/cn';

  type Props = {
    card: Card;
    index: number;
    flipped: boolean;
    onToggle: (index: number) => void;
  };

  let { card, index, flipped, onToggle }: Props = $props();
</script>

<button
  class="relative min-w-0 cursor-pointer rounded-[22px] border-0 bg-transparent p-0 text-left text-inherit [perspective:1200px] focus-visible:outline-4 focus-visible:outline-offset-[5px] focus-visible:outline-[#171913] disabled:cursor-default active:[&:not(:disabled)_.story-card-face]:brightness-[0.94] max-[70rem]:min-h-[640px] max-[43rem]:min-h-[560px]"
  aria-label={`${card.location ? `${card.location}. ` : ''}${card.title}${card.logos?.length ? `. ${card.logos.map((logo) => logo.alt).join(', ')}` : ''}. ${card.example ? (flipped ? (card.image ? 'Show image' : 'Show logos') : 'Show story') : 'Story text pending correction'}`}
  disabled={!card.example}
  onclick={() => onToggle(index)}
>
  <span class={cn('absolute inset-0 [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]', flipped && '[transform:rotateY(180deg)]')}>
    <span class="story-card-face absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-[#f7f4e8] text-[#171913] shadow-[0_14px_26px_rgb(41_32_0/0.13)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
      <span
        class={cn('relative flex min-h-0 flex-1 overflow-hidden bg-[#2b3033]', !card.image && 'grid place-items-center bg-[#f7f4e8] px-7 pt-[60px] pb-6')}
      >
        {#if card.image}
          <img class="absolute inset-0 h-full w-full object-cover" src={card.image} alt="" draggable="false" />
        {:else}
          <span
            class={cn(
              'flex h-full w-full flex-col items-center justify-center gap-6',
              card.logos?.length === 1 && 'gap-6'
            )}
          >
            {#each card.logos ?? [] as logo (logo.src)}
              <img class={cn('block max-h-[84px] max-w-[88%] object-contain [mix-blend-mode:multiply]', card.logos?.length === 1 && 'max-h-40 max-w-[92%]')} src={logo.src} alt="" draggable="false" />
            {/each}
          </span>
        {/if}
        {#if card.location}<span class="absolute bottom-[18px] left-[18px] bg-[#171913] px-4 py-2.5 text-[18px] leading-[1.1] font-bold text-[#f7f4e8]"
            >{card.location}</span
          >{/if}
      </span>
      <span class="flex h-[158px] flex-[0_0_158px] flex-col justify-between px-[22px] pt-[18px] pb-5">
        {#if card.image && card.logos?.length}
          <span class="flex h-11 items-center gap-[14px]">
            {#each card.logos as logo (logo.src)}
              <img class="block max-h-9 max-w-[125px] object-contain [mix-blend-mode:multiply]" src={logo.src} alt="" draggable="false" />
            {/each}
          </span>
        {/if}
        {#if !card.example}<span class="text-[16px] font-bold tracking-[0.03em]"
            >Story text pending</span
          >{/if}
        <span class="mt-auto flex items-end justify-between gap-3">
          <span class="block text-[27px] leading-[1.15] font-bold tracking-[-0.035em]">{card.title}</span>
        </span>
      </span>
    </span>
    <span class="story-card-face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] bg-[#171913] p-7 text-[#f7f4e8] [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]" aria-hidden={!flipped}>
      <span class="flex items-start justify-between gap-4">
        {#if card.image && card.logos?.length === 1}<img class="block max-h-10 max-w-[125px] bg-[#f7f4e8] object-contain p-2 rounded-sm"
            src={card.logos[0].src}
            alt=""
            draggable="false"
          />{/if}
      </span>
      <span class="p-0">
        <span class="block text-[40px] leading-[1.15] font-bold tracking-[-0.035em] max-[43rem]:text-[30px]">{card.title}</span>
        <span class="mt-7 block text-[23px] leading-[1.45] [text-wrap:pretty] max-[43rem]:text-[19px]"
          >{card.example ?? 'Story text pending correction.'}</span
        >
      </span>
      <span class="border-t border-current pt-[14px] text-[17px] font-semibold"
        ></span
      >
    </span>
  </span>
</button>

