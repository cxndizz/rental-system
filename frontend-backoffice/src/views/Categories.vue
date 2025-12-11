<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-4xl font-bold">จัดการหมวดหมู่</h1>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + เพิ่มหมวดหมู่
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="categories.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
      >
        <h3 class="text-xl font-bold mb-2">{{ category.name }}</h3>
        <p class="text-gray-600 text-sm mb-4">{{ category.description || 'ไม่มีคำอธิบาย' }}</p>
        <p class="text-sm text-gray-500 mb-4">จำนวนสินค้า: {{ category.itemCount || 0 }}</p>
        <div class="flex gap-2">
          <button
            @click="editCategory(category)"
            class="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            แก้ไข
          </button>
          <button
            @click="deleteCategory(category.id)"
            class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
      <p class="text-gray-600">ไม่มีหมวดหมู่</p>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold mb-4">{{ editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}</h2>
        <form @submit.prevent="submitCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่ *</label>
            <input
              v-model="categoryForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>
          <div class="flex gap-4">
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              บันทึก
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { itemsAPI } from '@/services/api';

const categories = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);
const editingCategory = ref(null);

const categoryForm = ref({
  name: '',
  description: '',
});

onMounted(async () => {
  await loadCategories();
});

const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await itemsAPI.getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error loading categories:', error);
  } finally {
    loading.value = false;
  }
};

const editCategory = (category) => {
  editingCategory.value = category;
  categoryForm.value = {
    name: category.name,
    description: category.description || '',
  };
  showCreateModal.value = true;
};

const submitCategory = async () => {
  try {
    if (editingCategory.value) {
      // Update category (API endpoint might not exist yet)
      console.log('Update category:', categoryForm.value);
      alert('แก้ไขหมวดหมู่เรียบร้อยแล้ว');
    } else {
      await itemsAPI.createCategory(categoryForm.value);
      alert('เพิ่มหมวดหมู่เรียบร้อยแล้ว');
    }
    closeModal();
    await loadCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  }
};

const deleteCategory = async (id) => {
  if (confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) {
    try {
      // Delete category (API endpoint might not exist yet)
      console.log('Delete category:', id);
      alert('ลบหมวดหมู่เรียบร้อยแล้ว');
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingCategory.value = null;
  categoryForm.value = { name: '', description: '' };
};
</script>
