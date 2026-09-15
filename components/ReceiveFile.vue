<template>
  <div class="receive-panel">

    <template v-if="!downloaded">
      <label class="field-label" for="file-code-input">
        <span class="mono">&gt;</span> Enter your file code
      </label>

      <input
        id="file-code-input"
        v-model="codeInput"
        class="input-field code-input"
        type="text"
        placeholder="e.g. Z7K4P"
        maxlength="8"
        autocomplete="off"
        spellcheck="false"
        @input="onInput"
        @keyup.enter="handleDownload"
      />

      <p class="field-hint">Enter the 5–6 character code from the sending device.</p>

      <p v-if="errorMsg" class="error-msg">⚠ {{ errorMsg }}</p>

      <button
        class="btn-primary receive-btn"
        :class="{ 'btn-disabled': codeInput.trim().length < 4 || loading }"
        @click="handleDownload"
      >
        <span v-if="loading">Downloading…</span>
        <span v-else>Download File →</span>
      </button>
    </template>

    <template v-else>
      <div class="result-header">
        <span class="status-dot" />
        <span class="result-label">File downloaded successfully</span>
        <span class="code-used mono">[ {{ usedCode }} ]</span>
      </div>

      <div class="success-box">
        <span class="success-icon">✓</span>
        <span class="success-text">Your file has been downloaded.</span>
      </div>

      <p class="auto-delete-notice">🗑 This file has been deleted from our servers.</p>

      <div class="retrieved-actions">
        <button class="btn-secondary" @click="reset">
          Download Another
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

const props = defineProps({
  initialCode: { type: String, default: '' },
})

const codeInput  = ref('')
const downloaded = ref(false)
const usedCode   = ref('')
const loading    = ref(false)
const errorMsg   = ref('')

function onInput(e) {
  codeInput.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  errorMsg.value  = ''
}

async function handleDownload() {
  const code = codeInput.value.trim()
  if (code.length < 4 || loading.value) return
  loading.value  = true
  errorMsg.value = ''

  try {
    const response = await fetch(`${API_URL}/download/${code}`)

    if (!response.ok) {
      if (response.status === 404) {
        errorMsg.value = props.initialCode
          ? 'This share has expired (15-min limit) or was already downloaded. Please ask the sender again.'
          : 'Code not found or expired. Please check and try again.'
      } else {
        const data = await response.json().catch(() => ({}))
        errorMsg.value = data.message || 'Download failed. Please try again.'
      }
      return
    }

    const blob = await response.blob()
    const disposition = response.headers.get('Content-Disposition') || ''
    const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/)
    const filename = filenameMatch ? filenameMatch[1] : `file-${code}`

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    usedCode.value   = code
    downloaded.value = true
  } catch (e) {
    errorMsg.value = e?.message || 'Network error — please try again.'
  } finally {
    loading.value = false
  }
}

function reset() {
  codeInput.value  = ''
  downloaded.value = false
  usedCode.value   = ''
  errorMsg.value   = ''
}
</script>

<style scoped>
.receive-panel { display: flex; flex-direction: column; gap: 16px; }

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

.code-input {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  text-align: center;
  padding: 20px;
  color: var(--accent);
}

.field-hint { font-size: 0.78rem; color: var(--text-muted); text-align: center; }

.error-msg {
  font-size: 0.82rem;
  color: #ff4d6d;
  padding: 10px 14px;
  background: rgba(255, 77, 109, 0.08);
  border: 1px solid rgba(255, 77, 109, 0.2);
  border-radius: 8px;
}

.receive-btn { width: 100%; display: flex; justify-content: center; }

.btn-disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

.result-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.result-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-green);
}

.code-used { font-size: 0.7rem; color: var(--text-muted); margin-left: auto; }

.success-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: rgba(0, 255, 135, 0.04);
  border: 1px solid rgba(0, 255, 135, 0.2);
  border-radius: var(--radius);
}

.success-icon {
  font-size: 1.2rem;
  color: var(--accent-green);
}

.success-text {
  font-size: 0.88rem;
  color: var(--text-primary);
}

.auto-delete-notice {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  text-align: center;
}

.retrieved-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.retrieved-actions > * { flex: 1; min-width: 120px; display: flex; justify-content: center; }

.support-inline-link {
  font-family: var(--font-mono);
  font-size: 0.68rem;
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
