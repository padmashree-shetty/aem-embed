/**
 * Banner Block - Subway EDS + Universal Editor Optimized
 */
export default function decorate(block) {
  // 1. Move 'highlight' class to the parent wrapper
  if (block.classList.contains('highlight')) {
    block.closest('.banner-wrapper')?.classList.add('highlight');
    block.classList.remove('highlight');
  }

  const rows = [...block.children];

  // 2. Extract CTA data from the extra rows (Rows 3 and 4)
  const ctaText = rows[3]?.textContent?.trim();
  const ctaType = rows[4]?.textContent?.trim() || 'btn-primary';

  rows.forEach((row, i) => {
    if (i === 0) row.classList.add('banner-heading');
    if (i === 1) row.classList.add('banner-description');

    if (i === 2) {
      row.classList.add('banner-cta');
      const link = row.querySelector('a');
      if (link) {
        // Update link text and classes based on extracted data
        if (ctaText) link.textContent = ctaText;

        link.className = ''; // Clear EDS defaults
        if (ctaType === 'cta-primary') {
          link.classList.add('cta', 'cta-primary');
        } else {
          link.classList.add('btn', ctaType);
        }
      }
    }

    // 3. Hide the raw data rows so they don't show up in the UI
    if (i >= 3) row.remove();
  });
}
