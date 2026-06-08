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
const facebookUrl = 'https://www.facebook.com/profile.php?id=100008458355039';
const youtubeUri = 'https://www.youtube.com/@DimitriosPapakyriazis';

const defaultLinks = [
  { id: crypto.randomUUID(), platform: 'Instagram', url: instagramAccountUrl },
  { id: crypto.randomUUID(), platform: 'YouTube', url: youtubeUri },
  { id: crypto.randomUUID(), platform: 'Facebook', url: facebookUrl },
];

let socialLinks = loadLinks();
if (socialLinksList && socialEmpty) {
  renderSocialLinks();
}

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      contactStatus.textContent = 'Please complete all required fields.';
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const nextUrl = contactForm.querySelector('input[name="_next"]')?.value || '/';

    contactStatus.textContent = 'Sending your request...';
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      contactStatus.textContent = 'Your request was submitted successfully. Redirecting to the main page...';
      contactForm.reset();

      setTimeout(() => {
        window.location.href = nextUrl;
      }, 1800);
    } catch {
      contactStatus.textContent = 'Sorry, your request could not be sent. Please try again.';
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
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
  
function loadLinks() {
  const ensureyoutubeLink = (links) => {
    const hasYoutube = links.some((link) => link.url === youtubeUri);
    if (!hasYoutube) {
      links.unshift({ id: crypto.randomUUID(), platform: 'Youtube', url: youtubeUri });
    }
    return links;
  };

function loadLinks() {
  const ensurefacebookLink = (links) => {
    const hasfacebook = links.some((link) => link.url === facebookUrl);
    if (!hasfacebook) {
      links.unshift({ id: crypto.randomUUID(), platform: 'Facebook', url: facebookUrl });
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
