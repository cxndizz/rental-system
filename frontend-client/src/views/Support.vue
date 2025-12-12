<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div class="flex flex-col gap-2">
        <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Concierge Support</p>
        <h1 class="text-4xl font-bold leading-tight">ติดต่อเรา / ช่วยเหลือ</h1>
        <p class="text-slate-300">เชื่อมต่อกับทีม Concierge ระดับพรีเมียมได้ทุกช่องทาง</p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="glass-card rounded-2xl border-white/10 p-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-300/10 text-amber-100 text-2xl">☎️</div>
          <h3 class="font-semibold text-lg">โทรศัพท์</h3>
          <p class="text-slate-300">02-123-4567</p>
          <p class="text-sm text-slate-400">จันทร์-ศุกร์ 9:00-18:00</p>
        </div>
        <div class="glass-card rounded-2xl border-white/10 p-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-100 text-2xl">✉️</div>
          <h3 class="font-semibold text-lg">อีเมล</h3>
          <p class="text-slate-300">support@rental.com</p>
          <p class="text-sm text-slate-400">ตอบกลับภายใน 24 ชม.</p>
        </div>
        <div class="glass-card rounded-2xl border-white/10 p-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-300/10 text-sky-100 text-2xl">💬</div>
          <h3 class="font-semibold text-lg">แชท</h3>
          <p class="text-slate-300">Live Chat</p>
          <p class="text-sm text-slate-400">สนทนาแบบเรียลไทม์</p>
        </div>
      </div>

      <div class="glass-card rounded-3xl border-white/10 p-8 shadow-2xl">
        <h2 class="text-2xl font-bold text-white">ส่งข้อความถึงเรา</h2>
        <form @submit.prevent="submitForm" class="mt-6 space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">ชื่อ *</label>
              <input v-model="form.name" type="text" required class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none" placeholder="ชื่อของคุณ" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">อีเมล *</label>
              <input v-model="form.email" type="email" required class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none" placeholder="email@example.com" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">เบอร์โทรศัพท์</label>
            <input v-model="form.phone" type="tel" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none" placeholder="0812345678" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">หัวข้อ *</label>
            <select v-model="form.subject" required class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none">
              <option value="" class="bg-slate-900 text-white">เลือกหัวข้อ</option>
              <option value="ORDER" class="bg-slate-900 text-white">สอบถามเกี่ยวกับคำสั่งเช่า</option>
              <option value="PAYMENT" class="bg-slate-900 text-white">ปัญหาการชำระเงิน</option>
              <option value="ITEM" class="bg-slate-900 text-white">สอบถามเกี่ยวกับสินค้า</option>
              <option value="TECHNICAL" class="bg-slate-900 text-white">ปัญหาทางเทคนิค</option>
              <option value="OTHER" class="bg-slate-900 text-white">อื่นๆ</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">ข้อความ *</label>
            <textarea v-model="form.message" required rows="5" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none" placeholder="กรุณาอธิบายปัญหาหรือข้อสงสัยของคุณ"></textarea>
          </div>
          <button type="submit" :disabled="loading" class="primary-btn w-full justify-center">{{ loading ? 'กำลังส่ง...' : 'ส่งข้อความ' }}</button>
        </form>
        <div v-if="submitted" class="mt-6 rounded-2xl border border-emerald-300/50 bg-emerald-300/10 px-4 py-3 text-emerald-100">
          ✓ ส่งข้อความสำเร็จ! เราจะติดต่อกลับไปยังคุณโดยเร็วที่สุด
        </div>
      </div>

      <div class="glass-card rounded-3xl border-white/10 p-8">
        <h2 class="text-2xl font-bold text-white">คำถามที่พบบ่อย (FAQ)</h2>
        <div class="mt-4 space-y-4">
          <details class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary class="font-semibold cursor-pointer text-white">ฉันจะเช่าสินค้าได้อย่างไร?</summary>
            <p class="mt-2 text-slate-200">เลือกสินค้าที่ต้องการ เลือกวันที่เช่า และทำการชำระเงิน ระบบจะส่งการแจ้งเตือนเมื่อคำสั่งเช่าได้รับการอนุมัติ</p>
          </details>
          <details class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary class="font-semibold cursor-pointer text-white">วิธีการชำระเงินมีอะไรบ้าง?</summary>
            <p class="mt-2 text-slate-200">รองรับเงินสด โอนเงิน และบัตรเครดิต/เดบิต</p>
          </details>
          <details class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary class="font-semibold cursor-pointer text-white">ถ้าสินค้าชำรุดต้องทำอย่างไร?</summary>
            <p class="mt-2 text-slate-200">ติดต่อเราทันทีเพื่อรับการดูแลและจัดการเปลี่ยนหรือคืนเงินตามความเหมาะสม</p>
          </details>
          <details class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary class="font-semibold cursor-pointer text-white">นโยบายการคืนสินค้าเป็นอย่างไร?</summary>
            <p class="mt-2 text-slate-200">คืนสินค้าตามวันที่กำหนด หากเกินกำหนดจะมีค่าปรับเพิ่มเติม สินค้าต้องอยู่ในสภาพเดิม</p>
          </details>
          <details class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary class="font-semibold cursor-pointer text-white">ค่ามัดจำจะได้คืนเมื่อไหร่?</summary>
            <p class="mt-2 text-slate-200">ค่ามัดจำจะได้รับคืนภายใน 7 วันทำการหลังจากคืนสินค้าและผ่านการตรวจสอบแล้ว</p>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const submitted = ref(false);

const form = ref({
  name: user?.profile?.firstName || '',
  email: user?.email || '',
  phone: '',
  subject: '',
  message: '',
});

const submitForm = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    submitted.value = true;
    form.value = {
      name: user?.profile?.firstName || '',
      email: user?.email || '',
      phone: '',
      subject: '',
      message: '',
    };
    setTimeout(() => {
      submitted.value = false;
    }, 5000);
  } catch (error) {
    console.error('Error submitting support form:', error);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  } finally {
    loading.value = false;
  }
};
</script>
