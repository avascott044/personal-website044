// Smooth scroll for nav links
document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// Fade-in effect on scroll
const faders = document.querySelectorAll(".service-card, .portfolio-item, .testimonial-card, .about-description p, .skill-item");

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
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

// Portfolio Filtering
(function(){
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (!filterButtons.length || !portfolioItems.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.6s ease-out';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();

// Floating Elements Animation
(function(){
  const floatingElements = document.querySelectorAll('.floating-element');
  
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 1.5}s`;
  });
})();

// Contact form handling (including purchase requests)
(function(){
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = document.getElementById('contactSubmit');
  const btnText = submitBtn.querySelector('span');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // use action attribute if provided (allows user to supply Formspree ID)
  const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mvgqeoek';
  
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    fetch(endpoint, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
      .then(response => {
        if (response.ok) {
          showNotification('Message sent successfully! I will reply soon.', 'success');
          contactForm.reset();
        } else {
          showNotification('There was a problem sending your message. Please try again.', 'error');
        }
      })
      .catch(() => {
        showNotification('Network error. Please check your connection and try again.', 'error');
      })
      .finally(() => {
        // Hide loading state
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
      });
  });

  // Toggle productName input visibility when checkbox changed
  const purchaseCheckbox = document.getElementById('requestPurchase');
  const productNameGroup = document.getElementById('productNameGroup');
  
  if (purchaseCheckbox && productNameGroup) {
    purchaseCheckbox.addEventListener('change', () => {
      if (purchaseCheckbox.checked) {
        productNameGroup.style.display = 'block';
        productNameGroup.querySelector('input').required = true;
      } else {
        productNameGroup.style.display = 'none';
        productNameGroup.querySelector('input').required = false;
      }
    });
  }

  // Notification function
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
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

  // Removed old assistant functionality - using new AI assistant below

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

// Navigation Scroll Effect
(function(){
  const nav = document.querySelector('.modern-nav');
  const navItems = document.querySelectorAll('.nav-item');
  
  if (!nav) return;
  
  function handleScroll() {
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  
  // Active section indicator
  function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', () => {
    handleScroll();
    updateActiveSection();
  });
  
  handleScroll(); // Initial check
  updateActiveSection(); // Initial check
})();

// Mobile Navigation Toggle
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!navToggle || !navMenu) return;
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
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

// Count Animation for Stats
(function(){
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  const animateCount = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + (target === 99 ? '%' : '+');
    }, 16);
  };
  
  // Intersection Observer for count animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
})();

// Skill Progress Animation
(function(){
  function initSkillProgress() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    console.log('Found skill cards:', skillCards.length);
    
    // Function to animate percentage numbers
    const animatePercentage = (element, target) => {
      console.log('Animating percentage from 0 to', target);
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      // Ensure element exists and reset to 0
      if (element) {
        element.textContent = '0%';
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
            console.log('Percentage animation complete:', target + '%');
          }
          element.textContent = Math.floor(current) + '%';
        }, 16);
      } else {
        console.log('Element not found for percentage animation');
      }
    };
    
    const animateSkillCard = (card) => {
      if (card.classList.contains('animated')) return;
      
      card.classList.add('animated');
      
      const skillBar = card.querySelector('.skill-progress');
      const percentageEl = card.querySelector('.skill-percentage');
      const width = skillBar ? skillBar.getAttribute('data-width') : null;
      
      console.log('Animating skill card:', card, 'Width:', width, 'Percentage element:', percentageEl);
      
      if (skillBar && width) {
        // Animate progress bar
        skillBar.style.width = '0%';
        setTimeout(() => {
          skillBar.style.width = width + '%';
        }, 100);
        
        // Animate percentage
        if (percentageEl) {
          setTimeout(() => {
            animatePercentage(percentageEl, parseInt(width));
          }, 200);
        }
      }
    };
    
    // Intersection Observer for skill cards
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Skill card is intersecting, animating...');
          animateSkillCard(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    skillCards.forEach((card, index) => {
      console.log(`Observing skill card ${index}:`, card);
      observer.observe(card);
    });
  }
  
  // Initialize immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillProgress);
  } else {
    initSkillProgress();
  }
})();


// AI Assistant Knowledge Base
const websiteKnowledge = {
  about: {
    name: "Asare Fredinald",
    title: "CEO and owner of AVASCOTT Group of Companies and AvaScottInc",
    education: "KNUST Student",
    location: "Ghana, West Africa",
    experience: "4+ years",
    projects: "14+ completed",
    satisfaction: "99% client satisfaction",
    companies: ["AVASCOTT Group of Companies", "AvaScottInc"],
    description: "Passionate developer creating digital solutions that matter. Leads a team that creates innovative digital solutions across multiple industries with expertise in React, React Native, JavaScript, Prompt Engineering, and modern web technologies."
  },
  services: [
    "Web Development",
    "Mobile App Development", 
    "UI/UX Design",
    "Full-Stack Solutions",
    "Digital Transformation",
    "Consulting"
  ],
  technologies: [
    "React (95%)",
    "React Native (90%)", 
    "JavaScript (95%)",
    "Python (85%)",
    "UI/UX Design (88%)",
    "Node.js (82%)"
  ],
  projects: [
    {
      name: "Hostel Manager",
      description: "Complete hostel management system with room allocation, fee tracking, and admin dashboard",
      tech: ["React", "Node.js", "MongoDB"],
      category: "Full Stack"
    },
    {
      name: "Church Manager", 
      description: "Comprehensive church management solution for member tracking, events, and finances",
      tech: ["React", "Firebase", "CSS3"],
      category: "Full Stack"
    },
    {
      name: "Artisan Connect",
      description: "Marketplace platform connecting artisans with clients for seamless service delivery",
      tech: ["React", "Express", "PostgreSQL"],
      category: "Web Development"
    }
  ],
  contact: {
    email: "fredinaldasare@gmail.com",
    phone: "+233 555 247 890",
    location: "Ghana, West Africa"
  }
};

// Enhanced AI Assistant
(function(){
  const assistantBtn = document.querySelector('.assistant');
  const assistantModal = document.querySelector('.assistant-modal');
  const assistantClose = document.querySelector('.assistant-close');
  const assistantContent = document.querySelector('.assistant-modal-content');
  
  if (!assistantBtn || !assistantModal) return;
  
  // Create AI response function
  function getAIResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // About questions
    if (lowerQuestion.includes('who are you') || lowerQuestion.includes('about')) {
      return `I'm ${websiteKnowledge.about.name}, ${websiteKnowledge.about.title}. I'm a ${websiteKnowledge.about.education} with ${websiteKnowledge.about.experience} of experience in creating innovative digital solutions. I lead a team that helps businesses transform their ideas into powerful digital experiences.`;
    }
    
    // Services questions
    if (lowerQuestion.includes('services') || lowerQuestion.includes('what do you do')) {
      return `We offer comprehensive digital solutions including: ${websiteKnowledge.services.join(', ')}. Our expertise spans from web and mobile development to UI/UX design and digital transformation.`;
    }
    
    // Technologies questions
    if (lowerQuestion.includes('technologies') || lowerQuestion.includes('skills') || lowerQuestion.includes('tech')) {
      return `Our core technologies include: ${websiteKnowledge.technologies.join(', ')}. We specialize in modern web technologies and mobile development frameworks.`;
    }
    
    // Projects questions
    if (lowerQuestion.includes('projects') || lowerQuestion.includes('portfolio') || lowerQuestion.includes('work')) {
      return `We've completed ${websiteKnowledge.about.projects} including: ${websiteKnowledge.projects.map(p => p.name).join(', ')}. Each project showcases our expertise in modern web technologies and user-centered design.`;
    }
    
    // Contact questions
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('reach') || lowerQuestion.includes('email')) {
      return `You can reach us at ${websiteKnowledge.contact.email} or call ${websiteKnowledge.contact.phone}. We're based in ${websiteKnowledge.contact.location} and always happy to discuss new projects!`;
    }
    
    // Company questions
    if (lowerQuestion.includes('company') || lowerQuestion.includes('avascott') || lowerQuestion.includes('avascottinc')) {
      return `I own two companies: ${websiteKnowledge.about.companies.join(' and ')}. AVASCOTT Group provides technology solutions across multiple industries, while AvaScottInc focuses on innovative software development and digital transformation services.`;
    }
    
    // Default response
    return `I can help you learn about our services, technologies, projects, or contact information. Please ask me about what we do, our skills, our work, or how to get in touch!`;
  }
  
  // Toggle modal
  assistantBtn.addEventListener('click', () => {
    const isHidden = assistantModal.getAttribute('aria-hidden') === 'true';
    assistantModal.setAttribute('aria-hidden', !isHidden);
    
    if (!isHidden) {
      assistantContent.innerHTML = `
        <h3>AI Assistant</h3>
        <p>Hi! I'm your AI assistant. Ask me anything about our services, projects, or company!</p>
        <div class="assistant-actions">
          <button class="btn primary" onclick="askAI('What services do you offer?')">Our Services</button>
          <button class="btn secondary" onclick="askAI('Tell me about your projects')">Our Projects</button>
          <button class="btn secondary" onclick="askAI('What technologies do you use?')">Technologies</button>
          <button class="btn secondary" onclick="askAI('How can I contact you?')">Contact Info</button>
        </div>
        <div id="ai-response" style="margin-top: 1rem; padding: 1rem; background: var(--navy-surface); border-radius: 8px; display: none;"></div>
      `;
    }
  });
  
  // Close modal
  assistantClose.addEventListener('click', () => {
    assistantModal.setAttribute('aria-hidden', 'true');
  });
  
  // Global function for AI responses
  window.askAI = function(question) {
    const responseDiv = document.getElementById('ai-response');
    if (responseDiv) {
      responseDiv.style.display = 'block';
      responseDiv.innerHTML = '<p>Thinking...</p>';
      
      setTimeout(() => {
        responseDiv.innerHTML = `<p>${getAIResponse(question)}</p>`;
      }, 1000);
    }
  };
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


