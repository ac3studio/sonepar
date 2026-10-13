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

function cubicCoordinate(t: number, first: number, second: number) {
  const inverse = 1 - t;
  return (
    3 * inverse * inverse * t * first + 3 * inverse * t * t * second + t * t * t
  );
}

const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const easeInOut = cubicBezier(0.77, 0, 0.175, 1);

export function chapterTransition(
  _node: Element,
  direction: -1 | 1,
  options: { direction: 'both' | 'in' | 'out' }
) {
  const sign = options.direction === 'out' ? -direction : direction;

  return {
    css: (progress: number) =>
      `opacity: ${progress}; transform: translateX(${(1 - progress) * 24 * sign}px)`,
    duration: 280,
    easing: easeInOut
  };
}

export function stationaryFade() {
  return fade(260);
}

export function viewTransition() {
  return fade(200);
}

function fade(duration: number) {
  return {
    css: (progress: number) => `opacity: ${progress}`,
    duration,
    easing: easeOut
  };
}
