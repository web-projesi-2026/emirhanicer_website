// assets/js/projects.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projects-page-container');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!projectsContainer) return;

    let allGames = [];

    try {
        // Yükleniyor animasyonu/yazısı
        projectsContainer.innerHTML = '<p style="text-align:center; width:100%; color:var(--accent-primary);">Oyunlar buluttan yükleniyor...</p>';

        // 1. FİREBASE'DEN VERİLERİ CANLI ÇEKME
        const querySnapshot = await getDocs(collection(db, "games"));
        querySnapshot.forEach((doc) => {
            // Gelen her bir veriyi listemize atıyoruz
            allGames.push(doc.data());
        });

        renderGames(allGames); // Çekilen verileri ekrana çiz
    } catch (error) {
        console.error("Veritabanı hatası:", error);
        projectsContainer.innerHTML = '<p style="color:#ef4444; text-align:center; width:100%;">Veriler veritabanından yüklenemedi.</p>';
    }

    // 2. EKRANA KART ÇİZME FONKSİYONU
    function renderGames(gamesToRender) {
        projectsContainer.innerHTML = '';

        if (gamesToRender.length === 0) {
            projectsContainer.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-secondary);">Aradığınız kritere uygun oyun bulunamadı.</p>';
            return;
        }

        gamesToRender.forEach(game => {
            const safeCategory = game.category ? game.category : 'Diğer';
            const safeTitle = game.title ? game.title : 'İsimsiz Oyun';
            const safeDesc = game.desc ? game.desc : 'Açıklama yok.';

            // DİKKAT: Faz 4 için dinamik link hazırlığı! Tıklayınca game-detail.html'e ID'yi taşıyacak.
            const gameLink = `game-detail.html?id=${game.id}`;

            const cardHTML = `
                <div class="card" style="animation: fadeEffect 0.5s;">
                    <div class="card-img-placeholder">
                        <img src="${game.img}" alt="${safeTitle}">
                    </div>
                    <div class="card-content">
                        <span class="tech-tag" style="background-color: var(--accent-primary); color: #fff; margin-bottom: 10px; display: inline-block;">${safeCategory.toUpperCase()}</span>
                        <h3>${safeTitle}</h3>
                        <p>${safeDesc}</p>
                        <a href="${gameLink}" class="btn btn-secondary" style="width: 100%;">Proje Detayları</a>
                    </div>
                </div>
            `;
            projectsContainer.innerHTML += cardHTML;
        });
    }

    // 3. ARAMA VE FİLTRELEME MANTIĞI (Eskisiyle aynı)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            filterAndRender(searchTerm, activeFilter);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const selectedCategory = e.target.getAttribute('data-filter');
            const currentSearchTerm = searchInput.value.toLowerCase();
            filterAndRender(currentSearchTerm, selectedCategory);
        });
    });

    function filterAndRender(searchTerm, category) {
        const filteredGames = allGames.filter(game => {
            const gameTitle = game.title ? game.title.toLowerCase() : '';
            const gameCat = game.category ? game.category.toLowerCase() : '';
            const matchesSearch = gameTitle.includes(searchTerm);
            const matchesCategory = category === 'all' || gameCat === category;
            return matchesSearch && matchesCategory;
        });
        renderGames(filteredGames);
    }
});