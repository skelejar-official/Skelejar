/* eslint-env browser */
/* eslint-disable */

// Firebase SDK Imports (from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// eslint-disable-next-line no-unused-vars
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_BUCKET_HERE",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Document Ready Logic
document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE MENU CODE ---
  const btn = document.getElementById('mobile-menu-btn');
  const linksWrapper = document.querySelector('header nav .ml-auto');
  let menu;

  const closeMenu = () => {
    if (menu) {
      menu.style.opacity = '0';
      menu.style.maxHeight = '0';
      btn.setAttribute('aria-expanded', 'false');
      if (btn) btn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
      document.body.classList.remove('overflow-hidden');
    }
  };

  const createMobileMenu = () => {
    if (menu) return;
    menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.className = 'md:hidden bg-dark-card border-t border-gray-700 p-6 transition-all duration-300 ease-in-out opacity-0 max-h-0 overflow-hidden';

    if (linksWrapper) {
      linksWrapper.querySelectorAll('a').forEach(a => {
        const link = a.cloneNode(true);
        link.className = 'block py-3 text-lg font-medium text-gray-300 hover:text-accent-red transition';
        link.addEventListener('click', closeMenu);
        menu.appendChild(link);
      });
    }
    document.querySelector('header').appendChild(menu);
  };

  const openMenu = () => {
    createMobileMenu();
    menu.style.opacity = '1';
    menu.style.maxHeight = menu.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = '<i class="fas fa-xmark text-xl"></i>';
    document.body.classList.add('overflow-hidden');
  };

  if (btn && linksWrapper) {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && btn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // --- NEWSLETTER CODE ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email-input').value.trim();

      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      try {
        await addDoc(collection(db, 'artifacts'), {
          type: 'newsletter',
          email,
          timestamp: new Date()
        });
        window.location.href = 'newsletter.html';
      } catch (error) {
        console.error('Error saving email:', error);
        alert('Something went wrong. Please try again.');
      }
    });
  }
});