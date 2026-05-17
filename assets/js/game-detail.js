// assets/js/game-detail.js
import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. URL'deki ID'yi yakalama (Örn: game-detail.html?id=game_roadrage)
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('id');

    // HTML Kutularını bul
    const loadingMessage = document.getElementById('loading-message');
    const gameContent = document.getElementById('game-content');

    // Eğer linkte ID yoksa, doğrudan projeler sayfasına yönlendir
    if (!targetId) {
        window.location.href = "project.html";
        return;
    }

    try {
        // 2. Veritabanında sadece bu ID'ye sahip oyunu ara
        const q = query(collection(db, "games"), where("id", "==", targetId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            loadingMessage.innerHTML = "<h2 style='color:#ef4444;'>Oyun bulunamadı!</h2>";
            return;
        }

        // Oyunu bulduk, verilerini alalım (Aynı ID'den 1 tane olacağı için ilkini alıyoruz)
        const gameData = querySnapshot.docs[0].data();

        // 3. Kalıbı verilerle doldur
        document.getElementById('detail-img').src = gameData.img || "../assets/images/default.png";
        document.getElementById('detail-title').innerText = gameData.title || "İsimsiz Oyun";
        document.getElementById('detail-category').innerText = (gameData.category || "Diğer").toUpperCase();
        document.getElementById('detail-desc').innerText = gameData.desc || "Bu oyun için bir açıklama bulunmuyor.";

        document.title = (gameData.title || "Oyun Detayı") + " - MexGames";
        const itchBtn = document.getElementById('detail-itch-link');
        if (gameData.link) {
            itchBtn.href = gameData.link;
            itchBtn.style.display = 'inline-block';
        } else {
            itchBtn.style.display = 'none'; // Link yoksa butonu saklamaya devam et
        }
        // Yükleniyor yazısını gizle, asıl içeriği göster
        loadingMessage.style.display = 'none';
        gameContent.style.display = 'block';

    } catch (error) {
        console.error("Detay çekerken hata:", error);
        loadingMessage.innerHTML = "<h2 style='color:#ef4444;'>Veritabanı bağlantı hatası!</h2>";
    }
});