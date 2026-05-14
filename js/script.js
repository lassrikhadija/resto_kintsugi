// ============ KINTSUGI — Interactions ============

const I18N = {
  fr: {
    sending: 'Envoi en cours...',
    sent: '✓ Demande envoyée',
    alertReservation: (name) => `Merci ${name} ! Votre demande de réservation a bien été reçue.\n\n⚠️ Démo Nextiweb — aucune donnée n'est réellement envoyée.\nVisitez nextiweb.ca pour votre vrai site.`,
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    cookieTitle: 'Témoins (cookies)',
    cookieText: 'Ce site n\'utilise aucun cookie de suivi, d\'analyse ou publicitaire. Conformément à la <strong>Loi 25</strong> du Québec, votre consentement reste libre et révocable à tout moment. Détails dans notre <a href="politique-confidentialite.html">politique de confidentialité</a>.',
    cookieAccept: 'Tout accepter',
    cookieRefuse: 'Refuser',
    consentRequired: 'Veuillez accepter la politique de confidentialité pour continuer.',
  },
  en: {
    sending: 'Sending...',
    sent: '✓ Request sent',
    alertReservation: (name) => `Thank you ${name}! Your reservation request has been received.\n\n⚠️ Nextiweb Demo — no data is actually sent.\nVisit nextiweb.ca for your own real site.`,
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    cookieTitle: 'Cookies',
    cookieText: 'This site uses no tracking, analytics or advertising cookies. In accordance with Quebec\'s <strong>Law 25</strong>, your consent remains free and revocable at any time. Details in our <a href="privacy-policy.html">privacy policy</a>.',
    cookieAccept: 'Accept all',
    cookieRefuse: 'Refuse',
    consentRequired: 'Please accept the privacy policy to continue.',
  }
};
const LANG = document.documentElement.lang.startsWith('en') ? 'en' : 'fr';
const t = I18N[LANG];

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Header sticky shrink on scroll ---
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- 2. Mobile burger menu ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    burger.setAttribute('aria-label', isOpen ? t.closeMenu : t.openMenu);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close menu on link click (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      burger.click();
    }
  });
  } // end if (burger && nav)

  // --- 3. Menu tabs (with ARIA) ---
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('hidden', '');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.querySelector(`.menu__panel[data-panel="${target}"]`);
      panel.classList.add('is-active');
      panel.removeAttribute('hidden');
    });
  });

  // --- 4. Reveal on scroll ---
  const revealEls = document.querySelectorAll(
    '.section__title, .section__lead, .dish, .review, .gallery__item, .stat, .form, .info-list, .team__member, .faq__item, .cta-banner, .ncard, .nextiweb__sub, .nextiweb__lead'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // --- 5. Reservation form (demo handling) ---
  const form = document.getElementById('reservationForm');
  if (form) {
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Loi 25 — consent check
      const consent = form.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        alert(t.consentRequired);
        consent.focus();
        return;
      }
      const data = new FormData(form);
      const name = data.get('name');
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = t.sending;
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = t.sent;
        btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
        setTimeout(() => {
          alert(t.alertReservation(name));
          form.reset();
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 800);
      }, 600);
    });
  }

  // --- 6. Newsletter (demo) ---
  const newsletter = document.getElementById('newsletterForm');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!newsletter.checkValidity()) {
        newsletter.reportValidity();
        return;
      }
      // Loi 25 — consent check
      const nlConsent = newsletter.querySelector('input[name="nlConsent"]');
      if (nlConsent && !nlConsent.checked) {
        alert(t.consentRequired);
        nlConsent.focus();
        return;
      }
      newsletter.classList.add('is-success');
      setTimeout(() => {
        newsletter.classList.remove('is-success');
        newsletter.reset();
      }, 3500);
    });
  }

  // --- 7bis. Nextiweb cards — spotlight qui suit la souris ---
  const ncards = document.querySelectorAll('.ncard');
  ncards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });

  // --- 8. Cookie banner (Loi 25) ---
  // Only injects the banner if no choice is stored in localStorage.
  const COOKIE_KEY = 'kintsugi-cookie-consent';
  if (!localStorage.getItem(COOKIE_KEY)) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', t.cookieTitle);
    banner.innerHTML = `
      <div class="cookie-banner__title">${t.cookieTitle}</div>
      <p class="cookie-banner__text">${t.cookieText}</p>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn cookie-banner__btn--refuse" data-choice="refuse">${t.cookieRefuse}</button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" data-choice="accept">${t.cookieAccept}</button>
      </div>
    `;
    document.body.appendChild(banner);
    // Animate in
    requestAnimationFrame(() => {
      setTimeout(() => banner.classList.add('is-visible'), 600);
    });
    // Handle clicks
    banner.querySelectorAll('button[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        try {
          localStorage.setItem(COOKIE_KEY, JSON.stringify({
            choice, ts: new Date().toISOString()
          }));
        } catch (_) { /* ignore localStorage failures */ }
        banner.classList.remove('is-visible');
        setTimeout(() => banner.remove(), 500);
      });
    });
  }

  // --- 7. FAQ — auto-close others when opening one ---
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

});
