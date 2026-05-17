
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

// --- JSON'dan Veri Çekme ve Favorilere Ekleme (Ödev Görevi) ---
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('dynamic-games-container');

  // Eğer bu sayfada 'dynamic-games-container' yoksa (örneğin about sayfasındaysak) kodu çalıştırma
  if (!container) return;

  // 1. LocalStorage'dan mevcut favorileri al (Yoksa boş dizi oluştur)
  let favorites = JSON.parse(localStorage.getItem('favoriteGames')) || [];

  // 2. Fetch API ile JSON verisini çek
  // NOT: Dosya yolunu games.json'ı nereye koyduysan ona göre ayarla (şu an assets/data/games.json arıyor)
  fetch('assets/data/games.json')
    .then(response => response.json())
    .then(games => {
      // Kutunun içini temizle (Yükleniyor vs yazısı koyduysak gitsin)
      container.innerHTML = '';

      // 3. Her bir oyun için kart HTML'i oluştur (Dinamik Render)
      games.forEach(game => {
        // Bu oyun daha önce favorilere eklenmiş mi kontrol et
        const isFavorited = favorites.includes(game.id);
        const heartClass = isFavorited ? 'fav-btn favorited' : 'fav-btn';
        const heartIcon = isFavorited ? '♥' : '♡'; // Dolu kalp veya boş kalp

        // Kart HTML'ini oluştur
        const cardHTML = `
                    <div class="card" style="opacity: 0; transform: translateY(20px); transition: all 0.4s ease;">
                        <div class="card-header">
                            <div class="card-img-placeholder">
                                <img src="${game.img}" alt="${game.title}">
                            </div>
                            <button class="${heartClass}" data-id="${game.id}" title="Favorilere Ekle/Çıkar">
                                ${heartIcon}
                            </button>
                        </div>
                        <div class="card-content">
                            <h3>${game.title}</h3>
                            <p>${game.desc}</p>
                            <a href="${game.link}" class="btn btn-secondary">Proje Detayları</a>
                        </div>
                    </div>
                `;

        // Kartı sayfaya ekle
        container.innerHTML += cardHTML;
      });

      // Kartlar eklendikten sonra fade-in animasyonunu tetikle
      setTimeout(() => {
        const dynamicCards = container.querySelectorAll('.card');
        dynamicCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100 * index);
        });
      }, 100);

      // 4. Favori butonlarına tıklanma olayını (Event Listener) ekle
      const favButtons = container.querySelectorAll('.fav-btn');
      favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const gameId = e.target.getAttribute('data-id');

          // Eğer id favorilerde varsa çıkar, yoksa ekle (Toggle mantığı)
          if (favorites.includes(gameId)) {
            favorites = favorites.filter(id => id !== gameId); // Çıkar
            e.target.classList.remove('favorited');
            e.target.innerText = '♡';
          } else {
            favorites.push(gameId); // Ekle
            e.target.classList.add('favorited');
            e.target.innerText = '♥';
          }

          // Güncel favori listesini LocalStorage'a geri kaydet
          localStorage.setItem('favoriteGames', JSON.stringify(favorites));
        });
      });
    })
    .catch(error => {
      console.error("Veri çekilirken hata oluştu:", error);
      container.innerHTML = '<p style="color: red;">Oyun verileri yüklenemedi. Lütfen bir yerel sunucu (Live Server) kullandığınızdan emin olun.</p>';
    });
});

// --- GitHub API (Kısa ve Modern Versiyon) ---
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('github-repos-container');
  if (!container) return;

  try {
    // fetch işlemini 'await' ile bekletip kod kalabalığından kurtuluyoruz
    const res = await fetch('https://api.github.com/users/Mextrong/repos?sort=updated&per_page=3');
    if (!res.ok) throw new Error();
    const repos = await res.json();

    // Döngü (forEach) yerine map() kullanarak tüm HTML'i tek seferde çiziyoruz
    container.innerHTML = repos.length === 0 ? '<p>Proje bulunamadı.</p>' : repos.map(repo => `
            <div class="card" style="padding: 25px; display: flex; flex-direction: column; gap: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color: var(--accent-primary); margin: 0; font-size: 1.3rem;">${repo.name}</h3>
                    ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                </div>
                <p style="font-size: 0.95rem; margin: 0;">${repo.description || "Açıklama bulunmuyor."}</p>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--card-bg-2); padding-top: 15px;">
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">⭐ ${repo.stargazers_count} Yıldız</span>
                    <a href="${repo.html_url}" target="_blank" class="btn btn-secondary" style="padding: 5px 15px;">Kodu İncele ↗</a>
                </div>
            </div>
        `).join(''); // Kartları birleştirip tek parça halinde HTML'e yollar

  } catch {
    container.innerHTML = '<p style="color: #ef4444; text-align: center;">GitHub verileri yüklenemedi.</p>';
  }
});