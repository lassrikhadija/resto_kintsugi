// ============ KINTSUGI — Interactions ============

const I18N = {
  fr: {
    sending: 'Envoi en cours...',
    sent: '✓ Demande envoyée',
    alertReservation: (name) => `Merci ${name} ! Votre demande de réservation a bien été reçue.\n\n⚠️ Démo Nextiweb — aucune donnée n'est réellement envoyée.\nVisitez nextiweb.ca pour votre vrai site.`,
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  en: {
    sending: 'Sending...',
    sent: '✓ Request sent',
    alertReservation: (name) => `Thank you ${name}! Your reservation request has been received.\n\n⚠️ Nextiweb Demo — no data is actually sent.\nVisit nextiweb.ca for your own real site.`,
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  }
};
const LANG = document.documentElement.lang.startsWith('en') ? 'en' : 'fr';
const t = I18N[LANG];

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Header sticky shrink on scroll ---
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- 2. Mobile burger menu ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
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
    '.section__title, .section__lead, .dish, .review, .gallery__item, .stat, .form, .info-list, .team__member, .faq__item, .cta-banner'
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
      newsletter.classList.add('is-success');
      setTimeout(() => {
        newsletter.classList.remove('is-success');
        newsletter.reset();
      }, 3500);
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
