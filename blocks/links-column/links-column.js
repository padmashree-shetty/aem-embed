export default function decorate(block) {
  const isHorizontal = block.classList.contains('horizontal');
  const rows = [...block.children];

  if (!rows.length) return;

  if (isHorizontal) {
    const wrapper = document.createElement('div');
    wrapper.className = 'legal-links';

    rows.slice(1).forEach((row) => {
      const label = row.children[1]?.textContent?.trim();
      const linkEl = row.querySelector('a');
      const newTab = row.children[3]?.textContent?.trim() === 'true';

      if (!label || !linkEl) {
        wrapper.append(row);
        return;
      }

      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = label;

      if (newTab) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

      row.innerHTML = '';
      row.appendChild(a);

      wrapper.append(row);
    });

    block.textContent = '';
    block.append(wrapper);
    return;
  }

  const firstRowText = rows[0].textContent.trim();
  const hasHeading = rows[0].querySelector('p');

  if (hasHeading && rows[0].children.length === 1) {
    const headingText = firstRowText;
    rows.shift();

    const heading = document.createElement('button');
    heading.className = 'footer-heading';
    heading.type = 'button';
    heading.innerHTML = `
      <span>${headingText}</span>
      <span class="chevron"></span>
    `;
    heading.setAttribute('aria-expanded', 'true');

    const list = document.createElement('ul');
    list.className = 'footer-links';

    rows.forEach((row) => {
      const label = row.children?.[1]?.textContent?.trim();
      const linkEl = row.querySelector('a');
      const newTab = row.children?.[3]?.textContent?.trim() === 'true';

      if (!label || !linkEl) {
        list.append(row);
        return;
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = label;

      if (newTab) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

      row.innerHTML = '';
      row.appendChild(a);

      li.append(row);
      list.append(li);
    });

    block.textContent = '';
    block.append(heading, list);

    heading.addEventListener('click', () => {
      if (window.innerWidth >= 1024) return;
      const isOpen = block.classList.toggle('open');
      heading.setAttribute('aria-expanded', String(isOpen));
    });

    return;
  }

  const promoWrapper = document.createElement('div');
  promoWrapper.className = 'promo-links';

  rows.slice(1).forEach((row) => {
    const img = row.querySelector('img');
    const label = row.children[1]?.textContent?.trim();
    const linkEl = row.querySelector('a');
    const newTab = row.children[3]?.textContent?.trim() === 'true';

    if (!img || !label || !linkEl) {
      promoWrapper.append(row);
      return;
    }

    const a = document.createElement('a');
    a.href = linkEl.href;

    if (newTab) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }

    const text = document.createElement('span');
    text.textContent = label;

    a.append(img, text);

    row.innerHTML = '';
    row.appendChild(a);

    promoWrapper.append(row);
  });

  block.textContent = '';
  block.append(promoWrapper);
}
