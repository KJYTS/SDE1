# Indietown recovery

This branch restores the latest implementation recorded in the conversation after
an environment snapshot restored only the initial homepage files.

The current checkout and origin contained only initial commit
`5732de05f01db19b129c9b1e84b15956cde66b36`. Earlier conversation commits `3715f18`
and `5168007` were not present as Git objects, including unreachable objects.
Their original commit history could not be recovered; this branch records the
reconstructed latest source in a new commit instead.

## Included application files

- `index.html`: home; both entry links open `join.html`; corrected SVG noise mask.
- `join.html`: role introduction; Listener and Buyer links.
- `listener.html`: 17 selectable music keywords.
- `buyer.html`: 17 selectable music keywords; Next opens `buyer-plan.html`.
- `buyer-plan.html`: Professional Plan benefits, prices and payment notice.
- `styles.css`: shared styling for all five screens and selection states.
- `preferences.js`: multiple selection, deselection, remove icons, Next state and Buyer navigation.

All implemented artwork is inline SVG or CSS; there are no external image,
font, CDN, package or service dependencies needed to open these pages. The
original Figma file and user-provided screenshots are reference material, not
separate runtime assets, and are not available as files in this restored checkout.

## Open locally

Keep the files together and open `index.html` in a browser. Alternatively, from
the repository directory run `python3 -m http.server 8000` and open the local
server in your own browser.

## Existing scope limits

- Artist has no destination screen yet.
- Listener Next changes to purple after selection but has no destination yet.
- Buyer payment now opens `music-map.html`; no actual payment is performed.
- `music-map.html` and `music-map.js` provide a sample music map with search,
  filter controls and artist/song notices. Profile/album artwork is placeholder
  inline SVG/CSS; other bottom navigation destinations are not implemented.
- Designs are approximated from screenshots, as authorized in the conversation.

## Recovery validation

Chromium checks passed at viewport widths 390, 590 and 1280 pixels:
both home entry links, role navigation, all 17 keywords, multiple selection and
deselection, disabled/enabled Next state and purple colors, all-selected layout,
Buyer plan navigation, three benefit items, payment notice open/close and browser
back navigation. No JavaScript errors or horizontal overflow were observed in
those flows. All local HTML/CSS/script references were checked for missing files.
