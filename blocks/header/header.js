import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
    .forEach((section) => {
      section.setAttribute('aria-expanded', expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded =
    forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

// TODO: Embed mode related changes. Final approach to be confirmed.
function setCookie(name, value, days = 1) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

// TODO: Embed mode related changes. Final approach to be confirmed.
  const isEmbedMode = block.querySelector('.section');

  let fragment;

// TODO: Embed mode related changes. Final approach to be confirmed.
  if (isEmbedMode) {
    fragment = block.querySelector('nav');
  } else {
    fragment = await loadFragment(navPath);
  }

  block.innerHTML = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  const sections = [...fragment.querySelectorAll(':scope > .section')];

  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';

  const logoImg = sections[0]?.querySelector('img');
  if (logoImg) {
    const link = document.createElement('a');
    link.href = '/';
    link.appendChild(logoImg.cloneNode(true));
    navBrand.appendChild(link);
  }

  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';

  const menuWrapper = document.createElement('div');
  menuWrapper.className = 'default-content-wrapper';

  const menuList = sections[1]?.querySelector('ul');

  if (menuList) {
    menuWrapper.appendChild(menuList.cloneNode(true));
  }

  navSections.appendChild(menuWrapper);

  const toolsSection = sections[2];

  let navToolsButton = null;
  const startOrder = toolsSection?.querySelector('a.button');

  if (startOrder) {
    navToolsButton = document.createElement('div');
    navToolsButton.className = 'nav-tools-button';
    navToolsButton.appendChild(startOrder.cloneNode(true));
  }

  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';

  const navToolsIcons = document.createElement('div');
  navToolsIcons.className = 'nav-tools-icons';

  let userData = null;

// TODO: Embed mode related changes. Final approach to be confirmed.
  if (isEmbedMode) {
    // Fix relative icon paths for embed origin
    const origin = block.parentElement?.getAttribute('data-origin');

    if (origin) {
      toolsSection?.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
          img.setAttribute('src', `${origin}${src}`);
        }
      });
    }

  }

  const cookieValue = getCookie('edsUserData');

  if (cookieValue) {
    try {
      userData = JSON.parse(cookieValue);
    } catch (e) {
      console.warn('Invalid edsUserData cookie');
    }
  }

  const icons = toolsSection?.querySelectorAll('.icon');

  if (icons?.length) {
    const userIcon = icons[0]?.cloneNode(true);

    if (userData?.username && userIcon) {
      const usernameLabel = document.createElement('span');
      usernameLabel.className = 'user-name';
      usernameLabel.textContent = userData.username;
      userIcon.innerHTML = '';
      userIcon.appendChild(usernameLabel);
    }

    if (userIcon) {
      navToolsIcons.appendChild(userIcon);
    }

    const cartWrapper = document.createElement('div');
    cartWrapper.className = 'cart-icon-wrapper';

    const cartIcon = icons[1]?.cloneNode(true);
    if (cartIcon) {
      cartWrapper.appendChild(cartIcon);
    }

    const cartCounter = document.createElement('div');
    cartCounter.className = 'cart-counter';
    cartCounter.textContent = userData?.cartCount ?? '0';

    cartWrapper.appendChild(cartCounter);
    navToolsIcons.appendChild(cartWrapper);
  }

  navTools.appendChild(navToolsIcons);

  nav.append(navBrand, navSections, navToolsButton, navTools);

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  block.append(navWrapper);
}