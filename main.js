// MindBridge — Main JS

// ── AUTH HELPERS ──
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('mb_user'));
  } catch { return null; }
}

function getToken() {
  return localStorage.getItem('mb_token');
}

function logout() {
  localStorage.removeItem('mb_token');
  localStorage.removeItem('mb_user');
  window.location.href = isInPagesFolder() ? '../index.html' : 'index.html';
}

function isInPagesFolder() {
  return window.location.pathname.includes('/pages/');
}

// ── UPDATE NAVBAR BASED ON AUTH STATE ──
function updateNavAuth() {
  const user = getUser();
  const token = getToken();

  // Find the login/register buttons container
  // Works for both index.html and pages/*.html
  const loginBtn = document.querySelector('a[href*="login.html"]');
  const registerBtn = document.querySelector('a[href*="register.html"]');

  if (user && token) {
    // User is logged in — replace login/register with profile info
    const firstName = user.firstName || 'User';
    const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');

    if (loginBtn && registerBtn) {
      // Hide login & register buttons
      loginBtn.parentElement.style.display = 'none';
      registerBtn.parentElement.style.display = 'none';

      // Insert user avatar + dropdown after the last nav item
      const navList = loginBtn.closest('ul');
      if (navList) {
        const li = document.createElement('li');
        li.className = 'nav-item ms-2 position-relative';
        li.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-brand dropdown-toggle d-flex align-items-center gap-2"
              type="button" data-bs-toggle="dropdown" aria-expanded="false"
              style="border-radius:50px;padding:6px 16px 6px 6px;">
              <span style="
                width:30px;height:30px;border-radius:50%;
                background:linear-gradient(135deg,#fff3,#ffffff55);
                display:inline-flex;align-items:center;justify-content:center;
                font-weight:700;font-size:.8rem;letter-spacing:.5px;">
                ${initials.toUpperCase()}
              </span>
              <span>${firstName}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
              style="border-radius:14px;min-width:180px;padding:8px;">
              <li>
                <span class="dropdown-item-text text-muted" style="font-size:.8rem;padding:4px 16px;">
                  ${user.email || ''}
                </span>
              </li>
              <li><hr class="dropdown-divider my-1"/></li>
              <li><a class="dropdown-item rounded-2" href="${isInPagesFolder() ? '../' : ''}pages/mood-tracker.html">
                <i class="bi bi-graph-up-arrow me-2 text-primary"></i>Mood Tracker
              </a></li>
              <li><a class="dropdown-item rounded-2" href="${isInPagesFolder() ? '../' : ''}pages/chat.html">
                <i class="bi bi-chat-heart me-2 text-danger"></i>Chat with Aria
              </a></li>
              <li><hr class="dropdown-divider my-1"/></li>
              <li><button class="dropdown-item rounded-2 text-danger" onclick="logout()">
                <i class="bi bi-box-arrow-right me-2"></i>Log Out
              </button></li>
            </ul>
          </div>
        `;
        navList.appendChild(li);
      }
    }
  }
  // If not logged in, navbar stays as-is (login/register buttons visible)
}

// ── NAVBAR SCROLL EFFECT ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ── MOOD CHECK-IN RESPONSES ──
const moodResponses = {
  awful: {
    text: "I'm really sorry you're feeling this way. 💙 You're not alone in this. Would you like to talk with Aria right now, or try a quick breathing exercise to help ground you?",
    actions: [
      { label: "Talk to Aria", href: "pages/chat.html" },
      { label: "Breathing Exercise", href: "pages/resources.html" }
    ],
    color: "#e11d48"
  },
  sad: {
    text: "It's okay to feel sad. Acknowledging it is the first step. 🌧️ Aria is here to listen, or you can explore some calming exercises to lift your spirits a bit.",
    actions: [
      { label: "Chat with Aria", href: "pages/chat.html" },
      { label: "Mood Tracker", href: "pages/mood-tracker.html" }
    ],
    color: "#7c3aed"
  },
  okay: {
    text: "Being okay is perfectly valid! 🌤️ Want to do a quick check-in to understand yourself a bit better, or explore some mindfulness tips to boost your day?",
    actions: [
      { label: "Journal Today", href: "pages/resources.html" },
      { label: "Track Mood", href: "pages/mood-tracker.html" }
    ],
    color: "#d97706"
  },
  good: {
    text: "That's wonderful! 🌟 Feeling good is something to celebrate. Log this in your mood tracker to spot what's working for you!",
    actions: [
      { label: "Log This Mood", href: "pages/mood-tracker.html" },
      { label: "Community", href: "pages/community.html" }
    ],
    color: "#16a34a"
  },
  great: {
    text: "Amazing — you're thriving! 🎉 This is the energy. Log this moment, and consider sharing your positivity in the community!",
    actions: [
      { label: "Track Progress", href: "pages/mood-tracker.html" },
      { label: "Share With Community", href: "pages/community.html" }
    ],
    color: "#0d9488"
  }
};

function selectMood(el) {
  document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const mood = el.dataset.mood;
  const resp = moodResponses[mood];
  const box = document.getElementById('moodResponse');
  if (box && resp) {
    const actions = resp.actions.map(a =>
      `<a href="${a.href}" class="btn btn-brand btn-sm me-2 mt-2">${a.label}</a>`
    ).join('');
    box.innerHTML = `<p class="mb-2" style="color:var(--dark)">${resp.text}</p>${actions}`;
    box.style.borderLeftColor = resp.color;
    box.style.display = 'block';
  }
}

// ── ANIMATE ON SCROLL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// ── INIT ON DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  // Update navbar auth state
  updateNavAuth();

  // Animate cards on scroll
  document.querySelectorAll('.feature-card, .counselor-card, .testimonial-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});

// // MindBridge — Main JS

// // Navbar scroll effect
// window.addEventListener('scroll', () => {
//   const nav = document.getElementById('mainNav');
//   if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
// });

// // Mood check-in responses
// const moodResponses = {
//   awful: {
//     text: "I'm really sorry you're feeling this way. 💙 You're not alone in this. Would you like to talk with Aria right now, or try a quick breathing exercise to help ground you?",
//     actions: [
//       { label: "Talk to Aria", href: "pages/chat.html" },
//       { label: "Breathing Exercise", href: "pages/resources.html" }
//     ],
//     color: "#e11d48"
//   },
//   sad: {
//     text: "It's okay to feel sad. Acknowledging it is the first step. 🌧️ Aria is here to listen, or you can explore some calming exercises to lift your spirits a bit.",
//     actions: [
//       { label: "Chat with Aria", href: "pages/chat.html" },
//       { label: "Mood Tracker", href: "pages/mood-tracker.html" }
//     ],
//     color: "#7c3aed"
//   },
//   okay: {
//     text: "Being okay is perfectly valid! 🌤️ Want to do a quick check-in to understand yourself a bit better, or explore some mindfulness tips to boost your day?",
//     actions: [
//       { label: "Journal Today", href: "pages/resources.html" },
//       { label: "Track Mood", href: "pages/mood-tracker.html" }
//     ],
//     color: "#d97706"
//   },
//   good: {
//     text: "That's wonderful! 🌟 Feeling good is something to celebrate. Log this in your mood tracker to spot what's working for you!",
//     actions: [
//       { label: "Log This Mood", href: "pages/mood-tracker.html" },
//       { label: "Community", href: "pages/community.html" }
//     ],
//     color: "#16a34a"
//   },
//   great: {
//     text: "Amazing — you're thriving! 🎉 This is the energy. Log this moment, and consider sharing your positivity in the community!",
//     actions: [
//       { label: "Track Progress", href: "pages/mood-tracker.html" },
//       { label: "Share With Community", href: "pages/community.html" }
//     ],
//     color: "#0d9488"
//   }
// };

// function selectMood(el) {
//   document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
//   el.classList.add('selected');
//   const mood = el.dataset.mood;
//   const resp = moodResponses[mood];
//   const box = document.getElementById('moodResponse');
//   if (box && resp) {
//     const actions = resp.actions.map(a =>
//       `<a href="${a.href}" class="btn btn-brand btn-sm me-2 mt-2">${a.label}</a>`
//     ).join('');
//     box.innerHTML = `<p class="mb-2" style="color:var(--dark)">${resp.text}</p>${actions}`;
//     box.style.borderLeftColor = resp.color;
//     box.style.display = 'block';
//   }
// }

// // Animate elements on scroll
// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(e => {
//     if (e.isIntersecting) {
//       e.target.style.opacity = '1';
//       e.target.style.transform = 'translateY(0)';
//     }
//   });
// }, { threshold: 0.1 });

// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.feature-card, .counselor-card, .testimonial-card, .step-card').forEach(el => {
//     el.style.opacity = '0';
//     el.style.transform = 'translateY(24px)';
//     el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//     observer.observe(el);
//   });
// });
