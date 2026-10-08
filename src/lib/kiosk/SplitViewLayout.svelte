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
    'grid min-h-0 grid-cols-[470px_minmax(0,1fr)] items-center gap-16',
    className
  )}
>
  {@render children()}
</div>
