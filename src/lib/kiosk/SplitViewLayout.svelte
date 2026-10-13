<script lang="ts">
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  type Props = {
    children: Snippet;
    class?: string;
  };

  let { children, class: className }: Props = $props();
</script>

<div
  class={cn(
    'grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-center gap-12',
    className
  )}
>
  {@render children()}
</div>
