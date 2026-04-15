// MindBridge — Main JS

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
});

// Mood check-in responses
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

// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.feature-card, .counselor-card, .testimonial-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
