/**
 * Portfolio Main JavaScript
 * Handles scroll animations, navigation, and interactions
 */

(function() {
  'use strict';

  // ===================================
  // DOM Ready
  // ===================================
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initScrollReveal();
    initSmoothScroll();
    initNavigation();
    initParallax();
  }

  // ===================================
  // Scroll Reveal Animations
  // ===================================
  function initScrollReveal() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // If reduced motion is preferred, show all elements immediately
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    // Elements to observe
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

    if (revealElements.length === 0) return;

    // Intersection Observer options
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe each element
    revealElements.forEach(el => observer.observe(el));
  }

  // ===================================
  // Smooth Scroll for Anchor Links
  // ===================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if just "#"
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Get nav height for offset
        const nav = document.querySelector('.nav');
        const navHeight = nav ? nav.offsetHeight : 0;

        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        const navLinks = document.getElementById('nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      });
    });
  }

  // ===================================
  // Navigation
  // ===================================
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!nav) return;

    // Mobile nav toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.setAttribute('aria-expanded',
          navLinks.classList.contains('active').toString()
        );
      });

      // Close nav when clicking outside
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Nav background on scroll
    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class for styling
      if (currentScroll > scrollThreshold) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');

    if (sections.length > 0) {
      const navLinkElements = document.querySelectorAll('.nav-link');

      window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const navHeight = nav.offsetHeight;

        sections.forEach(section => {
          const sectionHeight = section.offsetHeight;
          const sectionTop = section.offsetTop - navHeight - 100;
          const sectionId = section.getAttribute('id');

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinkElements.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              }
            });
          }
        });
      }, { passive: true });
    }
  }

  // ===================================
  // Parallax Effect (Hero Background)
  // ===================================
  function initParallax() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const heroGradients = document.querySelectorAll('.hero-bg-gradient');

    if (heroGradients.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

          // Only apply parallax when hero is visible
          if (scrollY < heroHeight) {
            heroGradients.forEach((gradient, index) => {
              const speed = 0.2 + (index * 0.1);
              gradient.style.transform = `translateY(${scrollY * speed}px)`;
            });
          }

          ticking = false;
        });

        ticking = true;
      }
    }, { passive: true });
  }

  // ===================================
  // Utility: Debounce
  // ===================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===================================
  // Utility: Throttle
  // ===================================
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

})();
