/**
 * VEYON GLOBAL SOLUTIONS FZ-LLC
 * Main Client-Side Script
 * Minimal, lightweight, accessible and performant.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactTriggerBtn = document.getElementById('contactTriggerBtn');

  /* ------------------------------------------------------------------------
     1. Sticky Header Elevation on Scroll
     ------------------------------------------------------------------------ */
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Toggle & Drawer Control
     ------------------------------------------------------------------------ */
  const toggleMobileNav = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    if (isOpen) {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => toggleMobileNav());

    // Close mobile nav when clicking any link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileNav(false));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        toggleMobileNav(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Smooth Anchor Scrolling with Header Offset
     ------------------------------------------------------------------------ */
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  allAnchorLinks.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = header.offsetHeight + 10;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash smoothly without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Scrollspy for Desktop Navigation Link Highlighting
     ------------------------------------------------------------------------ */
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ------------------------------------------------------------------------
     5. Fade-Up Reveal Animations on Scroll
     ------------------------------------------------------------------------ */
  const reveals = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealAll = () => {
    reveals.forEach(el => el.classList.add('revealed'));
  };

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '120px 0px 50px 0px',
      threshold: 0.02
    });

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      } else {
        revealObserver.observe(el);
      }
    });

    // Fallback guarantees that no content remains hidden
    setTimeout(revealAll, 1500);
    window.addEventListener('scroll', () => {
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 120) {
          el.classList.add('revealed');
        }
      });
    }, { passive: true });
  } else {
    revealAll();
  }

  /* ------------------------------------------------------------------------
     5b. Direct View Query Parameter Handler (Deep link / Inspection)
     ------------------------------------------------------------------------ */
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const viewSection = urlParams.get('view');
    if (viewSection) {
      const targetEl = document.getElementById(viewSection);
      if (targetEl) {
        revealAll();
        targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }
  } catch (err) {
    // Silent
  }

  /* ------------------------------------------------------------------------
     6. Placeholder Action Handling (Contact & Socials)
     ------------------------------------------------------------------------ */
  if (contactTriggerBtn) {
    contactTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Placeholder interaction: subtle tactile feedback
      contactTriggerBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        contactTriggerBtn.style.transform = '';
      }, 150);
    });
  }

  const socialBtns = document.querySelectorAll('.social-btn, .social-icon-btn');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
});
