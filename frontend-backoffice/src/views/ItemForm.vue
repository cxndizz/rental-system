<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">{{ isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}</h1>

      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                v-model="form.sku"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย *</label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
              <select v-model="form.categoryId" required class="w-full px-4 py-2 border rounded-lg">
                <option value="">เลือกหมวดหมู่</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ราคา/วัน (฿) *</label>
              <input
                v-model.number="form.pricePerDay"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">มัดจำ (฿) *</label>
              <input
                v-model.number="form.depositAmount"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">จำนวน *</label>
              <input
                v-model.number="form.quantity"
                type="number"
                required
                min="0"
                class="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ *</label>
              <select v-model="form.status" required class="w-full px-4 py-2 border rounded-lg">
                <option value="AVAILABLE">พร้อมให้เช่า</option>
                <option value="RENTED">กำลังเช่า</option>
                <option value="MAINTENANCE">ซ่อมบำรุง</option>
                <option value="RETIRED">เลิกใช้</option>
              </select>
            </div>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รูปภาพสินค้า</label>
            <input
              type="file"
              accept="image/*"
              multiple
              @change="handleFileUpload"
              class="w-full px-4 py-2 border rounded-lg"
            />
            <p class="text-xs text-gray-500 mt-1">อัพโหลดได้หลายไฟล์</p>
            <div v-if="existingImages.length" class="grid grid-cols-4 gap-2 mt-4">
              <div v-for="(img, index) in existingImages" :key="index" class="relative">
                <img :src="img.url" class="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  @click="removeExistingImage(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Specifications -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ข้อมูลจำเพาะ (JSON)</label>
            <textarea
              v-model="specificationsText"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              placeholder='{"color": "red", "size": "M"}'
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
            <router-link
              to="/items"
              class="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              ยกเลิก
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { itemsAPI } from '@/services/api';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const categories = ref([]);
const existingImages = ref([]);
const newImages = ref([]);

const form = ref({
  name: '',
  sku: '',
  description: '',
  categoryId: '',
  pricePerDay: 0,
  depositAmount: 0,
  quantity: 0,
  status: 'AVAILABLE',
});

const specificationsText = ref('');

onMounted(async () => {
  await loadCategories();
  if (isEdit.value) {
    await loadItem();
  }
});

const loadCategories = async () => {
  try {
    const response = await itemsAPI.getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

const loadItem = async () => {
  try {
    const response = await itemsAPI.getById(route.params.id);
    const item = response.data;
    form.value = {
      name: item.name,
      sku: item.sku,
      description: item.description,
      categoryId: item.categoryId,
      pricePerDay: item.pricePerDay,
      depositAmount: item.depositAmount,
      quantity: item.quantity,
      status: item.status,
    };
    existingImages.value = item.media || [];
    specificationsText.value = item.specifications ? JSON.stringify(item.specifications, null, 2) : '';
  } catch (error) {
    console.error('Error loading item:', error);
  }
};

const handleFileUpload = (event) => {
  newImages.value = Array.from(event.target.files);
};

const removeExistingImage = (index) => {
  existingImages.value.splice(index, 1);
};

const submitForm = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
      formData.append(key, form.value[key]);
    });

    if (specificationsText.value) {
      try {
        const specs = JSON.parse(specificationsText.value);
        formData.append('specifications', JSON.stringify(specs));
      } catch (e) {
        alert('ข้อมูลจำเพาะไม่ถูกต้อง กรุณาใช้รูปแบบ JSON');
        loading.value = false;
        return;
      }
    }

    newImages.value.forEach((file, index) => {
      formData.append(`media`, file);
    });

    if (isEdit.value) {
      await itemsAPI.update(route.params.id, formData);
      alert('แก้ไขสินค้าเรียบร้อยแล้ว');
    } else {
      await itemsAPI.create(formData);
      alert('เพิ่มสินค้าเรียบร้อยแล้ว');
    }

    router.push('/items');
  } catch (error) {
    console.error('Error saving item:', error);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  } finally {
    loading.value = false;
  }
};
</script>
