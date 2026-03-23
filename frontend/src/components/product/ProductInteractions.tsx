'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import PriceDisplay from '@/components/product/PriceDisplay';
import ReviewCard from '@/components/product/ReviewCard';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import { formatRupiah } from '@/lib/formatters';
import type { Product, Review } from '@/app/products/[slug]/page';
import { FruitIcon } from '@/components/ui/icons';

interface ProductInteractionsProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}

export default function ProductInteractions({
  product,
  reviews: initialReviews,
  relatedProducts,
}: ProductInteractionsProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [priceMode, setPriceMode] = useState<'consumer' | 'reseller'>(
    'consumer',
  );
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewOrderId, setReviewOrderId] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  // Fetch reviews (client-side untuk update realtime setelah submit)
  const { data: reviews } = useQuery({
    queryKey: ['reviews', product.id],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${product.id}`);
      return data.data as Review[];
    },
    initialData: initialReviews,
  });

  // Fetch eligible orders untuk form review
  const { data: eligibleOrders } = useQuery({
    queryKey: ['eligible-review-orders', product.id],
    queryFn: async () => {
      const { data } = await api.get('/orders?status=DONE');
      const orders = data.data || [];
      return orders.filter((o: { items?: { productId: string }[] }) =>
        o.items?.some(
          (item: { productId: string }) => item.productId === product.id,
        ),
      );
    },
    enabled: isAuthenticated,
  });

  // Submit review
  const reviewMutation = useMutation({
    mutationFn: async () => {
      await api.post('/reviews', {
        productId: product.id,
        orderId: reviewOrderId,
        rating: reviewRating,
        comment: reviewComment || null,
      });
    },
    onSuccess: () => {
      toast('Review berhasil ditambahkan!', 'success');
      setReviewComment('');
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ['reviews', product.id] });
    },
    onError: () => {
      toast('Gagal menambahkan review', 'error');
    },
  });

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast('Silakan login terlebih dahulu', 'warning');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast('Berhasil ditambahkan ke keranjang!', 'success');
    } catch {
      toast('Gagal menambahkan ke keranjang', 'error');
    }
  };

  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.images || []).filter(
      (img: string) => img && !img.startsWith('blob:'),
    ),
  ];

  return (
    <>
      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-g6 rounded-3xl overflow-hidden border border-faint mb-3">
            {allImages[activeImage] ? (
              <Image
                src={allImages[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl text-g2">
                <FruitIcon className="w-20 h-20" />
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === idx
                      ? 'border-g1 shadow-md'
                      : 'border-faint hover:border-g4'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Badge variant="green" size="sm" className="mb-3">
              {product.category.name}
            </Badge>
          )}
          <h1 className="font-lora text-3xl font-semibold text-ink mb-3">
            {product.name}
          </h1>

          {product.avgRating && product.avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.avgRating} size="md" />
              <span className="text-sm text-muted">
                ({product.reviewCount} ulasan)
              </span>
            </div>
          )}

          {/* Price Mode Toggle */}
          <div className="flex bg-g6 rounded-full p-1 max-w-xs mb-4">
            <button
              onClick={() => setPriceMode('consumer')}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                priceMode === 'consumer'
                  ? 'bg-g1 text-white shadow-sm'
                  : 'text-muted'
              }`}
            >
              Konsumen
            </button>
            <button
              onClick={() => setPriceMode('reseller')}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                priceMode === 'reseller'
                  ? 'bg-g1 text-white shadow-sm'
                  : 'text-muted'
              }`}
            >
              Reseller
            </button>
          </div>

          <PriceDisplay
            consumerPrice={product.priceConsumer}
            resellerPrice={product.priceReseller}
            unit={product.unit}
            showBoth
            activeType={priceMode}
            size="lg"
          />

          {priceMode === 'reseller' && (
            <p className="text-xs text-muted mt-2">
              Min. order: {product.minOrderReseller} {product.unit}
            </p>
          )}

          <p className="text-sm text-muted leading-relaxed mt-6 mb-8">
            {product.description}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag: string) => (
                <Badge key={tag} variant="gray" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-faint rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg hover:bg-g6 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-bold text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg hover:bg-g6 transition-colors"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="lg"
              className="flex-1"
            >
              {product.stock === 0
                ? 'Stok Habis'
                : `Tambah ke Keranjang — ${formatRupiah(
                    (priceMode === 'reseller'
                      ? product.priceReseller
                      : product.priceConsumer) * quantity,
                  )}`}
            </Button>
          </div>

          <p className="text-xs text-muted">
            Stok: {product.stock} {product.unit}
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="font-lora text-2xl font-semibold text-ink mb-6">
            Produk Terkait
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <a
                key={rp.id}
                href={`/products/${rp.slug}`}
                className="bg-white rounded-2xl border border-faint overflow-hidden hover:shadow-md transition-all group no-underline"
              >
                <div className="relative aspect-square bg-g6">
                  {rp.imageUrl ? (
                    <Image
                      src={rp.imageUrl}
                      alt={rp.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-g2">
                      <FruitIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  {rp.category && (
                    <span className="text-[0.65rem] font-bold text-g2 uppercase tracking-wider">
                      {rp.category.name}
                    </span>
                  )}
                  <p className="text-sm font-bold text-ink mt-1 line-clamp-1">
                    {rp.name}
                  </p>
                  <p className="text-sm font-extrabold text-g1 mt-1">
                    {formatRupiah(rp.priceConsumer)}
                    <span className="text-xs text-muted font-normal">
                      /{rp.unit}
                    </span>
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section>
        <h2 className="font-lora text-2xl font-semibold text-ink mb-6">
          Ulasan Pelanggan
        </h2>

        {/* Review Form */}
        {isAuthenticated && eligibleOrders && eligibleOrders.length > 0 && (
          <div className="bg-white rounded-3xl border border-faint p-6 mb-8">
            <h3 className="font-bold text-ink mb-4">Tulis Ulasan</h3>
            <div className="mb-4">
              <span className="text-sm text-muted font-semibold block mb-1.5">
                Pesanan:
              </span>
              <select
                value={reviewOrderId}
                onChange={(e) => setReviewOrderId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-faint text-sm focus:outline-none focus:border-g3 transition-colors"
              >
                <option value="">Pilih pesanan...</option>
                {eligibleOrders.map(
                  (o: { id: string; orderNumber: string }) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted font-semibold">Rating:</span>
              <StarRating
                rating={reviewRating}
                interactive
                onChange={setReviewRating}
              />
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Bagikan pengalaman kamu..."
              className="w-full px-4 py-3 rounded-2xl border border-faint text-sm resize-none h-24 mb-4 focus:outline-none focus:border-g3 transition-colors"
            />
            <Button
              onClick={() => {
                if (!reviewOrderId) {
                  toast('Pilih pesanan terlebih dahulu', 'warning');
                  return;
                }
                reviewMutation.mutate();
              }}
              isLoading={reviewMutation.isPending}
            >
              Kirim Ulasan
            </Button>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="text-center text-muted py-8">
              Belum ada ulasan untuk produk ini
            </p>
          )}
        </div>
      </section>
    </>
  );
}
