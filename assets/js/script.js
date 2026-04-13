
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

// Image Slider (Resim Kaydırıcı) Mantığı
document.addEventListener('DOMContentLoaded', () => {
  // Sitedeki tüm slider'ları bul (birden fazla sayfa için uyumlu)
  const sliders = document.querySelectorAll('.slider-container');

  sliders.forEach(slider => {
    let currentSlide = 0; // Hangi resimde olduğumuzu tutan değişken
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');

    // Eğer slider içinde resim varsa işlemleri yap
    if (slides.length > 0) {

      // Slayt değiştirme fonksiyonu
      const changeSlide = (direction) => {
        // Önce şu anki resmi gizle
        slides[currentSlide].classList.remove('active');

        // Yeni resmin indeksini hesapla (Sona gelince başa dönmesi için matematiksel bir hile)
        currentSlide = (currentSlide + direction + slides.length) % slides.length;

        // Yeni resmi göster
        slides[currentSlide].classList.add('active');
      };

      // Butonlara tıklanma olaylarını dinle
      if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btnDefault = document.getElementById('set-default');
  const btnSpace = document.getElementById('set-space');

  // 1. Sayfa yüklendiğinde hafızadaki temayı kontrol et
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme === 'space') {
    body.classList.add('theme-space');
  }

  // 2. Varsayılan Temaya Geçiş
  if (btnDefault) {
    btnDefault.addEventListener('click', () => {
      body.classList.remove('theme-space');
      localStorage.setItem('selectedTheme', 'default');
    });
  }

  // 3. Uzay Temasına Geçiş
  if (btnSpace) {
    btnSpace.addEventListener('click', () => {
      body.classList.add('theme-space');
      localStorage.setItem('selectedTheme', 'space');
    });
  }
});
