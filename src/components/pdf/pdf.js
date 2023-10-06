import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function generatePdf(date) {
  moment.locale('id');

  const daysInIndonesian = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const monthsInIndonesian = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const day = moment(date).format('D');
  const month = moment(date).format('M');
  const year = moment(date).format('YYYY');

  const formattedDay = daysInIndonesian[day - 1];
  const formattedMonth = monthsInIndonesian[month - 1];

  const formattedYear = year
    .split('')
    .map((digit) => {
      return {
        0: 'ribu',
        1: 'satu',
        2: 'dua',
        3: 'tiga',
        4: 'empat',
        5: 'lima',
        6: 'enam',
        7: 'tujuh',
        8: 'delapan',
        9: 'sembilan',
      }[digit];
    })
    .join(' ');

  const formattedDateString = `${formattedDay} ${formattedMonth} ${formattedYear}`;

  const docDefinition = {
    content: [
      { text: 'Perjanjian Borongan Pekerjaan', fontSize: 18, alignment: 'center', bold: true, margin: [0, 0, 0, 20] },

      {
        text: 'Pada hari ini, Sabtu, tanggal 06-05-2023 (enam Mei dua ribu dua puluh tiga).',
        margin: [0, 0, 0, 10],
      },

      { text: 'PIHAK PERTAMA', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      'Nyonya EKA SANTI, pemegang Kartu Tanda Penduduk (KTP) Nomor: 127106410886004;',
      'Nona THERESIA YAPRIANKO, Sebagai Pemilik Ruko bertingkat yang beralamat di Komplek Cemara Asri, Jalan Cemara Boulovard, Ruko Blok C-7, nomor 34, Desa Sampali, Kecamatan Percut Sei Tuan, Kabupaten Deli Serdang.',

      { text: 'PIHAK KEDUA', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      'Tuan TURIS, lahir di P.Cengkering, pada tanggal 14-05-1975 (empat belas Mei seribu sembilan ratus tujuh puluh lima, Warga Negara Indonesia, Wiraswasta, bertempat tinggal di Kota Tebing Tinggi, Jalan Gunung Lauser Komplek Non Blok, Kelurahan Tanjung Marulak, Kecamatan Rambutan, pemegang Kartu Tanda Penduduk Republik Indonesia Provinsi Sumatera Utara Kota Tebing Tinggi, Nomor Induk Kependudukan (NIK):1276021405750001 ;',

      { text: 'Perjanjian Borongan Pekerjaan', fontSize: 16, alignment: 'center', bold: true, margin: [0, 10, 0, 20] },
      { text: 'Pasal 1 - JENIS DAN LOKASI PEKERJAAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      'Pihak Pertama dengan ini memberikan borongan pekerjaan, yakni PEKERJAAN FONDASI milik Pihak Pertama yang beralamat di Komplek Cemara Asri, Jalan Cemara Boulovard, Ruko Blok C-7, nomor 34, Desa Sampali, Kecamatan Percut Sei Tuan, Kabupaten Deli Serdang kepada Pihak Kedua yang dengan ini menerima pekerjaan tersebut dan dapat mengerjakannya sesuai standar, dan spesifikasi serta gambar yang telah disetujui oleh kedua belah pihak.',

      { text: 'Pasal 2 - PELAKSANAAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      'PIHAK KEDUA berjanji dan sanggup untuk menyelesaikan pekerjaan tersebut dan dinyatakan telah selesai oleh PIHAK PERTAMA dalam jangka waktu selambat-lambatnya 3 (tiga) bulan kerja.',
      'Pekerjaan dimulai pada tanggal 08-05-2023 (delapan Mei dua ribu dua puluh tiga) sehingga akan berakhir dan dinyatakan selesai pada tanggal 08-08-2023 (delapan Agustus dua ribu dua puluh tiga).',
      'Waktu penyelesaian tersebut di atas tidak dapat dirubah oleh PIHAK KEDUA, kecuali adanya keadaan memaksa (force majeure) seperti yang disebut pada pasal 12 (dua belas) Perjanjian ini.',

      { text: 'Pasal 3 - TENAGA KERJA DAN UPAH', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. Agar pekerjaan borongan dapat berjalan sesuai dengan perjanjian, PIHAK KEDUA wajib menyediakan tenaga kerja dalam jumlah yang cukup dan mempunyai keahlian serta keterampilan yang baik terkait pekerjaan.',
      '2. Semua upah tenaga kerja dalam hal melaksanakan pekerjaan borongan tersebut menjadi beban dan tanggung jawab Pihak kedua sepenuhnya.',

      { text: 'Pasal 4 - PELAKSANAAN PEKERJAAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. Dalam melakukan pekerjaan, PIHAK KEDUA dan pekerjanya wajib mematuhi ketentuan aturan hukum serta peraturan-peraturan yang terkait lainnya, serta bertanggung jawab sepenuhnya apabila terjadi kecelakaan kerja dan atau peristiwa hukum lainnya, tanpa melibatkan PIHAK PERTAMA, serta wajib menjaga keamanan dan ketertiban dilokasi pekerjaan.',
      '2. PIHAK KEDUA harus mulai melaksanakan pekerjaan sesuai tanggal yang ditetapkan bersama dan tidak dibenarkan melakukan penyimpangan atau pelanggaran terhadap ketentuan-ketentuan yang sudah ditetapkan bersama.',
      '3. PIHAK KEDUA harus bekerja berdasarkan data-data yang lengkap dan tidak diperkenankan memutuskan sendiri perkara-perkara yang ada diluar gambar kerja (bestek) dan Rancangan Anggaran Biaya (RAB).',
      '4. PIHAK KEDUA wajib memeriksa keadaan barang dan quantity barang sesuai dengan permintaan. Jika tidak sesuai maka PIHAK KEDUA wajib konfirmasi kepada PIHAK PERTAMA untuk mengganti bahan/barang tersebut, tetapi apabila terjadi kerusakan pada bahan/barang selama PIHAK KEDUA belum menyelesaikan pekerjaannya maka kerusakan barang itu menjadi tanggung jawab PIHAK KEDUA.',

      { text: 'Pasal 5 - PELAKSANAAN PEKERJAAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. PIHAK KEDUA tidak dibenarkan melakukan subkontrak (pekerjaan yang dikerjakan oleh pihak lain) dan tidak dibenarkan pula untuk menggantikan pekerjaan sebagian atau seluruhnya kepada pihak lain.',
      '2. Apabila PIHAK KEDUA tidak mampu menyelesaikan pekerjaan sendiri, maka pekerjaan tersebut akan diberikan kepada pihak lain dan kerugian tersebut menjadi tanggung jawab PIHAK KEDUA.',
      '3. PIHAK KEDUA wajib memelihara pekerjaan borongan tersebut selama masa garansi yaitu selama 3 (tiga) tahun.',

      { text: 'Pasal 6 - MASA GARANSI', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. PIHAK KEDUA wajib memelihara pekerjaan borongan tersebut selama masa garansi yaitu selama 3 (tiga) tahun.',
      '2. Masa garansi tersebut di atas akan dihitung mulai dari tanggal penyelesaian pekerjaan borongan tersebut.',
      '3. Apabila selama masa garansi tersebut ada kerusakan pada pekerjaan borongan tersebut, maka PIHAK KEDUA harus memperbaikinya sesuai dengan standar dan spesifikasi yang berlaku, tanpa membebani PIHAK PERTAMA.',

      { text: 'Pasal 7 - PEMBAYARAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. Pembayaran pekerjaan borongan akan dilakukan oleh PIHAK PERTAMA kepada PIHAK KEDUA sesuai dengan persentase yang sudah ditetapkan bersama sebesar 40% (empat puluh persen) dari total nilai pekerjaan setelah PIHAK KEDUA menyelesaikan pekerjaan sebanyak 30% (tiga puluh persen).',
      '2. Pembayaran selanjutnya akan dilakukan sebesar 30% (tiga puluh persen) setelah pekerjaan mencapai 60% (enam puluh persen) dan sisanya sebesar 30% (tiga puluh persen) setelah pekerjaan selesai dikerjakan dan dinyatakan oleh PIHAK PERTAMA.',
      '3. Pembayaran dilakukan oleh PIHAK PERTAMA kepada PIHAK KEDUA dalam waktu selambat-lambatnya 30 (tiga puluh) hari kerja setelah pekerjaan borongan tersebut selesai dikerjakan dan dinyatakan oleh PIHAK PERTAMA.',

      { text: 'Pasal 8 - PEMBAYARAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      'Dalam hal terjadi perselisihan antara kedua belah pihak dalam pelaksanaan Perjanjian ini, maka kedua belah pihak sepakat untuk menyelesaikan perselisihan tersebut secara musyawarah untuk mufakat (democratic resolution).',
      'Apabila kedua belah pihak tidak dapat mencapai mufakat dalam menyelesaikan perselisihan tersebut, maka kedua belah pihak sepakat untuk menyelesaikan perselisihan tersebut melalui jalur hukum yang berlaku.',

      { text: 'Pasal 9 - PENGAKHIRAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. Perjanjian ini akan berakhir dengan sendirinya (mature) setelah seluruh pekerjaan borongan tersebut selesai dikerjakan dan sudah dinyatakan oleh PIHAK PERTAMA, serta pembayaran sudah lunas.',
      '2. Selanjutnya, kedua belah pihak sepakat untuk tidak akan ada tuntutan maupun gugatan lebih lanjut setelah perjanjian ini berakhir.',

      { text: 'Pasal 10 - KETENTUAN LAIN-LAIN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. Perjanjian ini berlaku sejak tanggal penandatanganan kedua belah pihak dan berakhir setelah memenuhi ketentuan yang telah ditetapkan dalam pasal 9 (sembilan) Perjanjian ini.',
      '2. Dalam hal terdapat ketentuan-ketentuan lain yang belum diatur dalam Perjanjian ini, maka akan diatur kemudian melalui Addendum (perjanjian tambahan) yang dibuat oleh kedua belah pihak.',

      { text: 'Pasal 11 - PENGAKHIRAN', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      'Perjanjian ini akan berakhir secara otomatis setelah seluruh pekerjaan borongan tersebut selesai dikerjakan dan sudah dinyatakan oleh PIHAK PERTAMA, serta pembayaran sudah lunas.',

      { text: 'Pasal 12 - FORCE MAJEURE', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. PIHAK KEDUA dibebaskan dari kewajiban penyelesaian pekerjaan borongan tersebut apabila terjadi keadaan memaksa (force majeure) yang diluar kemampuan PIHAK KEDUA, seperti bencana alam, perang, huru hara, kebijakan pemerintah, atau kejadian-kejadian lain yang diluar kemampuan dan kontrol kedua belah pihak.',
      '2. Apabila terjadi keadaan memaksa (force majeure), maka kedua belah pihak sepakat untuk menghentikan sementara pelaksanaan pekerjaan borongan tersebut dan akan dilanjutkan kembali setelah keadaan tersebut telah berakhir.',

      { text: 'Pasal 13 - PENUTUP', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      '1. Perjanjian ini berlaku selama masa pekerjaan borongan tersebut dan akan berakhir setelah memenuhi ketentuan yang sudah ditetapkan dalam pasal 9 (sembilan) Perjanjian ini.',
      '2. Dalam hal terdapat ketentuan-ketentuan lain yang belum diatur dalam Perjanjian ini, maka akan diatur kemudian melalui Addendum (perjanjian tambahan) yang dibuat oleh kedua belah pihak.',
      { text: 'Medan, 10 September 2023', fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      {
        absolutePosition: { x: 40, y: 650 },
        table: {
          Headers: [
            {
              text: 'PIHAK PERTAMA',
            },
            {
              text: 'PIHAK KEDUA',
            },
          ],
          widths: ['*', '*'],
          heights: [100],
          body: [
            [
              {
                text: 'PIHAK PERTAMA \n\n\n\n\n\n EKA SANTI',
                alignment: 'left',
                margin: [0, 0, 0, 0],
                border: [true, true, false, true],
              },
              {
                text: 'PIHAK KEDUA \n\n\n\n\n\n TURIS',
                margin: [0, 0, 0, 0],
                border: [false, true, true, true],
              },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      date: {
        alignment: 'center',
        fontSize: 12,
        italics: true,
        margin: [0, 0, 0, 10],
      },
      list: {
        fontSize: 12,
        margin: [0, 0, 0, 10],
      },
      signature: {
        fontSize: 14,
        italics: true,
        alignment: 'center',
        margin: [0, 10, 0, 10],
      },
    },
  };

  return new Promise((resolve, reject) => {
    const pdfGenerator = pdfMake.createPdf(docDefinition);
    pdfGenerator.getBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    });
    pdfGenerator.download();
  });
}
