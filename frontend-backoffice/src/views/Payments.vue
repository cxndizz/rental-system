<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <h1 class="text-4xl font-bold mb-6">จัดการการชำระเงิน</h1>

    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
      <h2 class="text-2xl font-bold mb-4">ระบบการชำระเงิน</h2>
      <p class="text-slate-300 mb-4">จัดการการชำระเงิน ใบเสร็จ และการคืนเงิน</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="border rounded-lg p-6">
          <h3 class="font-semibold text-lg mb-2">รายได้รวม</h3>
          <p class="text-3xl font-bold text-green-600">0 ฿</p>
        </div>
        <div class="border rounded-lg p-6">
          <h3 class="font-semibold text-lg mb-2">รอชำระ</h3>
          <p class="text-3xl font-bold text-yellow-600">0 ฿</p>
        </div>
        <div class="border rounded-lg p-6">
          <h3 class="font-semibold text-lg mb-2">คืนเงินแล้ว</h3>
          <p class="text-3xl font-bold text-blue-600">0 ฿</p>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-gray-500">ฟีเจอร์การจัดการการชำระเงินจะเพิ่มเติมในอนาคต</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Payment management component
</script>
