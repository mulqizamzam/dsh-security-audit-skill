# DeepSeek Harness Security Audit Skill

A DeepSeek Harness (DSH) bundle that exposes the source-first `security-audit` workflow through the native Harness Skills system.

**Target runtime:** DeepSeek Harness `0.2.1-rc.2` (pinned in `engines.dsh`).  
**Bundle version:** `0.1.0`.

## Install

With DSH installed, install the public bundle into the profile you use:

```sh
dsh plugin --profile web add github:mulqizamzam/dsh-security-audit-skill
dsh --profile web --dump-config
dsh --profile web
```

Replace `web` with your actual profile name. This bundle contributes a dedicated filesystem Skill provider rooted at its own `skills/` directory; it does not require an MCP server or override the existing filesystem provider. The profile must include the normal DSH Skills consumer and, for the complete workflow, a genuinely independent configured subagent capability.

## Panduan pemula (Bahasa Indonesia)

Bagian ini adalah langkah praktis untuk memasang dan mulai memakai skill ini. Skill membantu DSH melakukan tinjauan keamanan kode berbasis bukti dari source; skill ini bukan pemindai otomatis yang menjamin semua kerentanan ditemukan.

### 1. Periksa prasyarat

Gunakan DSH `0.2.1-rc.2` dan Node.js versi 24 atau lebih baru. Perintah pengelolaan plugin DSH menggunakan pnpm, jadi pastikan `pnpm` juga tersedia.

```sh
node --version
dsh --version
pnpm --version
```

Pastikan DSH sudah dikonfigurasi dengan model/provider yang bisa dipakai. Jika Anda belum memiliki DSH, ikuti petunjuk instalasi resmi di [repositori DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

### 2. Pasang skill ke profil DSH

Contoh ini memakai profil bernama `web`. Ganti `web` jika Anda memakai profil lain.

```sh
dsh plugin --profile web add github:mulqizamzam/dsh-security-audit-skill
```

Perintah di atas memasang versi terbaru dari branch default repositori. Setelah instalasi, periksa konfigurasi profil:

```sh
dsh --profile web --dump-config
```

Di keluaran konfigurasi, cari `dsh-security-audit-skill-filesystem` atau `security-audit-bundle`. Setelah itu, mulai atau mulai ulang DSH agar perubahan konfigurasi dimuat:

```sh
dsh --profile web
```

Paket ini menambahkan penyedia (provider) untuk file skill saja. Profil DSH juga harus memuat Skills registry dan consumer standar, termasuk `@deepseek-ai/dsh-tool-skill`, agar agent dapat melihat dan memuat skill. Untuk audit lengkap, profil juga perlu mendukung delegasi melalui tool `subagent` yang benar-benar independen.

### 3. Buka proyek yang ingin ditinjau

Buka DSH dengan workspace/folder proyek yang ingin Anda audit. Pastikan agent dapat membaca source code proyek tersebut. Mulailah dengan tinjauan yang sempit dan read-only sebelum meminta audit lengkap.

### 4. Panggil skill

Ketik `/security-audit` di awal permintaan, lalu jelaskan pekerjaan yang Anda inginkan.

**Contoh: tinjauan awal untuk pemula**

```text
/security-audit Tinjau repository ini secara read-only. Petakan komponen utama,
batas kepercayaan (trust boundaries), jenis input yang tidak tepercaya, serta
file dan fungsi yang paling penting untuk ditinjau. Jangan jalankan build atau
test. Berikan alasan dan bukti source untuk setiap risiko yang Anda sebutkan.
```

**Contoh: periksa satu dugaan masalah**

```text
/security-audit Triage dugaan masalah otorisasi pada endpoint ini. Telusuri alur
input hingga pemeriksaan izin dan operasi sensitif. Bedakan fakta yang terbukti
dari hipotesis, tunjukkan file/baris yang relevan, lalu sarankan perbaikan
terkecil yang efektif.
```

**Contoh: minta audit lengkap**

Audit lengkap menjalankan workflow enam fase dan dapat menghasilkan artefak laporan. Minta secara eksplisit:

```text
/security-audit Lakukan full security audit enam fase untuk repository ini.
Gunakan analisis source-first dan buat artefak laporan yang ditentukan skill,
termasuk findings.json dan coverage-ledger.json. Validasi temuan dengan bukti
dari source; jangan menaikkan dugaan yang belum terbukti menjadi finding.
Jangan jalankan build, test, proses, browser, atau fixture milik target kecuali
sandbox OS yang memenuhi semua kontrol keamanan memang tersedia. Jika delegasi
independen atau sandbox tidak tersedia, catat blocker dan tandai fase terkait
belum lengkap.
```

### 5. Pahami batasan dan hasil

- Mode tinjauan biasa memberikan panduan atau triage terfokus; mode ini tidak otomatis menjalankan seluruh audit atau membuat berkas laporan.
- Dalam audit lengkap, `findings.json` berisi catatan temuan dan `coverage-ledger.json` membantu mencatat cakupan pemeriksaan. Gunakan validator yang disertakan untuk memeriksa formatnya.
- Temuan harus ditopang bukti source dan dampak keamanan yang konkret. Hal yang belum terbukti harus ditandai sebagai perlu validasi, bukan dipresentasikan sebagai kerentanan yang sudah terkonfirmasi.
- Jangan pernah menguji endpoint produksi, akun nyata, data pengguna lain, atau layanan bersama. Jangan jalankan kode/build/test dari proyek yang diaudit kecuali sandbox yang benar-benar membatasi jaringan, environment, akses tulis, dan sumber daya tersedia.

### 6. Jika skill tidak muncul atau instalasi gagal

1. Mulai ulang DSH, lalu jalankan lagi `dsh --profile web --dump-config` dan cari `security-audit-bundle`.
2. Pastikan profil memiliki Skills registry serta consumer `@deepseek-ai/dsh-tool-skill`. Paket ini sendiri tidak menggantikan consumer tersebut.
3. Jika perintah instalasi masih menunjuk ke commit lama, ulangi perintah instalasi pada langkah 2 tanpa menambahkan hash commit lama. Versi terbaru sudah menghapus hook `prepack` saat instalasi; pemeriksaan paket dan pengujian tetap dijalankan di CI.
4. Jika audit lengkap tidak bisa memakai delegasi independen atau sandbox yang diwajibkan, jangan menyamarkan keterbatasan itu. Minta analisis source-only dan minta DSH mencatat fase yang terhambat.

## Preserved workflows

- Guidance mode for security questions, focused source reviews, and finding triage; full six-phase audits only on explicit full-audit, pen-test, comprehensive-review, or reporting requests.
- Reconnaissance, deterministic coverage ledger, coverage-led hunting, adversarial candidate validation, machine-validated records, independent record verification, and target-neutral reports.
- Core and specialized attack classes: AI/LLM, browser/client, cloud/deployment, tenant and data lifecycle, desktop/mobile/IPC, native memory/binary/kernel, RPC/messaging, availability, supply chain/release, HTTP and authentication.
- The findings schema, both zero-dependency Node validators, and the upstream regression suites.

## Security boundary

This is a defensive, source-first workflow. Never execute target-controlled builds, tests, processes, browsers, emulators, fuzzers, or fixtures unless an OS-enforced sandbox guarantees disabled external networking, an allowlisted clean environment, read-only target/toolchain access, per-agent write isolation, and explicit resource limits. DSH tool availability alone does not prove those controls exist. If independent delegation or a required sandbox control is unavailable, preserve the blocker and mark the relevant audit phase incomplete rather than simulating independent verification.

Never probe production endpoints, live identities, shared infrastructure, or another user's data. Findings require source-grounded trust-boundary evidence and a bounded observed result; unresolved facts belong in `needs_validation` without severity.

## Validate

```sh
npm run validate
npm test
npm pack
```

CI also compares two package archives and revalidates a clean extraction. A Harness profile-boot test remains a separate environment-dependent check.

## Provenance

Ported from [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill), inspected at [source commit `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`](https://github.com/cloudflare/security-audit-skill/commit/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8). The upstream MIT license and copyright notice are retained. See [CONVERSION.md](CONVERSION.md) for decisions and verification boundaries.
