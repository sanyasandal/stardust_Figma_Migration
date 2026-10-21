import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Closes the open nav dropdown (desktop) or the nav menu (mobile) on Escape
 * @param {KeyboardEvent} e keydown event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

/**
 * Closes the open nav dropdown (desktop) or the nav menu (mobile) when focus leaves the nav
 * @param {FocusEvent} e focusout event
 */
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
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

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean|string} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-drop > button').forEach((button) => {
    button.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  // the desktop nav is always expanded, so aria-expanded only applies to the mobile menu
  if (isDesktop.matches) nav.removeAttribute('aria-expanded');
  else nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Builds the oneAZ breadcrumb (M2) from the URL path, titling ancestors from nav links.
 * @param {Element} nav The decorated nav
 * @returns {Element|null}
 */
function buildBreadcrumb(nav) {
  const brand = nav.querySelector('.nav-brand a[href]');
  const home = brand ? new URL(brand.href, window.location).pathname.replace(/\/$/, '') : '';
  const path = window.location.pathname.replace(/\/$/, '');
  if (path === home || !path.startsWith(`${home}/`)) return null;
  const titles = new Map();
  nav.querySelectorAll('a[href]').forEach((a) => {
    titles.set(new URL(a.href, window.location).pathname.replace(/\/$/, ''), a.textContent.trim());
  });
  const parts = path.slice(home.length + 1).split('/');
  const crumb = document.createElement('nav');
  crumb.className = 'breadcrumb';
  crumb.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  const add = (label, href) => {
    const li = document.createElement('li');
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.append(a);
    } else {
      li.textContent = label;
      li.setAttribute('aria-current', 'page');
    }
    ol.append(li);
  };
  add('Home', `${home}/`);
  parts.forEach((part, i) => {
    const p = `${home}/${parts.slice(0, i + 1).join('/')}`;
    const fallback = part.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
    if (i === parts.length - 1) {
      const h1 = document.querySelector('main h1');
      add(titles.get(p) || (h1 && h1.textContent.trim()) || fallback);
    } else add(titles.get(p) || fallback, p);
  });
  crumb.append(ol);
  return crumb;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = 'brand';
      const wrapper = brandLink.closest('.button-wrapper, .button-container');
      if (wrapper) wrapper.className = '';
      const mark = document.createElement('span');
      mark.className = 'brand-mark';
      mark.setAttribute('aria-hidden', 'true');
      brandLink.prepend(mark);
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const subList = navSection.querySelector(':scope > ul');
      if (!subList) return;
      navSection.classList.add('nav-drop');
      // the authored label link stays a link; a sibling chevron button toggles the drop-down
      const label = navSection.querySelector(':scope > a, :scope > p > a');
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-expanded', false);
      button.setAttribute('aria-label', `${label ? label.textContent.trim() : 'Section'} menu`);
      if (!label) {
        [...navSection.childNodes].forEach((node) => {
          if (node !== subList) button.append(node);
        });
      }
      subList.before(button);
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        if (isDesktop.matches) toggleAllNavSections(navSections);
        button.setAttribute('aria-expanded', !expanded);
      });
    });
  }

  // utility bar (oneAZ header top row) is the authored tools section
  const utility = document.createElement('div');
  utility.className = 'nav-utility';
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) utility.append(navTools);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.append(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(utility, navWrapper);
  const crumb = buildBreadcrumb(nav);
  if (crumb) block.append(crumb);
}
