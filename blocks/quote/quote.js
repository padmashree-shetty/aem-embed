export default function decorate(block) {
  const { children } = block;

  if (!children || children.length < 1) {
    return;
  }

  const [quoteWrapper, authorName] = children;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();
  blockquote.className = 'quote-text';
  quoteWrapper.replaceChildren(blockquote);

  if (authorName) {
    const authorText = authorName.textContent?.trim();
    if (authorText) {
      const author = document.createElement('cite');
      author.textContent = authorText;
      author.className = 'quote-author';
      authorName.replaceWith(author);
    }
  }
}
