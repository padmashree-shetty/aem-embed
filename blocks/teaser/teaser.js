import { createOptimizedPicture } from '../../scripts/aem.js';

export function generateTeaserDOM(props, classes) {
  const [pictureContainer, imageDesc, eyebrow, title, longDescr, shortDescr, firstCta, secondCta] =
    props || [];

  if (!pictureContainer || !title) {
    return [];
  }

  const picture = pictureContainer.querySelector('picture');
  if (picture) {
    const pictureEl = picture.querySelector('img');
    if (pictureEl?.src) {
      const pictureSrc = pictureEl.src;
      pictureEl.alt = imageDesc?.textContent?.trim() || 'title image';
      const optimizedPicture = createOptimizedPicture(pictureSrc, '', false, [{ width: '1360' }]);
      pictureContainer.textContent = '';
      pictureContainer.appendChild(optimizedPicture);
    }
  }
  const hasShortDescr = shortDescr?.textContent?.trim() !== '';
  const hasLongDescr = longDescr?.textContent?.trim() !== '';

  const background = document.createElement('div');
  background.className = 'teaser-background';

  if (picture) {
    background.appendChild(picture);
  }

  const foreground = document.createElement('div');
  foreground.className = 'teaser-foreground';

  const text = document.createElement('div');
  text.className = 'text';

  // Eyebrow
  if (eyebrow && (eyebrow.textContent.trim() !== '' || eyebrow.querySelector('img') !== null)) {
    const teaserEyebrow = document.createElement('div');
    teaserEyebrow.className = 'teaser-eyebrow';
    while (eyebrow.firstChild) {
      teaserEyebrow.appendChild(eyebrow.firstChild);
    }

    text.appendChild(teaserEyebrow);
  }

  // Title
  const teaserTitle = document.createElement('div');
  teaserTitle.className = 'teaser-title';

  while (title.firstChild) {
    teaserTitle.appendChild(title.firstChild);
  }

  text.appendChild(teaserTitle);

  // Long Description
  if (hasLongDescr) {
    longDescr.querySelectorAll('a').forEach((a) => {
      a.setAttribute('class', 'btn btn-outline');
    });
    const longDescription = document.createElement('div');
    longDescription.className = 'teaser-lg-description';

    while (longDescr.firstChild) {
      longDescription.appendChild(longDescr.firstChild);
    }

    text.appendChild(longDescription);
  }

  // Short Description
  if (hasShortDescr) {
    const shortDescription = document.createElement('div');
    shortDescription.className = 'teaser-sh-description';

    while (shortDescr.firstChild) {
      shortDescription.appendChild(shortDescr.firstChild);
    }

    text.appendChild(shortDescription);
  }

  // CTA
  const teaserCta = document.createElement('div');
  teaserCta.className = 'teaser-cta cta';
  const firstCtaLink = firstCta?.querySelector('a');
  if (firstCtaLink) {
    teaserCta.appendChild(firstCtaLink);
  }
  const secondCtaLink = secondCta?.querySelector('a');
  if (secondCtaLink) {
    teaserCta.appendChild(secondCtaLink);
  }
  text.appendChild(teaserCta);

  foreground.appendChild(text);

  // set the background color
  const backgroundColor = [...classes].find((cls) => cls.startsWith('bg-'));
  if (backgroundColor) {
    foreground.style.setProperty('--teaser-background-color', `var(--${backgroundColor.slice(3)})`);
  }
  return [background, foreground];
}

export default async function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const [teaserBackground, teaserForeground] = generateTeaserDOM(props, block.classList);
  block.textContent = '';
  block.append(teaserBackground, teaserForeground);
}
