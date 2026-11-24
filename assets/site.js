const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
document.documentElement.classList.add('js');
menu.hidden = false;

function setMenu(open) {
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
const language = document.querySelector('.language');
const alternate = language.getAttribute('href');
function syncLanguageLink() {
  language.setAttribute('href', alternate + location.hash);
}
window.addEventListener('hashchange', syncLanguageLink);
syncLanguageLink();

const links = Array.from(navigation.querySelectorAll('a'));
const sections = links.map(link => document.querySelector(link.hash));
function updateCurrentSection() {
  let activeIndex = -1;
  for (const [index, section] of sections.entries()) {
    if (section.getBoundingClientRect().top <= 130) activeIndex = index;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    activeIndex = sections.length - 1;
  }
  links.forEach((link, index) => {
    if (activeIndex === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    updateCurrentSection();
    scheduled = false;
  });
}, {passive: true});
updateCurrentSection();

const counter = document.querySelector('.page-views');
if (counter && location.origin === 'https://kgongzju.github.io' && location.pathname.startsWith('/personal-web/')) {
  const badge = new Image();
  badge.referrerPolicy = 'no-referrer';
  badge.alt = counter.textContent;
  const badgeUrl = new URL(counter.href);
  badgeUrl.pathname = badgeUrl.pathname.replace(/\/$/, '.svg');
  badgeUrl.search = new URLSearchParams({
    label: counter.dataset.label, style: 'flat-square', labelColor: '536675', color: '395a70'
  });
  badge.onload = () => counter.replaceChildren(badge);
  counter.hidden = false;
  badge.src = badgeUrl.href;
}
