<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto border-t border-white/10 bg-slate-950/90">
    <div class="mx-auto max-w-7xl px-4 py-12">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <div class="flex items-center space-x-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-lg font-bold text-slate-900 shadow-lg">
              RS
            </div>
            <div>
              <p class="text-sm uppercase tracking-[0.35em] text-amber-200">Rental Suite</p>
              <p class="text-lg font-semibold text-white">Luxury Rentals Platform</p>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-300">
            เช่าสินค้าพรีเมียมในประสบการณ์ระดับเอ็นเตอร์ไพรส์ พร้อมการดูแลแบบ Concierge ทุกขั้นตอน
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-widest text-amber-200">นำทาง</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-200">
            <li><router-link to="/items" class="hover:text-amber-200">เรียกดูสินค้า</router-link></li>
            <li><router-link to="/dashboard" class="hover:text-amber-200">บัญชีของฉัน</router-link></li>
            <li><router-link to="/rentals" class="hover:text-amber-200">การเช่าของฉัน</router-link></li>
            <li><router-link to="/support" class="hover:text-amber-200">ฝ่ายบริการ</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-widest text-amber-200">บริการลูกค้า</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-200">
            <li><a href="#" class="hover:text-amber-200">วิธีการเช่า</a></li>
            <li><a href="#" class="hover:text-amber-200">FAQ</a></li>
            <li><a href="#" class="hover:text-amber-200">นโยบายการเช่า</a></li>
            <li><a href="#" class="hover:text-amber-200">นโยบายคืนของ</a></li>
            <li><a href="#" class="hover:text-amber-200">ข้อกำหนดและเงื่อนไข</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-widest text-amber-200">ติดต่อเรา</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-200">
            <li class="flex items-center space-x-3"><span class="text-amber-200">◎</span><span>02-123-4567</span></li>
            <li class="flex items-center space-x-3"><span class="text-amber-200">✉</span><span>support@rental.com</span></li>
            <li class="flex items-start space-x-3"><span class="text-amber-200">⌂</span><span>123 Rental Street, Bangkok, Thailand</span></li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row">
        <p>© {{ currentYear }} Rental System. All rights reserved.</p>
        <div class="mt-4 flex space-x-4 md:mt-0">
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs tracking-widest text-amber-200">Secure Rentals</span>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs tracking-widest text-amber-200">24/7 Support</span>
          <span class="rounded-full border border-white/10 px-3 py-1 text-xs tracking-widest text-amber-200">Premium Care</span>
        </div>
      </div>
    </div>
  </footer>
</template>
