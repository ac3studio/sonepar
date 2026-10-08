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
    'min-h-14 min-w-[152px] rounded-[10px] bg-[#fffdf6]/88 px-[22px] py-3.5 text-[18px] font-semibold text-[#171913] shadow-[0_2px_8px_rgb(41_32_0/0.12)] focus-visible:outline-4 focus-visible:outline-offset-[5px] focus-visible:outline-[#171913] disabled:cursor-default disabled:opacity-35 active:bg-[#f1ead5] motion-safe:transition-[scale] motion-safe:duration-150 active:scale-[0.96]',
    className
  )}
>
  {@render children()}
</button>
