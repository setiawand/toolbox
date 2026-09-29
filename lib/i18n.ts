import type { Lang } from "./site";

const id = {
  brand: "Toolbox",
  tagline: "Alat file & foto gratis. Diproses di perangkatmu, tanpa upload.",
  heroTitle: "Alat foto & file yang cepat, gratis, dan privat",
  heroText:
    "Kompres foto jadi 200 KB, ubah ukuran, gabung PDF, dan lainnya. Semua diproses langsung di browser, jadi file KTP dan dokumenmu tidak pernah meninggalkan perangkat.",
  privacyBadge: "Diproses di perangkatmu",
  privacyNote: "File tidak diunggah ke server mana pun.",
  soon: "Segera hadir",
  toolsHeading: "Semua alat",
  howTo: "Cara pakai",
  faq: "Pertanyaan umum",
  otherTools: "Alat lainnya",
  limits: (maxMb: number) => `Maksimal ${maxMb} MB per file.`,
  footer: "Dibuat oleh Deni Setiawan. Tanpa akun, tanpa iklan yang menghalangi.",
  switchTo: "English",
  switchLabel: "Switch to English",
  skip: "Lewati ke konten",
  dropzone: {
    prompt: "Ketuk untuk pilih file",
    orDrop: "atau seret file ke sini",
    hint: (types: string, maxMb: number) => `${types} · maks. ${maxMb} MB`,
    tooLarge: (maxMb: number) => `File terlalu besar. Ukuran maksimal adalah ${maxMb} MB.`,
    unsupported: (types: string) => `Jenis file tidak didukung. Gunakan ${types}.`,
    change: "Ganti file",
  },
  result: {
    original: "Asli",
    result: "Hasil",
    saved: (pct: number) => `Lebih kecil ${pct}%`,
    download: "Unduh hasil",
    dimensions: (w: number, h: number) => `${w} × ${h} px`,
  },
  compress: {
    modeTarget: "Target ukuran",
    modeQuality: "Kualitas",
    targetLabel: "Ukuran maksimal hasil",
    custom: "Lainnya",
    customLabel: "Ukuran khusus (KB)",
    qualityLabel: "Kualitas",
    qualityHint: "Makin tinggi makin tajam, tapi file makin besar.",
    formatLabel: "Format hasil",
    formatJpgNote: "JPG paling kompatibel. Latar transparan diganti putih.",
    formatWebpNote: "WebP lebih kecil, tapi belum diterima semua formulir.",
    stripNote: "Data EXIF/lokasi (GPS) otomatis dihapus dari hasil.",
    button: "Kompres foto",
    working: "Mengompres…",
    reached: (kb: number) => `Berhasil di bawah ${kb} KB.`,
    notReached: (kb: number) =>
      `Ukuran ${kb} KB tidak bisa dicapai tanpa merusak kualitas. Ini hasil terkecil yang layak, coba target yang lebih besar.`,
    downscaled: (pct: number) => `Untuk mencapai target, dimensi foto dikecilkan menjadi ${pct}% dari aslinya.`,
    biggerThanOriginal: "Hasil lebih besar dari file asli. File asli sudah cukup kecil, coba turunkan kualitas atau target.",
    errors: {
      decode: "Foto tidak bisa dibuka. File mungkin rusak atau formatnya (misalnya HEIC) belum didukung browser.",
      webp: "Browser ini tidak bisa membuat WebP. Pilih JPG.",
      generic: "Terjadi kesalahan saat mengompres. Coba lagi atau gunakan file lain.",
    },
  },
};

export type Dict = typeof id;

const en: Dict = {
  brand: "Toolbox",
  tagline: "Free file & photo tools. Processed on your device, no upload.",
  heroTitle: "Fast, free, private photo & file tools",
  heroText:
    "Compress a photo to 200 KB, resize it, merge PDFs and more. Everything runs right in your browser, so your ID and documents never leave your device.",
  privacyBadge: "Processed on your device",
  privacyNote: "Files are not uploaded to any server.",
  soon: "Coming soon",
  toolsHeading: "All tools",
  howTo: "How to use",
  faq: "FAQ",
  otherTools: "More tools",
  limits: (maxMb: number) => `Up to ${maxMb} MB per file.`,
  footer: "Made by Deni Setiawan. No accounts, no ads in your way.",
  switchTo: "Bahasa Indonesia",
  switchLabel: "Ganti ke Bahasa Indonesia",
  skip: "Skip to content",
  dropzone: {
    prompt: "Tap to choose a file",
    orDrop: "or drag a file here",
    hint: (types, maxMb) => `${types} · max ${maxMb} MB`,
    tooLarge: (maxMb) => `File is too large. The maximum size is ${maxMb} MB.`,
    unsupported: (types) => `Unsupported file type. Please use ${types}.`,
    change: "Change file",
  },
  result: {
    original: "Original",
    result: "Result",
    saved: (pct) => `${pct}% smaller`,
    download: "Download result",
    dimensions: (w, h) => `${w} × ${h} px`,
  },
  compress: {
    modeTarget: "Target size",
    modeQuality: "Quality",
    targetLabel: "Maximum result size",
    custom: "Custom",
    customLabel: "Custom size (KB)",
    qualityLabel: "Quality",
    qualityHint: "Higher is sharper, but the file gets bigger.",
    formatLabel: "Output format",
    formatJpgNote: "JPG is the most compatible. Transparent areas become white.",
    formatWebpNote: "WebP is smaller, but not every form accepts it.",
    stripNote: "EXIF and location (GPS) data is removed from the result automatically.",
    button: "Compress photo",
    working: "Compressing…",
    reached: (kb) => `Done, under ${kb} KB.`,
    notReached: (kb) =>
      `${kb} KB can't be reached without ruining the quality. This is the smallest acceptable result, try a larger target.`,
    downscaled: (pct) => `To hit the target, the photo dimensions were reduced to ${pct}% of the original.`,
    biggerThanOriginal:
      "The result is larger than the original. The original is already small, try a lower quality or target.",
    errors: {
      decode: "This photo can't be opened. The file may be damaged, or its format (e.g. HEIC) isn't supported by your browser.",
      webp: "This browser can't create WebP. Choose JPG.",
      generic: "Something went wrong while compressing. Try again or use another file.",
    },
  },
};

export const dictionaries: Record<Lang, Dict> = { id, en };
export const t = (lang: Lang): Dict => dictionaries[lang];
