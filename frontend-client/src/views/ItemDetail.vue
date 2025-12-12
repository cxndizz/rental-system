<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <div v-if="loading" class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">กำลังโหลดข้อมูล...</div>

      <div v-else-if="item" class="space-y-6">
        <div class="glass-card overflow-hidden rounded-3xl border-white/10 shadow-2xl">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 p-6 md:p-10">
            <div class="space-y-4">
              <div class="relative overflow-hidden rounded-3xl">
                <img :src="currentImage" :alt="item.name" class="h-96 w-full rounded-3xl object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10" />
                <span class="pill absolute left-4 top-4 border-white/20 bg-white/10 text-xs text-slate-100">{{ item.category?.name || 'Luxury Item' }}</span>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <img
                  v-for="(media, index) in item.media"
                  :key="index"
                  :src="media.url"
                  :alt="`${item.name} - ${index + 1}`"
                  class="h-20 w-full cursor-pointer rounded-xl object-cover transition hover:opacity-80"
                  :class="{ 'ring-2 ring-amber-300': currentImage === media.url }"
                  @click="currentImage = media.url"
                />
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Premium Item</p>
                <h1 class="text-3xl font-bold leading-tight">{{ item.name }}</h1>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <span class="text-amber-200">⭐ {{ item.averageRating?.toFixed(1) || 'N/A' }}</span>
                  <span>({{ item.reviewCount || 0 }} รีวิว)</span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-end gap-3">
                  <span class="text-4xl font-extrabold text-amber-200">{{ item.pricePerDay }} ฿/วัน</span>
                  <span class="text-sm text-slate-300">+ {{ item.depositAmount }} ฿ มัดจำ</span>
                </div>
                <p class="text-slate-200">{{ item.description }}</p>
              </div>

              <div class="flex flex-wrap gap-3 text-sm text-slate-300">
                <span class="pill border-white/10 bg-white/5">สถานะ: {{ item.status === 'AVAILABLE' ? 'พร้อมให้เช่า' : 'ไม่พร้อมให้เช่า' }}</span>
                <span class="pill border-white/10 bg-white/5">หมวดหมู่: {{ item.category?.name }}</span>
                <span class="pill border-white/10 bg-white/5">จำนวนคงเหลือ: {{ item.quantity }}</span>
              </div>

              <div v-if="item.status === 'AVAILABLE'" class="glass-card rounded-2xl border-white/10 p-4">
                <h3 class="text-xl font-semibold text-white">เช่าสินค้านี้</h3>
                <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div class="space-y-2">
                    <label class="text-sm text-slate-300">วันที่เริ่มเช่า</label>
                    <input
                      v-model="rentalForm.startDate"
                      type="date"
                      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
                      :min="minDate"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-slate-300">วันที่สิ้นสุด</label>
                    <input
                      v-model="rentalForm.endDate"
                      type="date"
                      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
                      :min="rentalForm.startDate || minDate"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-slate-300">จำนวน</label>
                    <input
                      v-model.number="rentalForm.quantity"
                      type="number"
                      min="1"
                      :max="item.quantity"
                      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p class="text-sm text-slate-300">จำนวนวัน: <span class="font-semibold text-white">{{ totalDays }}</span></p>
                    <p class="text-xl font-bold text-amber-200">ราคารวม: {{ totalPrice }} ฿</p>
                  </div>
                </div>
                <button
                  @click="addToCart"
                  class="primary-btn mt-4 w-full justify-center"
                  :disabled="!rentalForm.startDate || !rentalForm.endDate"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-3xl border-white/10 p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-amber-200">Voices</p>
              <h2 class="text-2xl font-bold text-white">รีวิวจากผู้ใช้</h2>
            </div>
            <span class="pill border-white/10 bg-white/5 text-xs text-slate-200">{{ reviews.length }} รีวิว</span>
          </div>
          <div v-if="reviews.length" class="mt-4 space-y-4">
            <div v-for="review in reviews" :key="review.id" class="glass-card rounded-2xl border-white/5 p-4">
              <div class="flex items-center justify-between">
                <span class="text-amber-200">⭐ {{ review.rating }}/5</span>
                <span class="text-sm text-slate-300">{{ formatDate(review.createdAt) }}</span>
              </div>
              <p class="mt-2 text-slate-200">{{ review.comment }}</p>
            </div>
          </div>
          <p v-else class="py-6 text-center text-slate-300">ยังไม่มีรีวิว</p>
        </div>
      </div>

      <div v-else class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">ไม่พบข้อมูลสินค้า</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { itemsAPI, reviewsAPI } from '@/services/api';

const route = useRoute();
const router = useRouter();

const item = ref(null);
const reviews = ref([]);
const loading = ref(false);
const currentImage = ref('');

const rentalForm = ref({
  startDate: '',
  endDate: '',
  quantity: 1,
});

const minDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0];
});

const totalDays = computed(() => {
  if (!rentalForm.value.startDate || !rentalForm.value.endDate) return 0;
  const start = new Date(rentalForm.value.startDate);
  const end = new Date(rentalForm.value.endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
});

const totalPrice = computed(() => {
  if (!item.value) return 0;
  return totalDays.value * item.value.pricePerDay * rentalForm.value.quantity;
});

onMounted(async () => {
  await loadItem();
  await loadReviews();
});

const loadItem = async () => {
  loading.value = true;
  try {
    const response = await itemsAPI.getById(route.params.id);
    item.value = response.data;
    currentImage.value = item.value.media?.[0]?.url || 'https://via.placeholder.com/600';
  } catch (error) {
    console.error('Error loading item:', error);
  } finally {
    loading.value = false;
  }
};

const loadReviews = async () => {
  try {
    const response = await reviewsAPI.getItemReviews(route.params.id, { limit: 10 });
    reviews.value = response.data.reviews;
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
};

const addToCart = () => {
  const cartItem = {
    itemId: item.value.id,
    item: item.value,
    startDate: rentalForm.value.startDate,
    endDate: rentalForm.value.endDate,
    quantity: rentalForm.value.quantity,
    days: totalDays.value,
    totalPrice: totalPrice.value,
  };

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(cartItem);
  localStorage.setItem('cart', JSON.stringify(cart));

  alert('เพิ่มลงตะกร้าเรียบร้อยแล้ว');
  router.push('/checkout');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
