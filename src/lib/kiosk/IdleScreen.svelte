<script lang="ts">
  import { gsap } from 'gsap';
  import { SplitText } from 'gsap/SplitText';

  type Props = {
    onExplore: () => void;
  };

  let { onExplore }: Props = $props();

  gsap.registerPlugin(SplitText);

  function animateIdleHeadlines(node: HTMLElement) {
    const lines = Array.from(
      node.querySelectorAll<HTMLElement>('.idle-cta-line')
    );
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timeline: gsap.core.Timeline | undefined;
    let splits: SplitText[] = [];

    function stop() {
      timeline?.kill();
      splits.forEach((split) => split.revert());
      splits = [];
      gsap.set(lines, { clearProps: 'all' });
    }

    function start() {
      stop();
      if (reducedMotion.matches) return;

      splits = lines.map((line) =>
        SplitText.create(line, { type: 'words,chars' })
      );
      gsap.set(lines, { autoAlpha: 0 });
      const sequence = gsap.timeline({ repeat: -1 });
      timeline = sequence;

      lines.forEach((line, index) => {
        const at = index * 8;
        sequence
          .set(line, { autoAlpha: 1, y: 0 }, at)
          .fromTo(
            splits[index].chars,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.98,
              ease: 'power3.out',
              stagger: 0.024
            },
            at
          )
          .to(
            line,
            { autoAlpha: 0, y: -10, duration: 0.55, ease: 'power2.inOut' },
            at + 7.72
          );
      });
    }

    reducedMotion.addEventListener('change', start);
    start();

    return {
      destroy() {
        reducedMotion.removeEventListener('change', start);
        stop();
      }
    };
  }
</script>

<button
  id="idle-start"
  class="relative z-10 block h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left text-[#171913] [-webkit-tap-highlight-color:transparent] focus-visible:outline-4 focus-visible:outline-offset-[-6px] focus-visible:outline-[#171913] max-[43rem]:min-h-[calc(100dvh-117px)]"
  aria-label="Explore Sonepar sustainability topics"
  onclick={onExplore}
>
  <span class="absolute top-[30%] left-1/2 block min-h-[210px] w-[min(1320px,calc(100%-112px))] -translate-x-1/2 text-center max-[70rem]:w-[calc(100%-48px)] max-[43rem]:top-[22%] max-[43rem]:w-[calc(100%-32px)]" aria-hidden="true" use:animateIdleHeadlines>
    <span class="idle-cta-line absolute inset-0 block text-[clamp(76px,6.5vw,105px)] leading-[1.08] font-semibold tracking-[-0.055em] opacity-0 first:opacity-100 max-[43rem]:text-[clamp(34px,8vw,48px)]"
      >Explore Sonepar’s<br />sustainability initiatives</span
    >
    <span class="idle-cta-line absolute inset-0 block text-[clamp(76px,6.5vw,105px)] leading-[1.08] font-semibold tracking-[-0.055em] opacity-0 max-[43rem]:text-[clamp(34px,8vw,48px)]"
      >Discover the stories<br />behind our progress</span
    >
  </span>
  <span class="idle-prompt absolute bottom-[8%] left-1/2 -translate-x-1/2 px-6 py-4 text-center text-[20px] leading-none font-bold tracking-[0.16em] text-[#171913] uppercase max-[70rem]:bottom-[10%] max-[43rem]:bottom-[8%]" aria-hidden="true">Tap to explore</span>
</button>

<style>
  .idle-prompt {
    animation: idle-prompt-pulse 4s cubic-bezier(0.77, 0, 0.175, 1) infinite;
  }

  @keyframes idle-prompt-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .idle-prompt {
      animation: none;
    }
  }

</style>
