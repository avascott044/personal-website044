// Add smooth scroll for nav links
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    if (link.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      document.querySelector(link.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Fade-in effect on scroll
const faders = document.querySelectorAll(".project-card, .about p");

const appearOptions = {
  threshold: 0.2,
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("fade-in");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});


// Animate skill bars when section scrolls into view
function initSkillBars() {
  const progressBars = document.querySelectorAll(".progress-bar span");
  const skillsSection = document.querySelector("#skills");
  if (!skillsSection) return;

  function animateBars() {
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;
    if (sectionPos < screenPos) {
      progressBars.forEach(bar => {
        const match = bar.getAttribute("style")?.match(/width:\s*([0-9]+%)/);
        if (match) bar.style.width = match[1];
      });
      window.removeEventListener("scroll", animateBars);
    }
  }

  window.addEventListener("scroll", animateBars);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSkillBars);
else initSkillBars();

// Unified hero slider controller: auto-start and nav handling
(function(){
  const slidesContainer = document.querySelector('.hero .hero-slider .slides');
  if (!slidesContainer) return;

  const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
  const total = slides.length;
  let index = 0;
  let interval = null;
  const delay = 4000;

  slidesContainer.style.width = `calc(100% * ${total})`;

  function goTo(i){ 
    index = (i + total) % total; 
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  // wire nav buttons
  const prevBtn = document.querySelector('.slider-nav .prev');
  const nextBtn = document.querySelector('.slider-nav .next');
  prevBtn?.addEventListener('click', e => { e.preventDefault(); prev(); restart(); });
  nextBtn?.addEventListener('click', e => { e.preventDefault(); next(); restart(); });

  function start(){ stop(); interval = setInterval(next, delay); }
  function stop(){ if (interval) clearInterval(interval); }
  function restart(){ stop(); start(); }

  // pause on hover
  const parent = slidesContainer.closest('.hero');
  parent?.addEventListener('mouseenter', stop);
  parent?.addEventListener('mouseleave', start);

  // ensure initial size for 16:9 1920x1080 fit
  document.addEventListener('DOMContentLoaded', () => { goTo(0); start(); });
})();

// Contact form handling (including purchase requests)
(function(){
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // use action attribute if provided (allows user to supply Formspree ID)
  const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mnnjvqqr';
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(contactForm);
    fetch(endpoint, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
      .then(response => {
        if (response.ok) alert('Message sent. I will reply soon.');
        else alert('There was a problem sending your message.');
      })
      .catch(() => alert('Network error. Please try again.'));
  });

  // Toggle productName input visibility when checkbox changed
  const purchaseCheckbox = document.getElementById('requestPurchase');
  const productNameInput = document.getElementById('productName');
  if (purchaseCheckbox && productNameInput) {
    purchaseCheckbox.addEventListener('change', () => {
      if (purchaseCheckbox.checked) {
        contactForm.classList.add('purchase');
        productNameInput.style.display = 'block';
        productNameInput.required = true;
      } else {
        contactForm.classList.remove('purchase');
        productNameInput.style.display = 'none';
        productNameInput.required = false;
      }
    });
  }
})();

// Assistant button behavior
(function(){
  const assistantBtn = document.getElementById('assistantBtn');
  const assistantModal = document.getElementById('assistantModal');
  const assistantClose = document.getElementById('assistantClose');
  const openPurchase = document.getElementById('openPurchase');
  const openContact = document.getElementById('openContact');

  if (!assistantBtn || !assistantModal) return;

  assistantBtn.addEventListener('click', () => {
    assistantModal.setAttribute('aria-hidden', assistantModal.getAttribute('aria-hidden') === 'false' ? 'true' : 'false');
  });

  assistantClose?.addEventListener('click', () => assistantModal.setAttribute('aria-hidden', 'true'));

  openPurchase?.addEventListener('click', () => {
    assistantModal.setAttribute('aria-hidden','true');
    document.getElementById('requestPurchase').checked = true;
    document.getElementById('productName').style.display = 'block';
    document.getElementById('productName').focus();
    window.scrollTo({top: document.querySelector('#contact').offsetTop - 40, behavior:'smooth'});
  });

  openContact?.addEventListener('click', () => {
    assistantModal.setAttribute('aria-hidden','true');
    document.getElementById('requestPurchase').checked = false;
    document.getElementById('productName').style.display = 'none';
    window.scrollTo({top: document.querySelector('#contact').offsetTop - 40, behavior:'smooth'});
  });
})();

// Animate section titles when visible
(function(){
  const titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate-in');
    });
  }, { threshold: 0.2 });
  titles.forEach(t => obs.observe(t));
})();

// When skills section enters view, set CSS variables to animate fills
(function(){
  const skillsSection = document.querySelector('.skills-section');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillsSection.classList.add('in-view');
        // set --fill for each progress bar based on inline width
        document.querySelectorAll('.skills-section .progress-bar span').forEach(span => {
          const match = span.getAttribute('style')?.match(/width:\s*([0-9]+%)/);
          if (match) span.style.setProperty('--fill', match[1]);
        });
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillsSection);
})();

// Show image-box names as placeholders (if empty) and make them clickable
(function(){
  document.querySelectorAll('.image-box').forEach(box => {
    const name = box.getAttribute('data-name') || '';
    if (name) box.textContent = name;
    box.addEventListener('click', () => {
      // placeholder click - later can open modal or link
      alert(name + ' — more details coming soon.');
    });
  });
})();

// Animate skill numbers and progress fills when skills section becomes visible
(function(){
  const skillsSection = document.querySelector('.skills-section');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillsSection.classList.add('in-view');

        document.querySelectorAll('.skill-card').forEach(card => {
          if (card.classList.contains('animate')) return;
          card.classList.add('animate');
          const target = parseInt(card.getAttribute('data-percent') || '0', 10);
          const percentEl = card.querySelector('.skill-percent');
          const bar = card.querySelector('.progress-bar span');

          // animate number
          let current = 0;
          const step = Math.max(1, Math.floor(target / 20));
          const timer = setInterval(() => {
            current = Math.min(target, current + step);
            percentEl.textContent = current + '%';
            if (current >= target) clearInterval(timer);
          }, 40);

          // fill bar
          setTimeout(() => { bar.style.width = target + '%'; }, 80);
        });
      }
    });
  }, { threshold: 0.25 });

  observer.observe(skillsSection);
})();

// Initialize skill percents and bars to data-percent so they correspond
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-card').forEach(card => {
    const target = parseInt(card.getAttribute('data-percent') || '0', 10);
    const percentEl = card.querySelector('.skill-percent');
    const bar = card.querySelector('.progress-bar span');
    if (!percentEl || !bar) return;
    // Set visible percent and bar fill to match data-percent
    percentEl.textContent = target + '%';
    bar.style.width = target + '%';
    // mark as already set so the observer doesn't re-run counting animation
    card.classList.add('animate');
  });
});

// Ensure portfolio image-box backgrounds don't repeat
document.querySelectorAll('.image-box').forEach(b => {
  b.style.backgroundRepeat = 'no-repeat';
});
