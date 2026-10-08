# Sonepar kiosk — project handoff

## Goal and design direction

Build a polished, landscape (target 1920 × 1080) touchscreen kiosk for Sonepar's Strategic Supplier Summit. The experience is an idle screen, topic menu, and six chapter views with independently flippable story cards. This is a kiosk, not a website: use obvious, generous touch buttons and visible tap feedback; do not rely on hover or use text links as primary controls. The visual direction is restrained and premium, with Roboto, a yellow background, dark/black text, and carefully integrated partner logos. Avoid toy-like buttons, heavy black tap outlines, oversized headers, and amateur-looking image/logo collages.

Keep context text on the left and interactive cards on the right on menu and chapter screens. Cards must retain their dimensions when flipped, and each card must flip independently. Previous/next and all-topics controls should feel like one consistent button system. The blurred yellow background should carry through all views. The guide step was removed.

## Current implementation

- `src/routes/+page.svelte` orchestrates the idle, topics, and chapter views, including navigation, scaling, and idle timers. Chapter 1–6 content and media references live in `src/lib/kiosk/chapters.ts`; the independently flippable story markup lives in `src/lib/kiosk/StoryCard.svelte`.
- `src/lib/kiosk/IdleScreen.svelte` owns the two rotating sustainability headlines and GSAP SplitText animation, with a reduced-motion fallback. The small, spaced, black `TAP TO EXPLORE` prompt fades in and out near the bottom.
- **Idle navigation is deliberately blocked:** the idle button has no click handler. This was requested while iterating. Do not quietly reconnect it.
- The standalone `/flip-card` experiment (three chapter 3 cards) was removed at the user's request. The main chapter views remain in `src/routes/+page.svelte`.
- Tailwind utilities now hold straightforward grid and card layout styling in the Svelte markup. `src/app.css` retains the shared kiosk treatment, blurred background, 3D flip effects, and responsive overrides. `README.md` covers the landscape target, reflow, idle timeout behavior, and local Roboto fonts.

## Asset and content rules

The client handoff is `C:\Users\Admin\Downloads\Sustainability_Flip_Cards`. The chapter folders `1`–`6`, `SVG`, `bg.jpg`, and `Sustainability-App _ Synoptique.docx` are the source material. The DOCX supplies chapter order, copy, and image references. **Do not use `ch*-card*.png` as final card art**: those are flattened Photoshop comps. Use the corresponding source photos and partner logos. Some cards are logo-only; some photos, especially chapter 4, already contain a country label baked into the image, so avoid duplicating it. Partner names should appear as logos when provided. Asset provenance is documented in `static/images/SOURCES.md`.

The synoptique repeats chapter 3 stories for chapter 4 cards 1–2 despite transport imagery. The user explicitly chose to **hold those two cards for corrected copy**, not display the duplicated text. Keep them unavailable until approved copy arrives.

## Open design decisions and unfinished work

- The user supplied `C:\Users\Admin\Downloads\Idle.svg` as the approximate target **idle-screen layout**. It has not been implemented or visually verified against the app. The last feedback was that the two logos needed better alignment, more spacing between them, and headlines slightly larger relative to the logos. Earlier idle headline and CTA motion iterations are in code, but the SVG layout remains the next visual reference.
- The Figma file is [Untitled](https://www.figma.com/design/FEjklHlz67Du57JfSgYnWE/Untitled). The user took over finishing the three-screen Figma work; do not assume it is complete or that the app should be rewritten from it without checking.
- A separate one-card, then three-card flip experiment was tried and subsequently removed. Do not assume that route is part of the desired kiosk flow.

## Verification and repository state

The live preview has been at `http://127.0.0.1:5173/`; idle-screen taps were checked to remain on `/`. The now-removed `/flip-card` experiment had previously been manually checked at landscape size with multiple cards flipped at once. After the October 8 refactor, `pnpm check` reported zero errors/warnings, and `pnpm build` succeeded when run outside the restrictive file sandbox. If a sandboxed command reports missing package internals, confirm whether it is a file-access issue before assuming the install is broken. `git diff --check` passed apart from line-ending warnings.

The working tree is dirty with existing source, documentation, font, and image changes, plus untracked `.idea/`. Preserve all unrelated work; do not reset or clean. Repo-specific working rules were provided in the conversation: make small, scoped changes, inspect before editing, avoid unnecessary dependencies, verify narrowly, and report any unverified behavior.
