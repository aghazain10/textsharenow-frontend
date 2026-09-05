<template>
  <canvas ref="canvasEl" class="qr-canvas" aria-hidden="true" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import qrcode from '~/utils/qr.js'

const props = defineProps({
  text: { type: String, required: true },
  size: { type: Number, default: 168 },
  margin: { type: Number, default: 12 },
})

const canvasEl = ref(null)

function draw() {
  const canvas = canvasEl.value
  if (!canvas || !props.text) return

  const qr = qrcode(0, 'L')
  qr.addData(props.text)
  qr.make()

  const modules = qr.getModuleCount()
  const cell = props.size / (modules + props.margin * 2)
  const px = Math.ceil(props.size)

  canvas.width = px
  canvas.height = px

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // White background — crucial for reliable scanning on dark UI.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, px, px)

  ctx.fillStyle = '#000000'
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr.isDark(row, col)) {
        const x = Math.floor((col + props.margin) * cell)
        const y = Math.floor((row + props.margin) * cell)
        const w = Math.ceil(cell)
        ctx.fillRect(x, y, w, w)
      }
    }
  }
}

onMounted(draw)
watch(() => props.text, draw)
</script>

<style scoped>
.qr-canvas {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>