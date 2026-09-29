import type { Lang } from "./site";

type L<T> = Record<Lang, T>;

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Tool registry: the single source of truth for the home grid, sitemap, and
 * navigation. To add a tool: add an entry here (set `ready: true`) and register
 * its component in components/tools/index.tsx.
 */
export interface Tool {
  slug: string;
  icon: string;
  name: L<string>;
  /** <title> and H1 text, phrased the way people search. */
  title: L<string>;
  description: L<string>;
  keywords: L<string[]>;
  /** True when files are processed fully on the device, the only case where we say so. */
  clientSide: boolean;
  /** Not-ready tools show as "coming soon" and get no page or sitemap entry. */
  ready: boolean;
  maxMb: number;
  accept: string[];
  howTo?: L<string[]>;
  faq?: L<FaqItem[]>;
}

export const tools: Tool[] = [
  {
    slug: "compress-image",
    icon: "🗜️",
    name: { id: "Kompres Foto", en: "Compress Image" },
    title: { id: "Kompres Foto Online: Perkecil Ukuran ke 200 KB", en: "Compress Image Online: Shrink Photos to 200 KB" },
    description: {
      id: "Kompres foto JPG, PNG, atau WebP sampai ukuran target (misalnya 100 KB atau 200 KB) langsung di browser. Gratis, tanpa upload, data lokasi dihapus.",
      en: "Compress JPG, PNG, or WebP photos to a target size (like 100 KB or 200 KB) right in your browser. Free, no upload, location data removed.",
    },
    keywords: {
      id: ["kompres foto", "perkecil ukuran foto", "kompres foto jadi 200kb", "kompres foto 100kb", "compress foto online"],
      en: ["compress image", "reduce photo size", "compress image to 200kb", "image compressor online"],
    },
    clientSide: true,
    ready: true,
    maxMb: 25,
    accept: ["image/jpeg", "image/png", "image/webp"],
    howTo: {
      id: [
        "Pilih atau seret foto (JPG, PNG, atau WebP) ke kotak di atas.",
        "Pilih Target ukuran (misalnya 200 KB) atau atur Kualitas sendiri.",
        "Tekan Kompres foto dan tunggu beberapa detik.",
        "Lihat perbandingan sebelum dan sesudah, lalu unduh hasilnya.",
      ],
      en: [
        "Choose or drag a photo (JPG, PNG, or WebP) into the box above.",
        "Pick a Target size (for example 200 KB) or set the Quality yourself.",
        "Press Compress photo and wait a few seconds.",
        "Check the before/after comparison, then download the result.",
      ],
    },
    faq: {
      id: [
        {
          q: "Apakah foto saya diunggah ke server?",
          a: "Tidak. Foto diproses sepenuhnya di browser di perangkatmu. Kamu bisa memastikannya lewat tab Network di developer tools: tidak ada permintaan yang membawa file.",
        },
        {
          q: "Bagaimana cara kompres foto jadi 200 KB?",
          a: "Pilih mode Target ukuran, pilih 200 KB, lalu tekan Kompres foto. Alat ini mencari kualitas tertinggi yang masih di bawah 200 KB. Jika belum cukup, dimensi foto dikecilkan sedikit demi sedikit.",
        },
        {
          q: "Kenapa hasilnya tidak mencapai target?",
          a: "Kalau target terlalu kecil untuk foto yang besar, kualitas akan rusak parah. Alat ini menampilkan hasil terkecil yang layak dan memberi tahu bahwa target belum tercapai. Coba target yang lebih besar.",
        },
        {
          q: "Apakah data lokasi (GPS) di foto dihapus?",
          a: "Ya. Data EXIF, termasuk lokasi GPS dan info kamera, tidak ikut ke file hasil.",
        },
        {
          q: "Apakah foto asli saya berubah?",
          a: "Tidak. File asli tidak pernah diubah, dan setiap kompresi selalu dimulai dari foto asli, jadi kualitas tidak menurun berlapis.",
        },
      ],
      en: [
        {
          q: "Is my photo uploaded to a server?",
          a: "No. The photo is processed entirely in your browser, on your device. You can verify this in the Network tab of developer tools: no request carries the file.",
        },
        {
          q: "How do I compress a photo to 200 KB?",
          a: "Choose Target size mode, pick 200 KB, and press Compress photo. The tool finds the highest quality that stays under 200 KB. If that isn't enough, it shrinks the photo dimensions step by step.",
        },
        {
          q: "Why didn't the result reach my target?",
          a: "If the target is too small for a large photo, the quality would be ruined. The tool shows the smallest acceptable result and tells you the target wasn't reached. Try a larger target.",
        },
        {
          q: "Is location (GPS) data removed from the photo?",
          a: "Yes. EXIF data, including GPS location and camera info, is not carried into the result.",
        },
        {
          q: "Does my original photo change?",
          a: "No. The original file is never modified, and every compression starts from the original, so quality doesn't degrade in layers.",
        },
      ],
    },
  },
  {
    slug: "resize-image",
    icon: "📐",
    name: { id: "Ubah Ukuran Foto", en: "Resize Image" },
    title: { id: "Ubah Ukuran Foto Online (px, %, Pas Foto 3x4)", en: "Resize Image Online (px, %, Passport Photo)" },
    description: {
      id: "Ubah ukuran foto dalam piksel atau persen, dengan preset Instagram dan pas foto 3x4.",
      en: "Resize photos by pixels or percent, with Instagram and passport-photo presets.",
    },
    keywords: { id: ["ubah ukuran foto", "resize foto", "ukuran pas foto 3x4"], en: ["resize image", "resize photo online"] },
    clientSide: true,
    ready: false,
    maxMb: 25,
    accept: ["image/jpeg", "image/png", "image/webp"],
  },
  {
    slug: "convert-image",
    icon: "🔄",
    name: { id: "Ubah Format Foto", en: "Convert Image" },
    title: { id: "Ubah Format Foto: JPG, PNG, WebP", en: "Convert Image: JPG, PNG, WebP" },
    description: {
      id: "Ubah format foto antara JPG, PNG, dan WebP langsung di browser.",
      en: "Convert photos between JPG, PNG, and WebP right in your browser.",
    },
    keywords: { id: ["ubah png ke jpg", "convert webp ke jpg"], en: ["convert png to jpg", "webp to jpg"] },
    clientSide: true,
    ready: false,
    maxMb: 25,
    accept: ["image/jpeg", "image/png", "image/webp"],
  },
  {
    slug: "remove-background",
    icon: "✂️",
    name: { id: "Hapus Background", en: "Remove Background" },
    title: { id: "Hapus Background Foto Otomatis", en: "Remove Photo Background Automatically" },
    description: {
      id: "Hapus latar belakang foto dalam satu klik, hasil PNG transparan.",
      en: "Remove a photo background in one click, with a transparent PNG result.",
    },
    keywords: { id: ["hapus background foto", "remove bg"], en: ["remove background", "background remover"] },
    clientSide: true,
    ready: false,
    maxMb: 25,
    accept: ["image/jpeg", "image/png", "image/webp"],
  },
  {
    slug: "merge-pdf",
    icon: "📑",
    name: { id: "Gabung PDF", en: "Merge PDF" },
    title: { id: "Gabung PDF Online Gratis", en: "Merge PDF Files Online for Free" },
    description: {
      id: "Gabungkan beberapa file PDF menjadi satu dan atur ulang urutannya.",
      en: "Combine several PDF files into one and reorder them.",
    },
    keywords: { id: ["gabung pdf", "merge pdf"], en: ["merge pdf", "combine pdf"] },
    clientSide: true,
    ready: false,
    maxMb: 50,
    accept: ["application/pdf"],
  },
  {
    slug: "qr-code",
    icon: "▦",
    name: { id: "Pembuat QR Code", en: "QR Code Generator" },
    title: { id: "Buat QR Code Gratis", en: "Free QR Code Generator" },
    description: {
      id: "Buat QR code dari teks atau tautan dan unduh sebagai gambar.",
      en: "Create a QR code from text or a link and download it as an image.",
    },
    keywords: { id: ["buat qr code", "qr code generator"], en: ["qr code generator"] },
    clientSide: true,
    ready: false,
    maxMb: 0,
    accept: [],
  },
];

export const readyTools = tools.filter((t) => t.ready);
export const getTool = (slug: string): Tool | undefined => tools.find((t) => t.slug === slug);
