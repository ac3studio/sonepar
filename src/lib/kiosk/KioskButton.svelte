<script lang="ts">
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  type Props = {
    children: Snippet;
    class?: string;
    disabled?: boolean;
    onclick?: () => void;
  };

  let {
    children,
    class: className,
    disabled = false,
    onclick
  }: Props = $props();
</script>

<button
  type="button"
  {disabled}
  {onclick}
  class={cn(
    'bg-kiosk-paper/88 text-kiosk-label text-kiosk-ink focus-visible:outline-kiosk-ink min-h-14 min-w-[152px] rounded-[10px] px-[22px] py-3.5 shadow-[0_2px_8px_rgb(41_32_0/0.12)] focus-visible:outline-4 focus-visible:outline-offset-[5px] enabled:active:brightness-95 disabled:cursor-default disabled:opacity-35 motion-safe:transition-[scale] motion-safe:duration-150 motion-safe:enabled:active:scale-[0.96]',
    className
  )}
>
  {@render children()}
</button>
