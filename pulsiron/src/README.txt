Pulsiron — README
=================

Thank you for downloading Pulsiron, a fitness & gym template by ThemeVault.

FILES
  *.html            the pages (open index.html in a browser — no build step needed)
  email-*.html      standalone HTML email(s): paste into your email service, replace the {{merge}} fields
  css/style.css     your styles. Design tokens at the top (:root); section rules are labelled further down
  css/tailwind.css  compiled Tailwind utilities. To rebuild after editing HTML: tailwindcss -i src/tailwind.css -o css/tailwind.css --minify (standalone CLI from tailwindcss.com)
  js/main.js        every behaviour in one file, each block independent; no jQuery
  fonts/            self-hosted web fonts (Bebas Neue, Barlow, Google Fonts, OFL)
  images/           free stock photographs (credits in IMAGE-CREDITS.txt) — replace with your own using the same file names

CUSTOMISING
  1. Colours / fonts / radius / spacing: edit the --tv-* tokens in the :root block of css/style.css.
  2. Text and images: edit the HTML directly; every image has width/height attributes — keep the same aspect ratio.
  3. Forms: forms validate in the browser and show a success message. To send for real, set the form's
     action="" to your endpoint (Formspree, Basin, Netlify Forms or your own API) — see the forms block in js/main.js.
  4. Emails: email-membership.html — host the images at a public URL and swap the merge fields for your provider's tags.
  5. Icons: Tabler Icons (inline SVG symbols at the top of each page; add more from Tabler Icons).
  6. Map: contact page uses an OpenStreetMap embed — change the bbox/marker in the iframe src, no API key needed.

CREDIT
  The footer link to ThemeVault is the licence condition for the free download. You can remove it for this
  template by purchasing credit removal on the template page (see License.txt).

SUPPORT
  https://www.themevault.net/contact/
