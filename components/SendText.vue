<template>
  <div class="send-panel">

    <template v-if="!generatedCode">
      <label class="field-label" for="send-textarea">
        <span class="mono">&gt;</span> Your text, link, or note
      </label>

      <div class="textarea-wrapper">
        <textarea
          id="send-textarea"
          v-model="inputText"
          class="input-field send-textarea"
          placeholder="Paste your link, text, or note here..."
          maxlength="5000"
        />
        <span class="char-count" :class="{ warning: inputText.length > 4500 }">
          {{ inputText.length }}/5000
        </span>
      </div>

      <p v-if="errorMsg" class="error-msg">⚠ {{ errorMsg }}</p>

      <button
        class="btn-primary send-btn"
        :class="{ 'btn-disabled': !inputText.trim() || loading }"
        @click="handleSend"
      >
        <span v-if="loading">Generating...</span>
        <span v-else>Generate Code →</span>
      </button>
    </template>

    <template v-else>
      <p class="result-label">
        <span class="status-dot" /> Your code is ready
      </p>

      <div class="code-display">{{ generatedCode }}</div>

      <div class="qr-wrap">
        <QrCode :text="qrUrl" :size="168" />
      </div>
      <p class="qr-hint">📱 Scan to receive on your other device</p>

      <p class="code-hint">
        Or go to <strong class="accent">Receive Text</strong> on your other device and enter this code.
      </p>

      <div class="expiry-notice">⏱ Expires in 10 minutes or after first read</div>

      <div class="result-actions">
        <button class="btn-primary" @click="doCopy">
          {{ copied ? '✓ Copied!' : 'Copy Code' }}
        </button>
        <button class="btn-secondary" @click="reset">
          Send Another
        </button>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText     = ref('')
const generatedCode = ref('')
const qrUrl         = ref('')
const loading       = ref(false)
const errorMsg      = ref('')
const copied        = ref(false)

async function handleSend() {
  if (!inputText.value.trim() || loading.value) return
  loading.value  = true
  errorMsg.value = ''
  try {
    const res = await $fetch('/api/share', {
      method: 'POST',
      body: { text: inputText.value },
    })
    generatedCode.value = res.code
    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://www.textsharenow.com'
    qrUrl.value = `${origin}/?code=${res.code}`
  } catch (e) {
    errorMsg.value = e?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
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
  inputText.value     = ''
  generatedCode.value = ''
  qrUrl.value         = ''
  errorMsg.value      = ''
  copied.value        = false
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

.textarea-wrapper { position: relative; }

.send-textarea { min-height: 160px; line-height: 1.6; padding-bottom: 32px; }

.char-count {
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  pointer-events: none;
}
.char-count.warning { color: #ff9500; }

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
</style>
