function cubicCoordinate(t: number, first: number, second: number) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * first + 3 * inverse * t * t * second + t * t * t;
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (progress: number) => {
    let low = 0;
    let high = 1;
    let parameter = progress;

    for (let index = 0; index < 16; index += 1) {
      const x = cubicCoordinate(parameter, x1, x2);
      if (Math.abs(x - progress) < 0.00001) break;
      if (x < progress) low = parameter;
      else high = parameter;
      parameter = (low + high) / 2;
    }

    return cubicCoordinate(parameter, y1, y2);
  };
}

const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const easeInOut = cubicBezier(0.77, 0, 0.175, 1);

function fade(duration: number) {
  return {
    duration,
    easing: easeOut,
    css: (progress: number) => `opacity: ${progress}`
  };
}

export function viewTransition() {
  return fade(200);
}

export function chapterTransition(
  _node: Element,
  direction: -1 | 1,
  options: { direction: 'in' | 'out' | 'both' }
) {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const offset = reducedMotion ? 0 : 24;
  const sign = options.direction === 'out' ? -direction : direction;

  return {
    duration: reducedMotion ? 200 : 280,
    easing: easeInOut,
    css: (progress: number) =>
      `opacity: ${progress}; transform: translateX(${(1 - progress) * offset * sign}px)`
  };
}

export function stationaryFade() {
  return fade(260);
}
