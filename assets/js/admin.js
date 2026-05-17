import { app } from "./firebase-config.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginError = document.getElementById("loginError");
const addMessage = document.getElementById("addMessage");
const adminGamesList = document.getElementById("adminGamesList");

// Form Elemanları
const idInput = document.getElementById("gameId");
const titleInput = document.getElementById("gameTitle");
const catInput = document.getElementById("gameCategory");
const descInput = document.getElementById("gameDesc");
const imgInput = document.getElementById("gameImg");
const linkInput = document.getElementById("gameLink"); // YENİ: Link kutusu
const featuredInput = document.getElementById("gameFeatured");
const submitGameBtn = document.getElementById("submitGameBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const editingDocId = document.getElementById("editingDocId");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        loadAdminGames();
    } else {
        loginSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
    }
});

document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("adminEmail").value;
    const pass = document.getElementById("adminPassword").value;
    signInWithEmailAndPassword(auth, email, pass)
        .then(() => loginError.innerText = "")
        .catch(() => loginError.innerText = "Hatalı e-posta veya şifre!");
});
document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));

async function loadAdminGames() {
    adminGamesList.innerHTML = '<p style="text-align:center; color:var(--accent-primary);">Oyunlar yükleniyor...</p>';
    try {
        const snapshot = await getDocs(collection(db, "games"));
        adminGamesList.innerHTML = "";

        if (snapshot.empty) {
            adminGamesList.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">Henüz oyun eklenmemiş.</p>';
            return;
        }

        snapshot.forEach(d => {
            const game = d.data();
            const firestoreDocId = d.id;

            // YENİ: data-link="${game.link || ''}" eklendi
            adminGamesList.innerHTML += `
               <div style="background: var(--card-bg-2); padding: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                   <strong style="color: var(--text-primary);">${game.title}</strong>
                   <div style="display: flex; gap: 10px;">
                       <button class="btn btn-secondary edit-btn" style="padding: 5px 15px;" 
                        data-docid="${firestoreDocId}" data-id="${game.id}" data-title="${game.title}" data-cat="${game.category}" data-desc="${game.desc}" data-img="${game.img}" data-featured="${game.isFeatured}" data-link="${game.link || ''}">Düzenle</button>
                       <button class="btn delete-btn" style="background: #ef4444; color: white; padding: 5px 15px;" data-docid="${firestoreDocId}">Sil</button>
                   </div>
               </div>
            `;
        });
    } catch (error) {
        adminGamesList.innerHTML = '<p style="color:#ef4444;">Oyunlar listelenemedi!</p>';
    }
}

adminGamesList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const docId = e.target.getAttribute("data-docid");
        if (confirm("Bu oyunu kalıcı olarak silmek istediğinize emin misiniz?")) {
            try {
                e.target.innerText = "Siliniyor...";
                await deleteDoc(doc(db, "games", docId));
                loadAdminGames();
            } catch (error) {
                alert("Silme işlemi başarısız oldu!");
            }
        }
    }

    if (e.target.classList.contains("edit-btn")) {
        editingDocId.value = e.target.getAttribute("data-docid");
        idInput.value = e.target.getAttribute("data-id");
        titleInput.value = e.target.getAttribute("data-title");
        catInput.value = e.target.getAttribute("data-cat");
        descInput.value = e.target.getAttribute("data-desc");
        imgInput.value = e.target.getAttribute("data-img");
        linkInput.value = e.target.getAttribute("data-link"); // YENİ: Düzenlerken linki getir
        featuredInput.checked = e.target.getAttribute("data-featured") === "true";

        formTitle.innerText = "Oyunu Düzenle";
        submitGameBtn.innerText = "Değişiklikleri Kaydet";
        cancelEditBtn.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

cancelEditBtn.addEventListener("click", () => resetForm());

function resetForm() {
    editingDocId.value = "";
    idInput.value = "";
    titleInput.value = "";
    descInput.value = "";
    imgInput.value = "../assets/images/thezombieofus.png";
    linkInput.value = ""; // YENİ: Formu temizlerken linki de sil
    featuredInput.checked = false;
    formTitle.innerText = "Yeni Oyun Ekle";
    submitGameBtn.innerText = "Veritabanına Kaydet";
    cancelEditBtn.classList.add("hidden");
    addMessage.innerText = "";
}

submitGameBtn.addEventListener("click", async () => {
    // DİKKAT: linkInput'u bilerek buraya eklemedim çünkü isteğe bağlı (boş bırakılabilir)
    if (!idInput.value || !titleInput.value || !descInput.value || !imgInput.value) {
        addMessage.style.color = "#ef4444";
        addMessage.innerText = "Lütfen zorunlu alanları doldurun!";
        return;
    }

    submitGameBtn.disabled = true;

    try {
        if (editingDocId.value === "") {
            await addDoc(collection(db, "games"), {
                id: idInput.value,
                title: titleInput.value,
                category: catInput.value,
                desc: descInput.value,
                img: imgInput.value,
                link: linkInput.value, // YENİ: Ekleme
                isFeatured: featuredInput.checked
            });
            addMessage.style.color = "#10b981";
            addMessage.innerText = "Oyun başarıyla eklendi!";
        } else {
            const gameRef = doc(db, "games", editingDocId.value);
            await updateDoc(gameRef, {
                id: idInput.value,
                title: titleInput.value,
                category: catInput.value,
                desc: descInput.value,
                img: imgInput.value,
                link: linkInput.value, // YENİ: Güncelleme
                isFeatured: featuredInput.checked
            });
            addMessage.style.color = "#10b981";
            addMessage.innerText = "Değişiklikler başarıyla kaydedildi!";
        }
        resetForm();
        loadAdminGames();
    } catch (error) {
        addMessage.style.color = "#ef4444";
        addMessage.innerText = "Hata oluştu: " + error.message;
    } finally {
        submitGameBtn.disabled = false;
    }
});