/*
 * Accordion Block
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const accordionItems = document.createElement('div');
  accordionItems.className = 'accordion-items';
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);

    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', details.open);

    accordionItems.append(details);
    accordionItems.addEventListener(
      'toggle',
      (evt) => {
        if (evt.target.tagName === 'DETAILS') {
          const detailsEl = evt.target;
          const summaryEl = detailsEl.querySelector('summary');
          // Update aria-expanded on current summary
          if (summaryEl) {
            summaryEl.setAttribute('aria-expanded', detailsEl.open ? 'true' : 'false');
          }
          // Close other details if current one is opened
          if (detailsEl.open) {
            accordionItems.querySelectorAll('details').forEach((detail) => {
              if (detail !== detailsEl) {
                detail.open = false;

                const otherSummary = detail.querySelector('summary');
                if (otherSummary) {
                  otherSummary.setAttribute('aria-expanded', 'false');
                }
              }
            });
          }
        }
      },
      true,
    );
  });

  block.textContent = '';
  block.append(accordionItems);
}
