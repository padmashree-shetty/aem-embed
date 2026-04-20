export default function decorate(block) {
  const rows = [...block.children];

  const socialWrapper = document.createElement('div');
  socialWrapper.className = 'social-icons';

  const downloadWrapper = document.createElement('div');
  downloadWrapper.className = 'store-badges';

  rows.forEach((row) => {
    const img = row.querySelector('img');
    const link = row.querySelector('a');
    const type = row.children[2]?.textContent?.trim();

    if (!img || !link) {
      socialWrapper.append(row);
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.append(img);
    anchor.setAttribute('target', '_blank');
    anchor.rel = 'noopener noreferrer';

    row.innerHTML = '';
    row.appendChild(anchor);
    if (type === 'download') {
      downloadWrapper.append(row);
    } else {
      socialWrapper.append(row);
    }
  });

  block.textContent = '';
  block.append(socialWrapper, downloadWrapper);
}
