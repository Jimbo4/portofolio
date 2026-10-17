/*
 * next/image placeholder: an animated shimmer shown until the image has loaded, then removed by next/image.
 * It is an SVG data URL, so it cannot read CSS variables: the colors mirror --color-paper-2 and --color-paper-3.
 */
const shimmerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
<style>.band{animation:sweep 1.6s ease-in-out infinite}@keyframes sweep{from{transform:translateX(-100px)}to{transform:translateX(100px)}}@media (prefers-reduced-motion:reduce){.band{animation:none;opacity:0}}</style>
<defs><linearGradient id="g"><stop offset="0" stop-color="#faf8f5" stop-opacity="0"/><stop offset=".5" stop-color="#faf8f5" stop-opacity=".75"/><stop offset="1" stop-color="#faf8f5" stop-opacity="0"/></linearGradient></defs>
<rect width="100" height="100" fill="#ede8e1"/>
<rect class="band" width="100" height="100" fill="url(#g)"/>
</svg>`;

export const shimmerPlaceholder: `data:image/${string}` = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shimmerSvg)}`;
