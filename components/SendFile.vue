<template>
  <div class="send-panel">

    <template v-if="!generatedCode">
      <label class="field-label">
        <span class="mono">&gt;</span> Select a file to send
      </label>

      <div
        class="drop-zone"
        :class="{ 'drop-active': isDragging, 'has-file': selectedFile }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="triggerPicker"
      >
        <input
          ref="fileInput"
          type="file"
          class="file-input-hidden"
          :accept="acceptTypes"
          @change="onFileChange"
        />
        <template v-if="!selectedFile">
          <span class="drop-icon">📁</span>
          <span class="drop-text">Drag & drop or click to browse</span>
          <span class="drop-hint">PNG, JPEG, WebP, MP4, WebM — max 10 MB</span>
        </template>
        <template v-else>
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatSize(selectedFile.size) }}</span>
          <button class="btn-remove" @click.stop="clearFile">✕</button>
        </template>
      </div>

      <div v-if="uploading" class="progress-wrap">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>
        <span class="progress-label">{{ progress }}%</span>
      </div>

      <p v-if="errorMsg" class="error-msg">⚠ {{ errorMsg }}</p>

      <button
        class="btn-primary send-btn"
        :class="{ 'btn-disabled': !selectedFile || uploading }"
        @click="handleUpload"
      >
        <span v-if="uploading">Uploading…</span>
        <span v-else>Upload & Get Code →</span>
      </button>
    </template>

    <template v-else>
      <p class="result-label">
        <span class="status-dot" /> Your file code is ready
      </p>

      <div class="code-display">{{ generatedCode }}</div>

      <div class="qr-wrap">
        <QrCode :text="qrUrl" :size="168" />
      </div>
      <p class="qr-hint">📱 Scan to receive on your other device</p>

      <p class="code-hint">
        Or go to <strong class="accent">Receive File</strong> on your other device and enter this code.
      </p>

      <div class="expiry-notice">⏱ Expires in 15 minutes or after first download</div>

      <div class="result-actions">
        <button class="btn-primary" @click="doCopy">
          {{ copied ? '✓ Copied!' : 'Copy Code' }}
        </button>
        <button class="btn-secondary" @click="reset">
          Send Another
        </button>
      </div>

      <a
        href="https://wise.com/pay/me/syedm198"
        target="_blank"
        rel="noopener noreferrer"
        class="support-inline-link"
        aria-label="Support TextShareNow with a donation via Wise"
      >
        ☕ If this saved you a step, you can support the project →
      </a>
    </template>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const API_URL = config.public.FILES_API_URL

const acceptTypes = 'image/png,image/jpeg,image/webp,video/mp4,video/webm'
const MAX_SIZE = 10 * 1024 * 1024

const fileInput     = ref(null)
const selectedFile  = ref(null)
const isDragging    = ref(false)
const uploading     = ref(false)
const progress      = ref(0)
const generatedCode = ref('')
const qrUrl         = ref('')
const errorMsg      = ref('')
const copied        = ref(false)

function triggerPicker() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) validateAndSet(file)
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) validateAndSet(file)
}

function validateAndSet(file) {
  errorMsg.value = ''
  if (!acceptTypes.split(',').includes(file.type)) {
    errorMsg.value = 'Unsupported file type. Use PNG, JPEG, WebP, MP4, or WebM.'
    return
  }
  if (file.size > MAX_SIZE) {
    errorMsg.value = `File is too large (${formatSize(file.size)}). Maximum is 10 MB.`
    return
  }
  selectedFile.value = file
}

function clearFile() {
  selectedFile.value = null
  errorMsg.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function handleUpload() {
  if (!selectedFile.value || uploading.value) return
  uploading.value  = true
  errorMsg.value   = ''
  progress.value   = 0

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const xhr = new XMLHttpRequest()

    const code = await new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          progress.value = Math.round((e.loaded / e.total) * 100)
        }
      })

      xhr.addEventListener('load', () => {
        try {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data.code)
          } else {
            reject(new Error(data.message || 'Upload failed'))
          }
        } catch {
          reject(new Error('Invalid server response'))
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Network error — please try again.')))

      xhr.open('POST', `${API_URL}/upload`)
      xhr.send(formData)
    })

    generatedCode.value = code
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://www.textsharenow.com'
    qrUrl.value = `${origin}/?fcode=${code}`
  } catch (e) {
    errorMsg.value = e?.message || 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
  }
}

async function doCopy() {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
  } catch {
    const el = document.createElement('textarea')
    el.value = generatedCode.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function reset() {
  selectedFile.value  = null
  generatedCode.value = ''
  qrUrl.value         = ''
  errorMsg.value      = ''
  copied.value        = false
  progress.value      = 0
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.send-panel { display: flex; flex-direction: column; gap: 16px; }

.field-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.mono { color: var(--accent); font-family: var(--font-mono); }

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 20px;
  border: 2px dashed var(--border-accent);
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  text-align: center;
  min-height: 120px;
}

.drop-zone:hover,
.drop-zone.drop-active {
  border-color: var(--accent);
  background: rgba(0, 212, 255, 0.04);
}

.drop-zone.has-file {
  flex-direction: row;
  gap: 12px;
  border-style: solid;
  border-color: var(--accent-green);
  background: rgba(0, 255, 135, 0.04);
}

.file-input-hidden {
  display: none;
}

.drop-icon { font-size: 1.6rem; }

.drop-text {
  font-size: 0.88rem;
  color: var(--text-primary);
}

.drop-hint {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.file-name {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-green);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.file-size {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.btn-remove {
  background: none;
  border: 1px solid var(--border-accent);
  color: var(--text-secondary);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s;
}

.btn-remove:hover {
  border-color: #ff4d6d;
  color: #ff4d6d;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.15s ease;
}

.progress-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  min-width: 36px;
  text-align: right;
}

.error-msg {
  font-size: 0.82rem;
  color: #ff4d6d;
  padding: 10px 14px;
  background: rgba(255, 77, 109, 0.08);
  border: 1px solid rgba(255, 77, 109, 0.2);
  border-radius: 8px;
}

.send-btn { width: 100%; display: flex; justify-content: center; }

.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.result-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-green);
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-display {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 600;
  letter-spacing: 0.45em;
  color: var(--accent-green);
  text-shadow: 0 0 30px rgba(0, 255, 135, 0.6);
  text-align: center;
  padding: 28px 20px;
  background: rgba(0, 255, 135, 0.04);
  border: 1px solid rgba(0, 255, 135, 0.2);
  border-radius: var(--radius);
}

.code-hint { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; text-align: center; }
.accent { color: var(--accent); }
.expiry-notice { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); text-align: center; }

.qr-wrap {
  display: flex;
  justify-content: center;
  padding: 12px;
  border-radius: var(--radius);
}

.qr-wrap :deep(.qr-canvas) {
  outline: 1px solid rgba(255, 255, 255, 0.9);
}

.qr-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: -6px;
}

.result-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.result-actions > * { flex: 1; min-width: 120px; display: flex; justify-content: center; }

.support-inline-link {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  text-align: center;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.support-inline-link:hover {
  opacity: 1;
}
</style>
