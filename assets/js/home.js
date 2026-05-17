// assets/js/home.js
import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const featuredContainer = document.getElementById('featured-projects-container');
    if (!featuredContainer) return;

    // Tarayıcı hafızasından kullanıcının favorilerini al (Yoksa boş dizi oluştur)
    let favorites = JSON.parse(localStorage.getItem('mexgames_favorites')) || [];

    try {
        featuredContainer.innerHTML = '<p style="text-align:center; width:100%; color:var(--accent-primary);">Vitrin yükleniyor...</p>';

        // SADECE ÖNE ÇIKANLARI (isFeatured == true) GETİR
        const q = query(collection(db, "games"), where("isFeatured", "==", true));
        const snapshot = await getDocs(q);

        featuredContainer.innerHTML = '';

        if (snapshot.empty) {
            featuredContainer.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-secondary);">Şu an öne çıkan proje bulunmuyor.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const game = doc.data();
            // Bu oyun kullanıcının favorilerinde var mı kontrol et
            const isFav = favorites.includes(game.id);
            // Kalp ikonunun rengi (Favoriyse kırmızı, değilse gri)
            const heartColor = isFav ? '#ef4444' : '#6b7280';

            const cardHTML = `
                <div class="card" style="animation: fadeEffect 0.5s; position: relative;">
                    <button class="fav-btn" data-id="${game.id}" style="position: absolute; top: 15px; right: 15px; background: var(--card-bg); border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="${heartColor}" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"/>
                        </svg>
                    </button>

                    <div class="card-img-placeholder">
                        <img src="${game.img}" alt="${game.title}">
                    </div>
                    <div class="card-content">
                        <span class="tech-tag" style="background-color: var(--accent-primary); color: #fff; margin-bottom: 10px; display: inline-block;">${(game.category || 'Diğer').toUpperCase()}</span>
                        <h3>${game.title}</h3>
                        <p>${game.desc}</p>
                        <a href="pages/game-detail.html?id=${game.id}" class="btn btn-secondary" style="width: 100%;">Proje Detayları</a>
                    </div>
                </div>
            `;
            featuredContainer.innerHTML += cardHTML;
        });

        // FAVORİ BUTONLARINI DİNLE
        const favButtons = document.querySelectorAll('.fav-btn');
        favButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const gameId = button.getAttribute('data-id');
                const svgPath = button.querySelector('path');

                // Eğer favorilerde varsa çıkar, yoksa ekle
                if (favorites.includes(gameId)) {
                    favorites = favorites.filter(id => id !== gameId); // Diziden sil
                    svgPath.setAttribute('fill', '#6b7280'); // Kalbi gri yap
                } else {
                    favorites.push(gameId); // Diziye ekle
                    svgPath.setAttribute('fill', '#ef4444'); // Kalbi kırmızı yap

                    // Küçük bir kalp atışı animasyonu
                    button.style.transform = 'scale(1.2)';
                    setTimeout(() => button.style.transform = 'scale(1)', 200);
                }

                // Yeni favori listesini tarayıcının hafızasına kaydet
                localStorage.setItem('mexgames_favorites', JSON.stringify(favorites));
            });
        });

    } catch (error) {
        console.error("Vitrin hatası:", error);
        featuredContainer.innerHTML = '<p style="color:#ef4444; text-align:center; width:100%;">Projeler yüklenirken hata oluştu.</p>';
    }
});