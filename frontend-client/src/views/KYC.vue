<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-2xl">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-2">ยืนยันตัวตน (KYC)</h1>
        <p class="text-gray-600 mb-8">กรุณากรอกข้อมูลเพื่อยืนยันตัวตนของคุณ</p>

        <div v-if="kycStatus === 'APPROVED'" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p class="font-semibold">✓ บัญชีของคุณได้รับการยืนยันแล้ว</p>
        </div>

        <div v-else-if="kycStatus === 'PENDING'" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p class="font-semibold">⏳ ข้อมูลของคุณอยู่ระหว่างการตรวจสอบ</p>
        </div>

        <div v-else-if="kycStatus === 'REJECTED'" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p class="font-semibold">✗ ข้อมูลของคุณไม่ผ่านการตรวจสอบ กรุณากรอกข้อมูลใหม่</p>
        </div>

        <form v-if="!kycStatus || kycStatus === 'REJECTED'" @submit.prevent="submitKYC" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทบัตร *</label>
            <select v-model="form.idCardType" required class="w-full px-4 py-2 border rounded-lg">
              <option value="">เลือกประเภทบัตร</option>
              <option value="NATIONAL_ID">บัตรประชาชน</option>
              <option value="PASSPORT">พาสปอร์ต</option>
              <option value="DRIVER_LICENSE">ใบขับขี่</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เลขที่บัตร *</label>
            <input
              v-model="form.idCardNumber"
              type="text"
              required
              maxlength="20"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="เลขที่บัตรประจำตัว"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (ตรงตามบัตร) *</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="ชื่อ-นามสกุล"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">วันเกิด *</label>
            <input
              v-model="form.dateOfBirth"
              type="date"
              required
              class="w-full px-4 py-2 border rounded-lg"
              :max="maxBirthDate"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ *</label>
            <textarea
              v-model="form.address"
              required
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="ที่อยู่ตามบัตรประจำตัว"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
            <input
              v-model="form.phoneNumber"
              type="tel"
              required
              pattern="[0-9]{10}"
              maxlength="10"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="0812345678"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">อัพโหลดรูปบัตรประจำตัว (ด้านหน้า) *</label>
            <input
              type="file"
              accept="image/*"
              required
              @change="handleFileUpload($event, 'frontImage')"
              class="w-full px-4 py-2 border rounded-lg"
            />
            <p class="text-xs text-gray-500 mt-1">รองรับไฟล์: JPG, PNG ขนาดไม่เกิน 5MB</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">อัพโหลดรูปบัตรประจำตัว (ด้านหลัง) *</label>
            <input
              type="file"
              accept="image/*"
              required
              @change="handleFileUpload($event, 'backImage')"
              class="w-full px-4 py-2 border rounded-lg"
            />
            <p class="text-xs text-gray-500 mt-1">รองรับไฟล์: JPG, PNG ขนาดไม่เกิน 5MB</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">อัพโหลดรูปถ่ายคู่บัตร *</label>
            <input
              type="file"
              accept="image/*"
              required
              @change="handleFileUpload($event, 'selfieImage')"
              class="w-full px-4 py-2 border rounded-lg"
            />
            <p class="text-xs text-gray-500 mt-1">รูปถ่ายคู่กับบัตรประจำตัว</p>
          </div>

          <div class="flex items-start">
            <input
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="mt-1 mr-2"
              id="terms"
            />
            <label for="terms" class="text-sm text-gray-700">
              ข้าพเจ้ายอมรับ <a href="#" class="text-blue-600 hover:underline">เงื่อนไขและข้อตกลง</a>
              และยืนยันว่าข้อมูลที่ให้มานั้นเป็นความจริง
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
          >
            {{ loading ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลยืนยันตัวตน' }}
          </button>
        </form>

        <div v-if="kycStatus === 'APPROVED'" class="text-center">
          <router-link to="/dashboard" class="text-blue-600 hover:underline">
            กลับไปที่แดชบอร์ด
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usersAPI } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const loading = ref(false);
const kycStatus = ref(null);

const form = ref({
  idCardType: '',
  idCardNumber: '',
  fullName: '',
  dateOfBirth: '',
  address: '',
  phoneNumber: '',
  frontImage: null,
  backImage: null,
  selfieImage: null,
  acceptTerms: false,
});

const maxBirthDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().split('T')[0];
});

onMounted(async () => {
  await checkKYCStatus();
});

const checkKYCStatus = async () => {
  try {
    const response = await usersAPI.getKYC(user.id);
    kycStatus.value = response.data.status;
  } catch (error) {
    console.error('Error checking KYC status:', error);
  }
};

const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ไม่ควรเกิน 5MB');
      event.target.value = '';
      return;
    }
    form.value[field] = file;
  }
};

const submitKYC = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
      if (form.value[key] !== null && key !== 'acceptTerms') {
        formData.append(key, form.value[key]);
      }
    });

    await usersAPI.submitKYC(user.id, formData);
    alert('ส่งข้อมูลเรียบร้อยแล้ว รอการตรวจสอบจากเจ้าหน้าที่');
    kycStatus.value = 'PENDING';
  } catch (error) {
    console.error('Error submitting KYC:', error);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  } finally {
    loading.value = false;
  }
};
</script>
