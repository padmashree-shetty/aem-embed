/**
 * Hero Block - Subway Brand Styling
 * Optimized to handle nested UE instrumentation and multiple paragraphs.
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.classList.add('hero-subway');

  rows.forEach((row) => {
    // Check for image
    const hasImage = row.querySelector('picture');

    if (hasImage) {
      row.classList.add('hero-image');
    } else {
      row.classList.add('hero-text', 'hero-subway-content');

      // Target the title (h1 in your HTML)
      const title = row.querySelector('h1, h2, h3, h4, h5, h6');
      if (title) title.classList.add('hero-subway-title');

      // Target all paragraphs to ensure the description style applies to everything
      const ps = row.querySelectorAll('p');
      ps.forEach((p) => {
        // Only add class if the paragraph actually has text content
        if (p.textContent.trim()) {
          p.classList.add('hero-subway-subtitle');
        }
      });
    }
  });
}
