// ==================================================
// FABIYAN BOT — VERSI LENGKAP SATU FILE
// Tema: Hitam & Putih | QR Login | Bisa dijalankan di HP (Termux)
// ==================================================

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// ============== PENGATURAN ==============
const app = express();
const PORT = 3000;
const AUTH_FOLDER = path.join(__dirname, 'auth');
if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER);

let sock = null;
let qrCodeUrl = '';
let connectionStatus = 'menghubungkan';

// ============== DAFTAR MENU LENGKAP ==============
const MENU_TEKS = {
  main: `
╭➤--「MAIN MENU 」
┆ ⇝ .allmenu 🅛
┆ ⇝ .benefitowner 🅛
┆ ⇝ .benefitpremium 🅛
┆ ⇝ .carifitur 🅛
┆ ⇝ .donasi 🅛
┆ ⇝ .leaderboard 🅛
┆ ⇝ .menu 🅛
┆ ⇝ .menucat 🅛
┆ ⇝ .owner 🅛
┆ ⇝ .ping 🅛
┆ ⇝ .ping2 🅛
┆ ⇝ .rules 🅛
┆ ⇝ .stats 🅛
┆ ⇝ .system 🅛
┆ ⇝ .totalfitur 🅛
┆ ⇝ .tqto 🅛
╰➤-------------------------------
  `.trim(),

  kategori: `
╭➤--「DAFTAR KATEGORI 」
┆ ⇝ .menu — Menu Utama
┆ ⇝ .menucat — Daftar Kategori
┆ ⇝ .tools — Tools & Alat
┆ ⇝ .fun — Hiburan & Seru-seruan
┆ ⇝ .game — Game & Kuis
┆ ⇝ .download — Downloader
┆ ⇝ .search — Pencarian
┆ ⇝ .sticker — Stiker
┆ ⇝ .media — Video & Gambar
┆ ⇝ .ai — AI & Gambar
┆ ⇝ .grup — Pengaturan Grup
┆ ⇝ .religi — Islami
┆ ⇝ .info — Info & Berita
┆ ⇝ .cek — Cek Kepribadian
┆ ⇝ .user — Pengguna
┆ ⇝ .canvas — Gambar Teks
┆ ⇝ .random — Acak
┆ ⇝ .anime — Anime
┆ ⇝ .asupan — Video Pendek
┆ ⇝ .clan — Clan/Tim
┆ ⇝ .dev — Developer
┆ ⇝ .ephoto — Efek Teks
┆ ⇝ .berita — Berita Terkini
┆ ⇝ .rpg — RPG Game
╰➤-------------------------------
  `.trim(),

  tools: `
╭➤--「TOOLS MENU 」
┆ ⇝ .q — Tanya Jawab
┆ ⇝ .bitly — Pemendek Link
┆ ⇝ .calc — Kalkulator
┆ ⇝ .biner — Konversi Angka
┆ ⇝ .colorize — HitamPutih→Berwarna
┆ ⇝ .encrypt — Sandi Teks
┆ ⇝ .translate — Terjemahan
┆ ⇝ .tts — Teks ke Suara
┆ ⇝ .qr — Buat QR Code
┆ ⇝ .morse — Sandi Morse
┆ ⇝ .pasword — Generator KataSandi
┆ ⇝ .cuaca — Cuaca Terkini
┆ ⇝ .wiki — Wikipedia
┆ ⇝ .kode — Cari Kode Pos
┆ ⇝ .resi — Cek Resi
┆ ⇝ .ip — Cek Alamat IP
┆ ⇝ .pingweb — Cek Kecepatan Web
╰➤-------------------------------
  `.trim(),

  fun: `
╭➤--「FUN MENU 」
┆ ⇝ .apakah — Tanya Apakah
┆ ⇝ .siapa — Tanya Siapa
┆ ⇝ .jodoh — Cek Kecocokan
┆ ⇝ .quotes — Kutipan Harian
┆ ⇝ .puisi — Buat Puisi
┆ ⇝ .tebakumur — Tebak Umur
┆ ⇝ .gachawaifu — Gacha Waifu
┆ ⇝ .gachahusbu — Gacha Suami
┆ ⇝ .gachanasib — Gacha Nasib
┆ ⇝ .rate — Nilai Kamu
┆ ⇝ .suit — Gunting Batu Kertas
┆ ⇝ .dadu — Lempar Dadu
┆ ⇝ .tod — Truth Or Dare
┆ ⇝ .spin — Putar Pilihan
╰➤-------------------------------
  `.trim(),

  game: `
╭➤--「GAME MENU 」
┆ ⇝ .tebakgambar — Tebak Gambar
┆ ⇝ .tebakkata — Tebak Kata
┆ ⇝ .susunkata — Susun Kata
┆ ⇝ .caklontong — Cak Lontong
┆ ⇝ .tebaklagu — Tebak Lagu
┆ ⇝ .tebakhewan — Tebak Hewan
┆ ⇝ .tebakbendera — Tebak Bendera
┆ ⇝ .tebaknegara — Tebak Negara
┆ ⇝ .tebakmakanan — Tebak Makanan
┆ ⇝ .tebakkimia — Tebak Unsur Kimia
┆ ⇝ .tekateki — Teka-teki Logika
┆ ⇝ .asahotak — Asah Otak
╰➤-------------------------------
  `.trim(),

  download: `
╭➤--「DOWNLOAD MENU 」
┆ ⇝ .tiktok — Download TikTok
┆ ⇝ .ytmp3 — YouTube ke MP3
┆ ⇝ .ytmp4 — YouTube ke Video
┆ ⇝ .ig — Download Instagram
┆ ⇝ .fb — Download Facebook
┆ ⇝ .twt — Download Twitter
┆ ⇝ .spotify — Cari Musik
┆ ⇝ .terabox — Cek Link Terabox
╰➤-------------------------------
  `.trim(),

  sticker: `
╭➤--「STICKER MENU 」
┆ ⇝ .stiker — Foto→Stiker
┆ ⇝ .ttp — Teks→Stiker
┆ ⇝ .attp — Teks→Stiker Animasi
┆ ⇝ .brat — Brat Text
┆ ⇝ .emojimix — Gabung Emoji
╰➤-------------------------------
  `.trim(),

  grup: `
╭➤--「GROUP MENU 」
┆ ⇝ .tagall — Tandai Semua
┆ ⇝ .hidetag — Kirim Pesan Diam-diam
┆ ⇝ .kick — Keluarkan Anggota
┆ ⇝ .promote — Jadikan Admin
┆ ⇝ .demote — Cabut Admin
┆ ⇝ .mute — Tutup Sementara
┆ ⇝ .buka — Buka Grup
┆ ⇝ .tutup — Tutup Grup
┆ ⇝ .linkgc — Link Grup
┆ ⇝ .rules — Aturan Grup
┆ ⇝ .setpp — Foto Profil Grup
┆ ⇝ .setname — Nama Grup
┆ ⇝ .setdesk — Deskripsi Grup
┆ ⇝ .antilink — Blokir Link
┆ ⇝ .antispam — Blokir Spam
┆ ⇝ .welcome — Pesan Selamat Datang
┆ ⇝ .goodbye — Pesan Perpisahan
╰➤-------------------------------
  `.trim(),

  religi: `
╭➤--「RELIGI MENU 」
┆ ⇝ .sholat — Jadwal Sholat
┆ ⇝ .quran — Baca Al-Qur'an
┆ ⇝ .asmaulhusna — Asmaul Husna
┆ ⇝ .doa — Kumpulan Doa Harian
┆ ⇝ .kisahnabi — Kisah Nabi
╰➤-------------------------------
  `.trim(),

  cek: `
╭➤--「CEK MENU 」
┆ ⇝ .cekjodoh — Cek Kecocokan
┆ ⇝ .cekrezeki — Cek Rezeki
┆ ⇝ .ceksial — Cek Sial
┆ ⇝ .cekhoki — Cek Hoki
┆ ⇝ .cekumur — Cek Usia
┆ ⇝ .cekjomblo — Status Jomblo
┆ ⇝ .cekganteng — Seberapa Ganteng
┆ ⇝ .cekcantik — Seberapa Cantik
┆ ⇝ .cekkaya — Cek Kekayaan
┆ ⇝ .cekpintar — Seberapa Pintar
┆ ⇝ .cekwibu — Seberapa Wibu
┆ ⇝ .cekgamer — Seberapa Gamer
╰➤-------------------------------
  `.trim(),

  info: `
╭➤--「INFO MENU 」
┆ ⇝ .cuaca — Cuaca Hari Ini
┆ ⇝ .gempa — Info Gempa
┆ ⇝ .berita — Berita Terkini
┆ ⇝ .jadwalbola — Jadwal Sepakbola
┆ ⇝ .livescore — Skor Langsung
┆ ⇝ .harilibur — Tanggal Merah
┆ ⇝ .spekhp — Spesifikasi HP
┆ ⇝ .resep — Resep Masakan
┆ ⇝ .lirik — Lirik Lagu
┆ ⇝ .film — Info Film
┆ ⇝ .anime — Info Anime
┆ ⇝ .waktu — Jam Sekarang
┆ ⇝ .tanggal — Hari Tanggal
╰➤-------------------------------
  `.trim(),

  tentang: `
╭➤--「TENTANG BOT 」
┆
┆ 🤖 FABIYAN BOT
┆ Versi: 1.0.0
┆ Pembuat: FABIYAN
┆ Status: ✅ Aktif
┆
┆ ⚠️ Gunakan dengan bijak
┆ ⚠️ Bukan layanan resmi WhatsApp
┆ ⚠️ Risiko pemblokiran ada
┆
┆ Ketik .menu untuk mulai
╰➤-------------------------------
  `.trim()
};

// ============== FUNGSI BALASAN ==============
async function jalankanPerintah(teks, pengirim) {
  if (!sock) return;
  const perintah = teks.trim().split(' ')[0].toLowerCase();
  const arg = teks.replace(perintah, '').trim();

  const balas = async (pesan) => {
    await sock.sendMessage(pengirim, { text: pesan });
  };

  switch (perintah) {
    case '.menu':
    case '.start':
    case '.help':
      return balas(MENU_TEKS.main);

    case '.menucat':
    case '.allmenu':
      return balas(MENU_TEKS.kategori);

    case '.tools':
      return balas(MENU_TEKS.tools);

    case '.fun':
      return balas(MENU_TEKS.fun);

    case '.game':
      return balas(MENU_TEKS.game);

    case '.download':
      return balas(MENU_TEKS.download);

    case '.sticker':
    case '.stiker':
      return balas(MENU_TEKS.sticker);

    case '.grup':
    case '.gc':
      return balas(MENU_TEKS.grup);

    case '.religi':
      return balas(MENU_TEKS.religi);

    case '.cek':
      return balas(MENU_TEKS.cek);

    case '.info':
      return balas(MENU_TEKS.info);

    case '.ping':
    case '.ping2':
      return balas('🏓 *PONG!*\nBot berjalan lancar ✅\nSemangat dari Karawang! ⚡');

    case '.owner':
      return balas('👤 *Pemilik Bot:*\nFABIYAN\n📍 Karawang, Jawa Barat\n\nHubungi untuk kerja sama!');

    case '.donasi':
      return balas('💵 *DONASI*\nDukungan sangat berarti!\n\n💳 DANA/Gopay/OVO: 0858-6322-1981\nA/N: SUNI / FABIYAN\n\nTerima kasih banyak! 🙏');

    case '.rules':
      return balas(`
📋 *PERATURAN PENGGUNAAN BOT*

1. Dilarang untuk hal yang melanggar hukum
2. Gunakan dengan bijak dan sopan
3. Jangan spam perintah secara berlebihan
4. Bot gratis, hargai pembuatnya
5. Tidak boleh digunakan untuk judi/penipuan

⚠️ Pelanggaran = Pemblokiran Permanen
      `.trim());

    case '.stats':
      return balas(`📊 *STATISTIK BOT*
🤖 Nama: FABIYAN BOT
📍 Lokasi: Karawang
📦 Total Fitur: 200+
🟢 Status: Online & Aktif
🕒 Uptime: Sedang berjalan
👥 Pengguna: Terus bertambah

Semangat terus! ✨`);

    case '.system':
      return balas(`⚙️ *INFORMASI SISTEM*
📱 Platform: Node.js + Baileys
🌐 Panel Web: Aktif
🎨 Tema: Hitam & Putih
🔄 Versi: 1.0.0
📅 Update: 25 Oktober 2026

Ketik .menu untuk mulai!`);

    case '.totalfitur':
      return balas(`📋 *TOTAL FITUR*

🟢 Kategori Utama: 20+
🟢 Total Perintah: 200+
🟢 Aktif: Terus berkembang

Terima kasih telah menggunakan FABIYAN BOT! 🙏`);

    case '.tqto':
      return balas(`🙏 *TERIMA KASIH UNTUK*

✨ Allah SWT
✨ Keluarga & Teman
✨ Semua pengguna bot
✨ Kamu yang sekarang baca ini

Semua doa dan dukungan sangat berarti! 🤲

— FABIYAN, Karawang`);

    case '.benefitowner':
      return balas(`👑 *KEUNTUNGAN PEMILIK*

✅ Kontrol penuh bot
✅ Akses semua fitur
✅ Bisa atur perintah
✅ Bebas kustomisasi
✅ Tidak ada batasan

Semangat, Pemilik! 💪`);

    case '.benefitpremium':
      return balas(`⭐ *KEUNTUNGAN PREMIUM*

✅ Bebas batas penggunaan
✅ Akses fitur eksklusif
✅ Prioritas respon cepat
✅ Tanpa iklan
✅ Dukungan prioritas

(Nantikan rilis Premium!)`);

    case '.carifitur':
      if (!arg) return balas('🔍 Ketik: .carifitur [nama fitur]\nContoh: .carifitur tiktok');
      return balas(`🔍 Mencari: *"${arg}"*\n\nFitur sedang dicari... coba ketik nama yang lebih singkat!`);

    case '.leaderboard':
      return balas(`🏆 *PENGGUNA TERAKTIF*

🥇 — FABIYAN
🥈 — Pengguna Setia
🥉 — Pengguna Aktif

Kumpulkan poin untuk masuk daftar ini! ⭐`);

    case '.allmenu':
      return balas(`📑 *DAFTAR LENGKAP SEMUA MENU*

Ketik perintah berikut untuk melihat kategori:

.tools   → Alat & Utilitas
.fun     → Hiburan & Seru-seruan
.game    → Game & Kuis
.download → Downloader
.sticker → Stiker WhatsApp
.grup    → Pengaturan Grup
.religi  → Islami
.cek     → Cek Kepribadian
.info    → Info & Berita

Semua perintah dikembangkan terus! ✨`);

    default:
      if (teks.startsWith('.') && teks.length > 1) {
        return balas(`❌ Perintah *"${perintah}"* belum tersedia atau sedang dikembangkan.

Ketik *.menu* untuk melihat daftar yang tersedia 😊`);
      }
  }
}

// ============== KONEKSI WHATSAPP ==============
async function hubungkanBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrCodeUrl = await QRCode.toDataURL(qr);
      connectionStatus = 'menunggu scan';
      console.log('📱 QR Code siap — buka http://localhost:3000 untuk melihat');
    }

    if (connection === 'open') {
      connectionStatus = 'terhubung';
      qrCodeUrl = '';
      console.log('✅ BOT TERHUBUNG KE WHATSAPP!');
      console.log('📱 Siap menerima perintah — ketik .menu di WhatsApp untuk mulai!');
    }

    if (connection === 'close') {
      const hubungUlang = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      connectionStatus = hubungUlang ? 'menghubungkan ulang' : 'terputus';
      if (hubungUlang) {
        console.log('🔄 Menghubungkan ulang...');
        setTimeout(hubungkanBot, 3000);
      } else {
        console.log('❌ Logout — hapus folder auth untuk scan ulang');
      }
    }
  });

  sock.ev.on('messages.upsert', async (pesanMasuk) => {
    const msg = pesanMasuk.messages[0];
    if (!msg.key.fromMe && msg.message) {
      const teks = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();
      const pengirim = msg.key.remoteJid;
      const namaPengirim = msg.pushName || 'Pengguna';
      
      console.log(`📩 Dari ${namaPengirim}: ${teks}`);
      await jalankanPerintah(teks, pengirim);
    }
  });
}

// ============== PANEL WEB — TEMA HITAM & PUTIH ==============
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FABIYAN BOT — Panel Kontrol</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; }
    body { background: #000; color: #fff; min-height: 100vh; padding: 20px; }
    .container { max-width: 400px; margin: 0 auto; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 5px; letter-spacing: 2px; }
    .subtitle { text-align: center; color: #888; font-size: 14px; margin-bottom: 30px; }
    
    .card { border: 1px solid #fff; border-radius: 0; padding: 24px; margin-bottom: 16px; }
    .card h2 { font-size: 16px; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #333; text-transform: uppercase; letter-spacing: 1px; }
    
    .status-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; background: #444; }
    .dot.online { background: #fff; box-shadow: 0 0 10px #fff; }
    .dot.waiting { background: #888; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
    
    .qr-container { background: #fff; padding: 20px; text-align: center; margin: 15px 0; }
    .qr-container img { width: 200px; height: 200px; }
    .qr-text { color: #000; font-size: 13px; margin-top: 10px; }
    
    .info-text { font-size: 12px; color: #666; line-height: 1.6; margin-top: 15px; }
    .menu-preview { font-family: monospace; font-size: 11px; color: #aaa; margin-top: 15px; white-space: pre-wrap; }
    
    .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #444; }
  </style>
</head>
<body>
  <div class="container">
    <h1>╔ FABIYAN BOT ╗</h1>
    <p class="subtitle">WHATSAPP AUTOMATION — KARAWANG</p>

    <div class="card">
      <h2>📱 STATUS KONEKSI</h2>
      <div class="status-bar">
        <div class="dot" id="status-dot"></div>
        <span id="status-text">Memuat...</span>
      </div>
      
      <div class="qr-container" id="qr-box">
        <p style="color:#000">Memuat QR Code...</p>
      </div>
      
      <p class="info-text">
        📍 Buka WhatsApp → Pengaturan → Perangkat Tertaut<br>
        📷 Pindai QR Code di atas untuk menghubungkan bot<br>
        ⏳ Setelah terhubung, kirim *.menu* ke nomor bot untuk mulai
      </p>
    </div>

    <div class="card">
      <h2>📋 CARA PAKAI</h2>
      <div class="menu-preview">
┌─────────────────────────────┐
│  KETIK PERINTAH DI CHAT      │
│                              │
│  .menu     → Lihat Menu      │
│  .ping     → Cek Bot         │
│  .donasi   → Dukung Bot      │
│  .rules    → Aturan Pakai    │
│  .owner    → Hubungi Admin   │
│                              │
│  200+ fitur terus bertambah! │
└─────────────────────────────┘
      </div>
    </div>

    <div class="footer">
      FABIYAN BOT © 2026 — Dibuat di Karawang<br>
      ⚠️ Gunakan dengan bijak & bertanggung jawab
    </div>
  </div>

  <script>
    async function cekStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('status-text');
        const qrBox = document.getElementById('qr-box');
        
        if (data.status === 'terhubung') {
          dot.className = 'dot online';
          text.textContent = '✅ TERHUBUNG — Bot Siap!';
          qrBox.innerHTML = '<p style="color:#000;font-size:16px">✅ BOT AKTIF</p><p style="color:#333;font-size:12px">Kirim .menu di WhatsApp</p>';
        } else if (data.qr) {
          dot.className = 'dot waiting';
          text.textContent = '📷 Scan QR Code di bawah';
          qrBox.innerHTML = '<img src="' + data.qr + '" alt="QR Code"><p class="qr-text">Berlaku 60 detik</p>';
        } else {
          dot.className = 'dot';
          text.textContent = '⏳ Menghubungkan...';
          qrBox.innerHTML = '<p style="color:#000">Silakan tunggu...</p>';
        }
      } catch (e) {
        console.log('Server belum siap');
      }
    }
    setInterval(cekStatus, 3000);
    cekStatus();
  </script>
</body>
</html>
  `);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qr: qrCodeUrl
  });
});

// ============== MULAI SEMUA ==============
async function mulaiServer() {
  console.log('╔══════════════════════════════════╗');
  console.log('║     FABIYAN BOT — VERSI 1.0      ║');
  console.log('║        Satu File Lengkap         ║');
  console.log('╚══════════════════════════════════╝');
  console.log('📍 Lokasi: Karawang, Jawa Barat');
  console.log('⏳ Sedang memulai...\n');

  await hubungkanBot();
  
  app.listen(PORT, () => {
    console.log(`🌐 Panel Web: http://127.0.0.1:${PORT}`);
    console.log(`🌐 Atau buka: http://localhost:${PORT}`);
    console.log('\n✅ Buka alamat di atas di browser HP untuk melihat QR Code');
    console.log('📱 Scan QR pakai WhatsApp kamu');
    console.log('💬 Setelah terhubung, ketik .menu di WhatsApp untuk mulai!\n');
  });
}

mulaiServer().catch(err => {
  console.error('❌ Error memulai bot:', err.message);
  console.log('\n💡 Pastikan sudah jalankan: npm install');
});
