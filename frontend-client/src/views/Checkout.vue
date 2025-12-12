<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Secure Checkout</p>
          <h1 class="text-4xl font-bold leading-tight">ชำระเงิน</h1>
          <p class="text-slate-300">ยืนยันคำสั่งเช่าในประสบการณ์ระดับ Luxury พร้อมความปลอดภัยแบบเอ็นเตอร์ไพรส์</p>
        </div>
        <div class="glass-card rounded-2xl border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
          ขั้นตอนสุดท้ายก่อนยืนยันคำสั่งเช่า
        </div>
      </header>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <div class="glass-card rounded-3xl border-white/10 p-6 shadow-2xl">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">รายการสินค้า</h2>
              <span class="pill border-white/10 bg-white/5 text-xs text-slate-200">{{ cart.length }} รายการ</span>
            </div>
            <div v-if="cart.length" class="mt-4 space-y-4">
              <div
                v-for="(item, index) in cart"
                :key="index"
                class="glass-card flex gap-4 rounded-2xl border-white/5 p-4"
              >
                <img
                  :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/100'"
                  :alt="item.item?.name"
                  class="h-20 w-20 rounded-xl object-cover"
                />
                <div class="flex-1 space-y-1">
                  <h3 class="text-lg font-semibold text-white">{{ item.item?.name }}</h3>
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
                  </p>
                  <p class="text-sm text-slate-300">จำนวน: {{ item.quantity }} | {{ item.days }} วัน</p>
                </div>
                <div class="text-right space-y-2">
                  <p class="text-xl font-bold text-amber-200">{{ item.totalPrice }} ฿</p>
                  <button @click="removeFromCart(index)" class="text-sm text-slate-300 hover:text-amber-200">ลบ</button>
                </div>
              </div>
            </div>
            <p v-else class="py-6 text-center text-slate-300">ตะกร้าว่างเปล่า</p>
          </div>

          <div class="glass-card rounded-3xl border-white/10 p-6 shadow-2xl">
            <h2 class="text-2xl font-semibold">ข้อมูลการจัดส่ง</h2>
            <form class="mt-4 grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-200">ที่อยู่จัดส่ง *</label>
                <textarea
                  v-model="form.deliveryAddress"
                  required
                  rows="3"
                  class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
                  placeholder="กรอกที่อยู่สำหรับจัดส่ง"
                ></textarea>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-200">เบอร์โทรศัพท์ *</label>
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  required
                  class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
                  placeholder="0812345678"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-200">หมายเหตุ</label>
                <textarea
                  v-model="form.notes"
                  rows="2"
                  class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                ></textarea>
              </div>
            </form>
          </div>

          <div class="glass-card rounded-3xl border-white/10 p-6 shadow-2xl">
            <h2 class="text-2xl font-semibold">วิธีการชำระเงิน</h2>
            <div class="mt-4 space-y-3">
              <label class="glass-card flex cursor-pointer items-center gap-3 rounded-2xl border-white/10 p-4 hover:border-amber-200/40">
                <input v-model="form.paymentMethod" type="radio" value="CASH" class="accent-amber-300" />
                <div>
                  <p class="font-semibold text-white">เงินสด</p>
                  <p class="text-sm text-slate-300">ชำระเงินสดเมื่อรับสินค้า</p>
                </div>
              </label>
              <label class="glass-card flex cursor-pointer items-center gap-3 rounded-2xl border-white/10 p-4 hover:border-amber-200/40">
                <input v-model="form.paymentMethod" type="radio" value="TRANSFER" class="accent-amber-300" />
                <div>
                  <p class="font-semibold text-white">โอนเงิน</p>
                  <p class="text-sm text-slate-300">โอนเงินผ่านธนาคาร</p>
                </div>
              </label>
              <label class="glass-card flex cursor-pointer items-center gap-3 rounded-2xl border-white/10 p-4 hover:border-amber-200/40">
                <input v-model="form.paymentMethod" type="radio" value="CREDIT_CARD" class="accent-amber-300" />
                <div>
                  <p class="font-semibold text-white">บัตรเครดิต</p>
                  <p class="text-sm text-slate-300">ชำระผ่านบัตรเครดิต/เดบิต</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="glass-card sticky top-6 rounded-3xl border-white/10 p-6 shadow-2xl">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">สรุปคำสั่งเช่า</h2>
              <span class="pill border-amber-300/50 bg-amber-300/10 text-amber-100">ตรวจสอบ</span>
            </div>
            <div class="mt-4 space-y-3">
              <div class="flex justify-between text-sm text-slate-300">
                <span>ราคาเช่า</span>
                <span class="font-semibold text-white">{{ totalPrice }} ฿</span>
              </div>
              <div class="flex justify-between text-sm text-slate-300">
                <span>ค่ามัดจำ</span>
                <span class="font-semibold text-white">{{ totalDeposit }} ฿</span>
              </div>
              <div class="flex justify-between text-sm text-slate-300">
                <span>ค่าจัดส่ง</span>
                <span class="font-semibold text-white">{{ deliveryFee }} ฿</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-sm text-emerald-200">
                <span>ส่วนลด</span>
                <span class="font-semibold">-{{ discount }} ฿</span>
              </div>
              <div class="border-t border-white/10 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-bold">รวมทั้งหมด</span>
                  <span class="text-2xl font-extrabold text-amber-200">{{ grandTotal }} ฿</span>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <label class="text-sm font-semibold text-slate-200">รหัสคูปอง</label>
              <div class="mt-2 flex gap-2">
                <input
                  v-model="couponCode"
                  type="text"
                  class="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
                  placeholder="กรอกรหัสคูปอง"
                />
                <button @click="applyCoupon" class="ghost-btn whitespace-nowrap px-4 py-3">ใช้</button>
              </div>
            </div>

            <button
              @click="submitOrder"
              :disabled="!cart.length || !form.deliveryAddress || !form.paymentMethod || loading"
              class="primary-btn mt-6 w-full justify-center"
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
