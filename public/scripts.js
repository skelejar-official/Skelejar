/* eslint-env browser */
/* eslint-disable */

// Firebase SDK Imports (from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// eslint-disable-next-line no-unused-vars
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase Configuration
import { firebaseConfig } from "./firebaseConfig.js";

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
// --- ARTICLE CARD SELECTION ---
const articleCards = document.querySelectorAll('.article-card');
function animateCardsStaggered() {
    articleCards.forEach((card, index) => {
        card.classList.remove("stagger-in"); // reset animation
        if (!card.classList.contains("hidden")) {
            setTimeout(() => {
                card.classList.add("stagger-in");
            }, index * 120); // 120ms stagger delay
        }
    });
}
// --- SEARCH INPUT SELECTION ---
const searchInput = document.getElementById('search-input');

// --- FILTER BUTTONS ---
const filterButtons = document.querySelectorAll(".filter-btn");

// ✅ Function to show/hide "No results" message
function updateNoResultsMessage() {
    const noResults = document.getElementById("no-results");
    if (!noResults) return; // safety check

    // Check if any article card is visible
    const anyVisible = Array.from(articleCards).some(card => !card.classList.contains("hidden"));

    // Also check if the user has typed something in the search bar
    const query = searchInput ? searchInput.value.trim() : "";

    // ✅ If there is no search text AND at least one card is visible,
    // hide the "No results" message (this covers page load)
    if (query === "" && anyVisible) {
        noResults.classList.remove("show");
        return;
    }

    // ✅ If there *is* search text:
    // show the message only when no cards are visible
    if (query !== "" && !anyVisible) {
        noResults.classList.add("show");
    } else {
        noResults.classList.remove("show");
    }
}
// ✅ SEARCH BAR FILTERING
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        articleCards.forEach(card => {
            const text = card.innerText.toLowerCase();

            if (text.includes(query)) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });

        updateNoResultsMessage();
    });
}

// ✅ CATEGORY BUTTON FILTERING
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter.toLowerCase();

        articleCards.forEach(card => {
            const text = card.innerText.toLowerCase();

            if (filter === "all" || text.includes(filter)) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });

        // ✅ Update active button styling
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        updateNoResultsMessage();
    });
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