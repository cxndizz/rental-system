<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="item" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <!-- Image Gallery -->
          <div>
            <img
              :src="currentImage"
              :alt="item.name"
              class="w-full h-96 object-cover rounded-lg mb-4"
            />
            <div class="grid grid-cols-4 gap-2">
              <img
                v-for="(media, index) in item.media"
                :key="index"
                :src="media.url"
                :alt="`${item.name} - ${index + 1}`"
                class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition"
                :class="{ 'ring-2 ring-blue-600': currentImage === media.url }"
                @click="currentImage = media.url"
              />
            </div>
          </div>

          <!-- Item Details -->
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ item.name }}</h1>
            <div class="flex items-center mb-4">
              <span class="text-yellow-500 text-lg">⭐ {{ item.averageRating?.toFixed(1) || 'N/A' }}</span>
              <span class="text-gray-500 ml-2">({{ item.reviewCount || 0 }} รีวิว)</span>
            </div>

            <div class="mb-6">
              <span class="text-3xl font-bold text-blue-600">{{ item.pricePerDay }} ฿/วัน</span>
              <span class="text-gray-500 ml-2">+ {{ item.depositAmount }} ฿ มัดจำ</span>
            </div>

            <div class="mb-6">
              <p class="text-gray-700">{{ item.description }}</p>
            </div>

            <div class="mb-6">
              <p class="text-sm text-gray-600 mb-2">
                <span class="font-semibold">สถานะ:</span>
                <span :class="item.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'">
                  {{ item.status === 'AVAILABLE' ? 'พร้อมให้เช่า' : 'ไม่พร้อมให้เช่า' }}
                </span>
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-semibold">หมวดหมู่:</span> {{ item.category?.name }}
              </p>
            </div>

            <!-- Rental Form -->
            <div v-if="item.status === 'AVAILABLE'" class="border-t pt-6">
              <h3 class="text-xl font-semibold mb-4">เช่าสินค้านี้</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มเช่า</label>
                  <input
                    v-model="rentalForm.startDate"
                    type="date"
                    class="w-full px-4 py-2 border rounded-lg"
                    :min="minDate"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                  <input
                    v-model="rentalForm.endDate"
                    type="date"
                    class="w-full px-4 py-2 border rounded-lg"
                    :min="rentalForm.startDate || minDate"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
                  <input
                    v-model.number="rentalForm.quantity"
                    type="number"
                    min="1"
                    :max="item.quantity"
                    class="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">
                    จำนวนวัน: <span class="font-semibold">{{ totalDays }}</span>
                  </p>
                  <p class="text-lg font-bold text-blue-600 mt-2">
                    ราคารวม: {{ totalPrice }} ฿
                  </p>
                </div>
                <button
                  @click="addToCart"
                  class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  :disabled="!rentalForm.startDate || !rentalForm.endDate"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="border-t p-8">
          <h2 class="text-2xl font-bold mb-6">รีวิวจากผู้ใช้</h2>
          <div v-if="reviews.length" class="space-y-4">
            <div
              v-for="review in reviews"
              :key="review.id"
              class="border-b pb-4 last:border-b-0"
            >
              <div class="flex items-center mb-2">
                <span class="text-yellow-500">⭐ {{ review.rating }}/5</span>
                <span class="text-gray-600 ml-4 text-sm">{{ formatDate(review.createdAt) }}</span>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-4">ยังไม่มีรีวิว</p>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">ไม่พบข้อมูลสินค้า</p>
      </div>
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
