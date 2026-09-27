import type {
    FrameworkLibrary
} from "../types/framework.js";

export const cldFramework:
    FrameworkLibrary = {

    frameworkId:
        "FRAMEWORK-21CLD",

    name:
        "21st Century Learning Design",

    version:
        "1.0",

    dimensions: [

        {
            id:
                "21CLD-KC",

            code:
                "KC",

            name:
                "Knowledge Construction",

            description:
                "Kemampuan peserta didik membangun, menerapkan, dan mentransfer pengetahuan.",

            indicators: [
                "Membangun pengetahuan",
                "Menerapkan pengetahuan",
                "Menggunakan pengetahuan dalam konteks baru"
            ],

            questionEvidence: [
                "Analisis",
                "Penerapan konsep",
                "Transfer pengetahuan",
                "Pemecahan masalah"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "21CLD-CR",

            code:
                "CR",

            name:
                "Collaboration",

            description:
                "Kemampuan bekerja bersama untuk mencapai tujuan pembelajaran.",

            indicators: [
                "Berbagi tanggung jawab",
                "Mengambil peran",
                "Membangun hasil bersama"
            ],

            questionEvidence: [
                "Skenario kolaboratif",
                "Pembagian peran",
                "Pengambilan keputusan bersama"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "21CLD-CT",

            code:
                "CT",

            name:
                "Skilled Communication",

            description:
                "Kemampuan menyampaikan gagasan secara efektif.",

            indicators: [
                "Menyampaikan ide",
                "Menggunakan bukti",
                "Menyesuaikan komunikasi dengan konteks"
            ],

            questionEvidence: [
                "Argumentasi",
                "Presentasi",
                "Interpretasi informasi"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "21CLD-RC",

            code:
                "RC",

            name:
                "Real-World Problem Solving",

            description:
                "Kemampuan menggunakan pengetahuan untuk menyelesaikan persoalan nyata.",

            indicators: [
                "Mengidentifikasi masalah",
                "Mengembangkan solusi",
                "Mengevaluasi solusi"
            ],

            questionEvidence: [
                "Studi kasus",
                "Problem solving",
                "Pengambilan keputusan"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "21CLD-SR",

            code:
                "SR",

            name:
                "Self-Regulation",

            description:
                "Kemampuan mengatur proses belajar dan mengevaluasi hasilnya.",

            indicators: [
                "Menetapkan tujuan",
                "Merencanakan proses",
                "Memantau proses",
                "Merefleksikan hasil"
            ],

            questionEvidence: [
                "Refleksi",
                "Perencanaan",
                "Evaluasi diri"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "21CLD-ICT",

            code:
                "ICT",

            name:
                "Use of ICT for Learning",

            description:
                "Penggunaan teknologi informasi dan komunikasi untuk mendukung pembelajaran.",

            indicators: [
                "Menggunakan teknologi",
                "Mengolah informasi digital",
                "Membuat produk digital"
            ],

            questionEvidence: [
                "Literasi digital",
                "Evaluasi sumber digital",
                "Produksi konten digital"
            ],

            version:
                "1.0",

            status:
                "active"
        }
    ],

    sourceReferenceIds: [
        "REF-21CLD-001"
    ],

    status:
        "active"
};

export const kbcFramework:
    FrameworkLibrary = {

    frameworkId:
        "FRAMEWORK-KBC",

    name:
        "Kurikulum Berbasis Cinta",

    version:
        "1.0",

    dimensions: [

        {
            id:
                "KBC-C01",

            code:
                "C01",

            name:
                "Cinta kepada Allah",

            description:
                "Pembelajaran yang menumbuhkan kecintaan kepada Allah dan kesadaran spiritual.",

            indicators: [
                "Kesadaran ketuhanan",
                "Syukur",
                "Ketaatan",
                "Keteladanan"
            ],

            learningEvidence: [
                "Refleksi nilai keimanan",
                "Penerapan nilai agama",
                "Pembiasaan ibadah"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "KBC-C02",

            code:
                "C02",

            name:
                "Cinta kepada Rasul",

            description:
                "Pembelajaran yang menumbuhkan kecintaan dan keteladanan terhadap Rasul.",

            indicators: [
                "Mengenal keteladanan Rasul",
                "Meneladani akhlak",
                "Menerapkan nilai sunnah"
            ],

            learningEvidence: [
                "Analisis keteladanan",
                "Studi perilaku",
                "Penerapan akhlak"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "KBC-C03",

            code:
                "C03",

            name:
                "Cinta kepada Sesama",

            description:
                "Pembelajaran yang menumbuhkan kepedulian, empati, dan penghormatan terhadap sesama.",

            indicators: [
                "Empati",
                "Menghargai perbedaan",
                "Tolong-menolong",
                "Kepedulian sosial"
            ],

            learningEvidence: [
                "Studi kasus sosial",
                "Pemecahan masalah sosial",
                "Refleksi empati"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "KBC-C04",

            code:
                "C04",

            name:
                "Cinta kepada Diri",

            description:
                "Pembelajaran yang membangun penghargaan terhadap diri, tanggung jawab, dan pengembangan potensi.",

            indicators: [
                "Mengenali potensi diri",
                "Menjaga diri",
                "Bertanggung jawab",
                "Mengembangkan diri"
            ],

            learningEvidence: [
                "Refleksi diri",
                "Perencanaan pengembangan diri",
                "Evaluasi diri"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "KBC-C05",

            code:
                "C05",

            name:
                "Cinta kepada Ilmu",

            description:
                "Pembelajaran yang menumbuhkan kecintaan terhadap ilmu pengetahuan dan proses belajar.",

            indicators: [
                "Rasa ingin tahu",
                "Mencari informasi",
                "Mengembangkan pengetahuan",
                "Berpikir kritis"
            ],

            learningEvidence: [
                "Investigasi",
                "Analisis informasi",
                "Pemecahan masalah"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "KBC-C06",

            code:
                "C06",

            name:
                "Cinta kepada Lingkungan",

            description:
                "Pembelajaran yang membangun kepedulian terhadap lingkungan dan keberlanjutan.",

            indicators: [
                "Menjaga lingkungan",
                "Mengurangi kerusakan",
                "Menggunakan sumber daya secara bertanggung jawab"
            ],

            learningEvidence: [
                "Studi kasus lingkungan",
                "Pemecahan masalah lingkungan",
                "Proyek kepedulian lingkungan"
            ],

            version:
                "1.0",

            status:
                "active"
        },

        {
            id:
                "KBC-C07",

            code:
                "C07",

            name:
                "Cinta kepada Bangsa dan Negara",

            description:
                "Pembelajaran yang menumbuhkan tanggung jawab sebagai warga negara dan kepedulian terhadap kehidupan bersama.",

            indicators: [
                "Tanggung jawab sosial",
                "Menghargai keberagaman",
                "Menjaga persatuan",
                "Berpartisipasi dalam kehidupan bersama"
            ],

            learningEvidence: [
                "Studi kasus kewargaan",
                "Analisis masalah sosial",
                "Pengambilan keputusan"
            ],

            version:
                "1.0",

            status:
                "active"
        }
    ],

    sourceReferenceIds: [
        "REF-KBC-001"
    ],

    status:
        "active"
};
