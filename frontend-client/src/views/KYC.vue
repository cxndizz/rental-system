<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-3xl px-4 py-10">
      <div class="glass-card rounded-3xl border-white/10 p-8 shadow-2xl">
        <div class="flex flex-col gap-2">
          <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Identity Verification</p>
          <h1 class="text-3xl font-bold leading-tight">ยืนยันตัวตน (KYC)</h1>
          <p class="text-slate-300">กรุณากรอกข้อมูลเพื่อล็อกอินประสบการณ์ความปลอดภัยระดับเอ็นเตอร์ไพรส์</p>
        </div>

        <div v-if="kycStatus === 'APPROVED'" class="mt-6 rounded-2xl border border-emerald-300/50 bg-emerald-300/10 px-4 py-3 text-emerald-100">
          ✓ บัญชีของคุณได้รับการยืนยันแล้ว
        </div>
        <div v-else-if="kycStatus === 'PENDING'" class="mt-6 rounded-2xl border border-amber-300/50 bg-amber-300/10 px-4 py-3 text-amber-100">
          ⏳ ข้อมูลของคุณอยู่ระหว่างการตรวจสอบ
        </div>
        <div v-else-if="kycStatus === 'REJECTED'" class="mt-6 rounded-2xl border border-red-400/50 bg-red-400/10 px-4 py-3 text-red-100">
          ✗ ข้อมูลของคุณไม่ผ่านการตรวจสอบ กรุณากรอกข้อมูลใหม่
        </div>

        <form v-if="!kycStatus || kycStatus === 'REJECTED'" @submit.prevent="submitKYC" class="mt-8 space-y-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">ประเภทบัตร *</label>
              <select
                v-model="form.idCardType"
                required
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
              >
                <option value="" class="bg-slate-900 text-white">เลือกประเภทบัตร</option>
                <option value="NATIONAL_ID" class="bg-slate-900 text-white">บัตรประชาชน</option>
                <option value="PASSPORT" class="bg-slate-900 text-white">พาสปอร์ต</option>
                <option value="DRIVER_LICENSE" class="bg-slate-900 text-white">ใบขับขี่</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">เลขที่บัตร *</label>
              <input
                v-model="form.idCardNumber"
                type="text"
                required
                maxlength="20"
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
                placeholder="เลขที่บัตรประจำตัว"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">ชื่อ-นามสกุล *</label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">วันเกิด *</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                required
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-200/60 focus:outline-none"
                :max="maxBirthDate"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">ที่อยู่ *</label>
            <textarea
              v-model="form.address"
              required
              rows="3"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
              placeholder="ที่อยู่ตามบัตรประจำตัว"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">เบอร์โทรศัพท์ *</label>
            <input
              v-model="form.phoneNumber"
              type="tel"
              required
              pattern="[0-9]{10}"
              maxlength="10"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
              placeholder="0812345678"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">บัตรประจำตัว (หน้า) *</label>
              <input
                type="file"
                accept="image/*"
                required
                @change="handleFileUpload($event, 'frontImage')"
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              />
              <p class="text-xs text-slate-400">JPG, PNG ≤ 5MB</p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">บัตรประจำตัว (หลัง) *</label>
              <input
                type="file"
                accept="image/*"
                required
                @change="handleFileUpload($event, 'backImage')"
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              />
              <p class="text-xs text-slate-400">JPG, PNG ≤ 5MB</p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">รูปถ่ายคู่บัตร *</label>
              <input
                type="file"
                accept="image/*"
                required
                @change="handleFileUpload($event, 'selfieImage')"
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              />
              <p class="text-xs text-slate-400">เพื่อยืนยันตัวตน</p>
            </div>
          </div>

          <div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <input v-model="form.acceptTerms" type="checkbox" required class="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
            <p>
              ข้าพเจ้ายอมรับ <a href="#" class="text-amber-200 underline">เงื่อนไขและข้อตกลง</a>
              และยืนยันว่าข้อมูลที่ให้มานั้นเป็นความจริง
            </p>
          </div>

          <button type="submit" :disabled="loading" class="primary-btn w-full justify-center">
            {{ loading ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลยืนยันตัวตน' }}
          </button>
        </form>

        <div v-if="kycStatus === 'APPROVED'" class="mt-6 text-center text-slate-200">
          <router-link to="/dashboard" class="text-amber-200">กลับไปที่แดชบอร์ด</router-link>
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
