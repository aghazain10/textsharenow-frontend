<template>
  <canvas ref="canvasEl" class="qr-canvas" aria-hidden="true" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import qrcode from '~/utils/qr.js'

const props = defineProps({
  text: { type: String, required: true },
  size: { type: Number, default: 168 },
})

const canvasEl = ref(null)

function draw() {
  const canvas = canvasEl.value
  if (!canvas || !props.text) return

  const qr = qrcode(0, 'M')
  qr.addData(props.text)
  qr.make()

  const modules = qr.getModuleCount()
  const quiet = 4 // quiet zone per QR spec — native scanners require it

  // Uniform integer module size in device pixels. This yields a perfectly
  // regular grid with crisp edges and an exact 4-module quiet zone, which
  // strict native camera decoders (vs. Google Lens) demand.
  const dpr = window.devicePixelRatio || 1
  const total = modules + quiet * 2
  const cell = Math.max(1, Math.round((props.size * dpr) / total))

  const pxSize = cell * total
  canvas.width = pxSize
  canvas.height = pxSize

  // Display at native device resolution (no upscaling → no blur).
  const cssSize = pxSize / dpr
  canvas.style.width = `${cssSize}px`
  canvas.style.height = `${cssSize}px`

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Pure white background — required for contrast on the dark card.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, pxSize, pxSize)

  ctx.fillStyle = '#000000'
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect((col + quiet) * cell, (row + quiet) * cell, cell, cell)
      }
    }
  }
}

onMounted(draw)
watch(() => props.text, draw)
</script>

<style scoped>
/* Intrinsic size is set inline by draw() (CSS pixels at device resolution);
   width/height here are only a safety floor before draw() runs. */
.qr-canvas {
  display: block;
  border-radius: 8px;
}
</style>