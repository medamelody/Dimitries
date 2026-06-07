const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

const socialLinksList = document.querySelector('#social-links');
const socialEmpty = document.querySelector('#social-empty');

const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const storageKey = 'pianist.social.links';
const instagramAccountUrl = 'https://www.instagram.com/dhmhtrhs._pap?igsh=MXBtY256ejhrMGtrcA==';

const defaultLinks = [
  { id: crypto.randomUUID(), platform: 'Instagram', url: instagramAccountUrl },
  { id: crypto.randomUUID(), platform: 'YouTube', url: 'https://youtube.com/' },
  { id: crypto.randomUUID(), platform: 'Facebook', url: 'https://facebook.com/' },
];

let socialLinks = loadLinks();
if (socialLinksList && socialEmpty) {
  renderSocialLinks();
}

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactStatus.textContent = 'Please complete all required fields before sending your request.';
      return;
    }

    const name = document.querySelector('#name').value.trim();
    contactStatus.textContent = `Thank you, ${name}. Your contact request has been prepared successfully.`;
    contactForm.reset();
  });
}

function renderSocialLinks() {
  if (!socialLinksList || !socialEmpty) {
    return;
  }

  socialLinksList.innerHTML = '';

  socialLinks.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'social-item';

    const anchor = document.createElement('a');
    anchor.href = item.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'social-icon-link';
    anchor.textContent = getSocialIcon(item.platform);
    anchor.setAttribute('aria-label', `Open ${item.platform} profile in a new tab`);
    anchor.title = item.platform;

    li.append(anchor);
    socialLinksList.append(li);
  });

  socialEmpty.hidden = socialLinks.length > 0;
}

function loadLinks() {
  const ensureInstagramLink = (links) => {
    const hasInstagram = links.some((link) => link.url === instagramAccountUrl);
    if (!hasInstagram) {
      links.unshift({ id: crypto.randomUUID(), platform: 'Instagram', url: instagramAccountUrl });
    }

    return links;
  };

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return ensureInstagramLink([...defaultLinks]);
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? ensureInstagramLink(parsed) : ensureInstagramLink([...defaultLinks]);
  } catch {
    return ensureInstagramLink([...defaultLinks]);
  }
}

function saveLinks() {
  localStorage.setItem(storageKey, JSON.stringify(socialLinks));
}

function getSocialIcon(platform) {
  const key = platform.toLowerCase();

  if (key.includes('instagram')) {
    return '📷';
  }

  if (key.includes('youtube')) {
    return '▶️';
  }

  if (key.includes('facebook')) {
    return 'f';
  }

  return '🔗';
}
