# sonepar

Created with Encore.

## Kiosk experience

The interface is designed exclusively for a 1920×1080 landscape touchscreen. The fixed landscape canvas scales uniformly to fit other displays; mobile and narrow-screen reflow are not supported. After 4 minutes without interaction, it returns directly to the start without a warning. Touch or keyboard activity keeps the current view open.

Roboto is bundled locally in `static/fonts` for offline use; its license is included there. Chapter photos and partner logos are original source media documented in `static/images/SOURCES.md`, not flattened card composites.

The kiosk warms chapter photos and logos after the first paint so navigation stays responsive. Topic and card photos use higher-resolution copies made from the original photos, which remain in `static/images` as source assets. The Spain fuel photo uses its left-hand image with AI-enhanced detail; small sign lettering may differ from the source. This kiosk intentionally plays its animations even when Chrome reports reduced motion.

The layout uses a three-part landscape grid and wide margins adapted from the [Sonepar layout principles](https://brand.sonepar.com/document/1#/layouts/layout-principles). The existing full yellow background uses the official `#F3C200`; the kiosk retains its requested black Sonepar logo and near-black text. Decorative ellipses are omitted in line with the [digital guidance](https://brand.sonepar.com/document/1#/layouts/use-of-the-ellipses).
