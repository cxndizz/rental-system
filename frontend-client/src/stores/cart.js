import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'));
  const startDate = ref(localStorage.getItem('startDate') || '');
  const endDate = ref(localStorage.getItem('endDate') || '');

  const totalItems = computed(() => items.value.length);

  const totalPrice = computed(() => {
    if (!startDate.value || !endDate.value) return 0;
    const days = Math.ceil((new Date(endDate.value) - new Date(startDate.value)) / (1000 * 60 * 60 * 24));
    return items.value.reduce((sum, item) => sum + (item.pricePerDay * days), 0);
  });

  function addItem(item) {
    const exists = items.value.find((i) => i.id === item.id);
    if (!exists) {
      items.value.push(item);
      saveToLocalStorage();
    }
  }

  function removeItem(itemId) {
    items.value = items.value.filter((i) => i.id !== itemId);
    saveToLocalStorage();
  }

  function setDates(start, end) {
    startDate.value = start;
    endDate.value = end;
    localStorage.setItem('startDate', start);
    localStorage.setItem('endDate', end);
  }

  function clearCart() {
    items.value = [];
    startDate.value = '';
    endDate.value = '';
    localStorage.removeItem('cart');
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
  }

  function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value));
  }

  return { items, startDate, endDate, totalItems, totalPrice, addItem, removeItem, setDates, clearCart };
});
