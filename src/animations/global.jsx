export const nrmlVisible = (delay = 0, duration = 0.3) => ({
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { duration, delay, ease: "easeOut" },
  },
  viewport: { once: true, amount: 0.5 },
});

export const nrmlUp = (delay = 0, distance = 15, duration = 0.3) => ({
  initial: { opacity: 0, y: distance },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: "easeOut" },
  },
  viewport: { once: true, amount: 0.5 },
});

export const nrmlDown = (delay = 0, distance = 15, duration = 0.3) => ({
  initial: { opacity: 0, y: -distance },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: "easeOut" },
  },
  viewport: { once: true, amount: 0.5 },
});

export const nrmlLeft = (delay = 0, distance = 15, duration = 0.3) => ({
  initial: { opacity: 0, x: -distance },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: "easeOut" },
  },
  viewport: { once: true, amount: 0.5 },
});

export const nrmlRight = (delay = 0, distance = 15, duration = 0.3) => ({
  initial: { opacity: 0, x: distance },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: "easeOut" },
  },
  viewport: { once: true, amount: 0.5 },
});
