<script lang="ts">
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  type Props = {
    children: Snippet;
    class?: string;
    disabled?: boolean;
    onclick?: () => void;
    ariaLabel?: string;
  };

  let {
    children,
    class: className,
    disabled = false,
    onclick,
    ariaLabel
  }: Props = $props();
</script>

<button
  type="button"
  {disabled}
  {onclick}
  aria-label={ariaLabel}
  class={cn(
    'bg-foreground text-label text-surface focus-visible:outline-foreground inline-flex min-h-14 min-w-[152px] items-center justify-center rounded-full border border-black/20 px-[22px] py-3.5 shadow-[0_4px_0_rgb(0_0_0/0.28),0_7px_14px_rgb(41_32_0/0.16)] focus-visible:outline-4 focus-visible:outline-offset-[5px] enabled:active:translate-y-0.5 enabled:active:brightness-95 disabled:cursor-default disabled:opacity-35 motion-safe:transition-[transform,filter] motion-safe:duration-150 motion-safe:enabled:active:scale-[0.96]',
    className
  )}
>
  {@render children()}
</button>
