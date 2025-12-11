<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-4xl font-bold mb-8">ชำระเงิน</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items & Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Cart Items -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">รายการสินค้า</h2>
            <div v-if="cart.length" class="space-y-4">
              <div
                v-for="(item, index) in cart"
                :key="index"
                class="flex gap-4 border-b pb-4 last:border-b-0"
              >
                <img
                  :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/100'"
                  :alt="item.item?.name"
                  class="w-20 h-20 object-cover rounded"
                />
                <div class="flex-1">
                  <h3 class="font-semibold">{{ item.item?.name }}</h3>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
                  </p>
                  <p class="text-sm text-gray-600">จำนวน: {{ item.quantity }} | {{ item.days }} วัน</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-blue-600">{{ item.totalPrice }} ฿</p>
                  <button
                    @click="removeFromCart(index)"
                    class="text-red-600 hover:text-red-800 text-sm mt-2"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500 text-center py-4">ตะกร้าว่างเปล่า</p>
          </div>

          <!-- Delivery Info -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">ข้อมูลการจัดส่ง</h2>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่จัดส่ง *</label>
                <textarea
                  v-model="form.deliveryAddress"
                  required
                  rows="3"
                  class="w-full px-4 py-2 border rounded-lg"
                  placeholder="กรอกที่อยู่สำหรับจัดส่ง"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  required
                  class="w-full px-4 py-2 border rounded-lg"
                  placeholder="0812345678"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                <textarea
                  v-model="form.notes"
                  rows="2"
                  class="w-full px-4 py-2 border rounded-lg"
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                ></textarea>
              </div>
            </form>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">วิธีการชำระเงิน</h2>
            <div class="space-y-3">
              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="CASH"
                  class="mr-3"
                />
                <div>
                  <p class="font-semibold">เงินสด</p>
                  <p class="text-sm text-gray-600">ชำระเงินสดเมื่อรับสินค้า</p>
                </div>
              </label>
              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="TRANSFER"
                  class="mr-3"
                />
                <div>
                  <p class="font-semibold">โอนเงิน</p>
                  <p class="text-sm text-gray-600">โอนเงินผ่านธนาคาร</p>
                </div>
              </label>
              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="CREDIT_CARD"
                  class="mr-3"
                />
                <div>
                  <p class="font-semibold">บัตรเครดิต</p>
                  <p class="text-sm text-gray-600">ชำระผ่านบัตรเครดิต/เดบิต</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-2xl font-bold mb-4">สรุปคำสั่งเช่า</h2>
            <div class="space-y-3 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-600">ราคาเช่า</span>
                <span class="font-semibold">{{ totalPrice }} ฿</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">ค่ามัดจำ</span>
                <span class="font-semibold">{{ totalDeposit }} ฿</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">ค่าจัดส่ง</span>
                <span class="font-semibold">{{ deliveryFee }} ฿</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-green-600">
                <span>ส่วนลด</span>
                <span class="font-semibold">-{{ discount }} ฿</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold">รวมทั้งหมด</span>
                  <span class="text-2xl font-bold text-blue-600">{{ grandTotal }} ฿</span>
                </div>
              </div>
            </div>

            <!-- Coupon -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">รหัสคูปอง</label>
              <div class="flex gap-2">
                <input
                  v-model="couponCode"
                  type="text"
                  class="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="กรอกรหัสคูปอง"
                />
                <button
                  @click="applyCoupon"
                  class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  ใช้
                </button>
              </div>
            </div>

            <button
              @click="submitOrder"
              :disabled="!cart.length || !form.deliveryAddress || !form.paymentMethod || loading"
              class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {{ loading ? 'กำลังดำเนินการ...' : 'ยืนยันการเช่า' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { rentalsAPI, promotionsAPI } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const cart = ref([]);
const loading = ref(false);
const couponCode = ref('');
const discount = ref(0);

const form = ref({
  deliveryAddress: '',
  phoneNumber: '',
  notes: '',
  paymentMethod: 'CASH',
});

const deliveryFee = 100;

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.totalPrice, 0);
});

const totalDeposit = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.item?.depositAmount || 0) * item.quantity, 0);
});

const grandTotal = computed(() => {
  return totalPrice.value + totalDeposit.value + deliveryFee - discount.value;
});

onMounted(() => {
  loadCart();
});

const loadCart = () => {
  const stored = localStorage.getItem('cart');
  cart.value = stored ? JSON.parse(stored) : [];
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const applyCoupon = async () => {
  if (!couponCode.value) return;
  try {
    const response = await promotionsAPI.validateCoupon(couponCode.value);
    if (response.data.valid) {
      discount.value = response.data.discountAmount || 0;
      alert('ใช้คูปองสำเร็จ');
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    alert('รหัสคูปองไม่ถูกต้อง');
  }
};

const submitOrder = async () => {
  if (!user) {
    alert('กรุณาเข้าสู่ระบบก่อนทำการเช่า');
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    const orderData = {
      userId: user.id,
      items: cart.value.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        startDate: item.startDate,
        endDate: item.endDate,
        pricePerDay: item.item.pricePerDay,
      })),
      deliveryAddress: form.value.deliveryAddress,
      phoneNumber: form.value.phoneNumber,
      notes: form.value.notes,
      paymentMethod: form.value.paymentMethod,
      totalPrice: totalPrice.value,
      depositAmount: totalDeposit.value,
    };

    const response = await rentalsAPI.create(orderData);
    localStorage.removeItem('cart');
    alert('สร้างคำสั่งเช่าสำเร็จ');
    router.push(`/rentals/${response.data.id}`);
  } catch (error) {
    console.error('Error creating rental:', error);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
