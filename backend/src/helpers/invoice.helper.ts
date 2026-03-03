import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

/**
 * Format angka ke Rupiah: Rp 1.234.567
 */
const formatRupiah = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `Rp ${num.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;
};

/**
 * Format tanggal ke "3 Maret 2026"
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Generate invoice PDF untuk order tertentu.
 * PDF berisi detail pesanan, item-item, dan gambar bukti bayar (jika ada).
 * File disimpan di direktori uploads/invoices/ dengan nama {orderNumber}.pdf
 */
export const generateInvoicePDF = async (orderId: string): Promise<{ filePath: string; fileName: string }> => {
  // Fetch order lengkap
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) {
    throw new AppError('Pesanan tidak ditemukan.', 404);
  }

  // Buat direktori invoices jika belum ada
  const invoiceDir = path.join(env.UPLOAD_DIR, 'invoices');
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const fileName = `${order.orderNumber}.pdf`;
  const filePath = path.join(invoiceDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    const pageWidth = doc.page.width - 100; // 50 margin each side

    // ═══ HEADER ═══
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#2d6a4f')
      .text('INVOICE', 50, 50, { align: 'center' });

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#555')
      .text(env.BANK_ACCOUNT_NAME, 50, 78, { align: 'center' });

    // Garis pemisah
    doc
      .moveTo(50, 100)
      .lineTo(50 + pageWidth, 100)
      .strokeColor('#2d6a4f')
      .lineWidth(2)
      .stroke();

    // ═══ INFO INVOICE & PELANGGAN ═══
    let yPos = 120;

    // Kolom kiri: Info Invoice
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333');
    doc.text('No. Invoice', 50, yPos);
    doc.font('Helvetica').text(`: ${order.orderNumber}`, 150, yPos);

    yPos += 18;
    doc.font('Helvetica-Bold').text('Tanggal', 50, yPos);
    doc.font('Helvetica').text(`: ${formatDate(order.createdAt)}`, 150, yPos);

    yPos += 18;
    doc.font('Helvetica-Bold').text('Status', 50, yPos);

    const statusMap: Record<string, string> = {
      PENDING: 'Menunggu Pembayaran',
      CONFIRMED: 'Pembayaran Dikonfirmasi',
      PROCESSING: 'Sedang Diproses',
      SHIPPED: 'Sedang Dikirim',
      DONE: 'Selesai',
      CANCELLED: 'Dibatalkan',
    };
    doc.font('Helvetica').text(`: ${statusMap[order.status] || order.status}`, 150, yPos);

    if (order.paidAt) {
      yPos += 18;
      doc.font('Helvetica-Bold').text('Dibayar', 50, yPos);
      doc.font('Helvetica').text(`: ${formatDate(order.paidAt)}`, 150, yPos);
    }

    // Kolom kanan: Info Pelanggan
    let yRight = 120;
    const rightCol = 320;

    doc.fontSize(10).font('Helvetica-Bold').fillColor('#2d6a4f');
    doc.text('DIKIRIM KEPADA:', rightCol, yRight);

    yRight += 18;
    doc.font('Helvetica-Bold').fillColor('#333').text(order.shippingName, rightCol, yRight);
    yRight += 15;
    doc.font('Helvetica').text(order.shippingPhone, rightCol, yRight);
    yRight += 15;
    doc.font('Helvetica').text(order.shippingAddress, rightCol, yRight, { width: 220 });

    yPos = Math.max(yPos, yRight) + 40;

    // ═══ TIPE PEMBELI ═══
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#2d6a4f');
    doc.text(`Tipe: ${order.buyerType === 'RESELLER' ? 'Reseller' : 'Konsumen'}`, 50, yPos);
    yPos += 20;

    // ═══ TABEL ITEM ═══
    // Header tabel
    const colX = { no: 50, name: 75, qty: 310, price: 370, subtotal: 460 };

    doc
      .rect(50, yPos, pageWidth, 22)
      .fillAndStroke('#2d6a4f', '#2d6a4f');

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
    doc.text('No', colX.no + 5, yPos + 6);
    doc.text('Produk', colX.name + 5, yPos + 6);
    doc.text('Qty', colX.qty + 5, yPos + 6);
    doc.text('Harga', colX.price + 5, yPos + 6);
    doc.text('Subtotal', colX.subtotal + 5, yPos + 6);

    yPos += 22;

    // Baris item
    doc.font('Helvetica').fontSize(9).fillColor('#333');
    order.items.forEach((item, index) => {
      const rowBg = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
      doc.rect(50, yPos, pageWidth, 20).fill(rowBg);

      doc.fillColor('#333');
      doc.text(`${index + 1}`, colX.no + 5, yPos + 5);
      doc.text(item.productName, colX.name + 5, yPos + 5, { width: 225 });
      doc.text(`${item.quantity}`, colX.qty + 5, yPos + 5);
      doc.text(formatRupiah(Number(item.price)), colX.price + 5, yPos + 5);
      doc.text(formatRupiah(Number(item.subtotal)), colX.subtotal + 5, yPos + 5);

      yPos += 20;
    });

    // Garis bawah tabel
    doc.moveTo(50, yPos).lineTo(50 + pageWidth, yPos).strokeColor('#ccc').lineWidth(1).stroke();

    // ═══ RINGKASAN HARGA ═══
    yPos += 15;
    const summaryX = 370;
    const summaryValX = 460;

    doc.font('Helvetica').fontSize(10).fillColor('#333');
    doc.text('Subtotal', summaryX, yPos);
    doc.text(formatRupiah(Number(order.subtotal)), summaryValX, yPos);

    yPos += 18;
    doc.text('Ongkos Kirim', summaryX, yPos);
    doc.text(formatRupiah(Number(order.shippingCost)), summaryValX, yPos);

    if (Number(order.discountAmount) > 0) {
      yPos += 18;
      doc.fillColor('#e63946');
      doc.text('Diskon', summaryX, yPos);
      doc.text(`-${formatRupiah(Number(order.discountAmount))}`, summaryValX, yPos);

      if (order.voucherCode) {
        yPos += 14;
        doc.fontSize(8).fillColor('#888');
        doc.text(`Voucher: ${order.voucherCode}`, summaryX, yPos);
      }
    }

    yPos += 22;
    doc.moveTo(summaryX, yPos).lineTo(50 + pageWidth, yPos).strokeColor('#2d6a4f').lineWidth(1.5).stroke();

    yPos += 8;
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#2d6a4f');
    doc.text('TOTAL', summaryX, yPos);
    doc.text(formatRupiah(Number(order.total)), summaryValX, yPos);

    // ═══ CATATAN ═══
    if (order.notes) {
      yPos += 35;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#333');
      doc.text('Catatan:', 50, yPos);
      yPos += 15;
      doc.font('Helvetica').fontSize(9).fillColor('#555');
      doc.text(order.notes, 50, yPos, { width: pageWidth });
      yPos += doc.heightOfString(order.notes, { width: pageWidth });
    }

    // ═══ BUKTI BAYAR (gambar yang diupload) ═══
    if (order.paymentProofUrl) {
      const imagePath = path.join(
        env.UPLOAD_DIR,
        path.basename(order.paymentProofUrl),
      );

      if (fs.existsSync(imagePath)) {
        // Cek apakah perlu halaman baru
        if (yPos + 280 > doc.page.height - 80) {
          doc.addPage();
          yPos = 50;
        } else {
          yPos += 30;
        }

        doc.font('Helvetica-Bold').fontSize(10).fillColor('#2d6a4f');
        doc.text('Bukti Pembayaran:', 50, yPos);
        yPos += 18;

        // Gambar bukti bayar, max lebar 250px
        try {
          doc.image(imagePath, 50, yPos, {
            fit: [250, 250],
          });
          yPos += 260;
        } catch {
          doc.font('Helvetica').fontSize(9).fillColor('#888');
          doc.text('(Gambar bukti bayar tidak dapat dimuat)', 50, yPos);
          yPos += 15;
        }
      }
    }

    // ═══ INFO PEMBAYARAN ═══
    const bankInfoY = doc.page.height - 100;
    doc.moveTo(50, bankInfoY - 10).lineTo(50 + pageWidth, bankInfoY - 10).strokeColor('#eee').lineWidth(1).stroke();

    doc.font('Helvetica-Bold').fontSize(9).fillColor('#2d6a4f');
    doc.text('Informasi Pembayaran:', 50, bankInfoY);
    doc.font('Helvetica').fontSize(9).fillColor('#555');
    doc.text(`Bank ${env.BANK_NAME} — ${env.BANK_ACCOUNT_NUMBER} a.n. ${env.BANK_ACCOUNT_NAME}`, 50, bankInfoY + 14);

    doc.fontSize(8).fillColor('#aaa');
    doc.text(`Dicetak pada ${formatDate(new Date())}`, 50, bankInfoY + 32, { align: 'center' });

    // Finalize PDF
    doc.end();

    writeStream.on('finish', () => {
      resolve({ filePath, fileName });
    });

    writeStream.on('error', (err) => {
      reject(new AppError(`Gagal membuat invoice PDF: ${err.message}`, 500));
    });
  });
};
