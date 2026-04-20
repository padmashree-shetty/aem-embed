import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  // TODO: Embed mode related changes. Final approach to be confirmed.
  const isEmbedMode = block.querySelector('.section');

  let fragment;

  // TODO: Embed mode related changes. Final approach to be confirmed.
  if (isEmbedMode) {
    fragment = block.querySelector('nav');
  } else {
    fragment = await loadFragment(footerPath);
  }

  block.textContent = '';

  const sections = [...fragment.querySelectorAll('.section')];

  const navSection = sections[0];
  const promoSection = sections[1];
  const legalSection = sections[2];
  const socialSection = sections[3];

  if (navSection) navSection.classList.add('footer-nav');
  if (promoSection) promoSection.classList.add('footer-promo');
  if (legalSection) legalSection.classList.add('footer-legal');
  if (socialSection) socialSection.classList.add('footer-social');

  block.append(navSection, promoSection, legalSection, socialSection);
}