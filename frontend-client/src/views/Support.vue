<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-4xl font-bold mb-8">ติดต่อเรา / ช่วยเหลือ</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Contact Cards -->
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg mb-2">โทรศัพท์</h3>
          <p class="text-gray-600">02-123-4567</p>
          <p class="text-sm text-gray-500 mt-1">จันทร์-ศุกร์ 9:00-18:00</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg mb-2">อีเมล</h3>
          <p class="text-gray-600">support@rental.com</p>
          <p class="text-sm text-gray-500 mt-1">ตอบกลับภายใน 24 ชม.</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="font-semibold text-lg mb-2">แชท</h3>
          <p class="text-gray-600">Live Chat</p>
          <p class="text-sm text-gray-500 mt-1">สนทนาแบบเรียลไทม์</p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 class="text-2xl font-bold mb-6">ส่งข้อความถึงเรา</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg"
                placeholder="ชื่อของคุณ"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border rounded-lg"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="0812345678"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หัวข้อ *</label>
            <select v-model="form.subject" required class="w-full px-4 py-2 border rounded-lg">
              <option value="">เลือกหัวข้อ</option>
              <option value="ORDER">สอบถามเกี่ยวกับคำสั่งเช่า</option>
              <option value="PAYMENT">ปัญหาการชำระเงิน</option>
              <option value="ITEM">สอบถามเกี่ยวกับสินค้า</option>
              <option value="TECHNICAL">ปัญหาทางเทคนิค</option>
              <option value="OTHER">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ข้อความ *</label>
            <textarea
              v-model="form.message"
              required
              rows="5"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="กรุณาอธิบายปัญหาหรือข้อสงสัยของคุณ"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
          >
            {{ loading ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
          </button>
        </form>

        <div v-if="submitted" class="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p class="font-semibold">✓ ส่งข้อความสำเร็จ!</p>
          <p class="text-sm">เราจะติดต่อกลับไปยังคุณโดยเร็วที่สุด</p>
        </div>
      </div>

      <!-- FAQ -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold mb-6">คำถามที่พบบ่อย (FAQ)</h2>
        <div class="space-y-4">
          <details class="border-b pb-4">
            <summary class="font-semibold cursor-pointer hover:text-blue-600">
              ฉันจะเช่าสินค้าได้อย่างไร?
            </summary>
            <p class="mt-2 text-gray-700 pl-4">
              คุณสามารถเลือกสินค้าที่ต้องการ เลือกวันที่เช่า และทำการชำระเงิน
              ระบบจะส่งการแจ้งเตือนเมื่อคำสั่งเช่าได้รับการอนุมัติ
            </p>
          </details>

          <details class="border-b pb-4">
            <summary class="font-semibold cursor-pointer hover:text-blue-600">
              วิธีการชำระเงินมีอะไรบ้าง?
            </summary>
            <p class="mt-2 text-gray-700 pl-4">
              เรารับชำระเงินผ่านหลายช่องทาง ได้แก่ เงินสด, โอนเงินผ่านธนาคาร, บัตรเครดิต/เดบิต
            </p>
          </details>

          <details class="border-b pb-4">
            <summary class="font-semibold cursor-pointer hover:text-blue-600">
              ถ้าสินค้าชำรุดต้องทำอย่างไร?
            </summary>
            <p class="mt-2 text-gray-700 pl-4">
              กรุณาติดต่อเราทันทีหากพบสินค้าชำรุด เราจะจัดการเปลี่ยนหรือคืนเงินตามความเหมาะสม
            </p>
          </details>

          <details class="border-b pb-4">
            <summary class="font-semibold cursor-pointer hover:text-blue-600">
              นโยบายการคืนสินค้าเป็นอย่างไร?
            </summary>
            <p class="mt-2 text-gray-700 pl-4">
              คุณต้องคืนสินค้าตามวันที่กำหนด หากเกินกำหนดจะมีค่าปรับเพิ่มเติม
              สินค้าต้องอยู่ในสภาพเดิมเมื่อคืน
            </p>
          </details>

          <details class="border-b pb-4">
            <summary class="font-semibold cursor-pointer hover:text-blue-600">
              ค่ามัดจำจะได้คืนเมื่อไหร่?
            </summary>
            <p class="mt-2 text-gray-700 pl-4">
              ค่ามัดจำจะได้รับคืนภายใน 7 วันทำการหลังจากคืนสินค้าและผ่านการตรวจสอบแล้ว
            </p>
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Support form submitted:', form.value);
    submitted.value = true;

    // Reset form
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
