
document.addEventListener('DOMContentLoaded', () => {
  // Kartlar için basit bir belirmesi (fade-in) efekti
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * index);
  });

  // Form gönderim simülasyonu
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.innerText;

      btn.innerText = 'Mesaj Gönderildi!';
      btn.style.backgroundColor = 'var(--accent-secondary)';
      btn.style.color = 'var(--bg-nav)';

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3000);
    });
  }
});

// Hamburger Menu Mantığı
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      // "active" class'ını ekleyip çıkararak menüyü ve ikonu tetikliyoruz
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
});