<template>
  <div class="receive-panel">

    <template v-if="!retrievedText">
      <label class="field-label" for="code-input">
        <span class="mono">&gt;</span> Enter your share code
      </label>

      <input
        id="code-input"
        v-model="codeInput"
        class="input-field code-input"
        type="text"
        placeholder="e.g. Z7K4P"
        maxlength="8"
        autocomplete="off"
        spellcheck="false"
        @input="onInput"
        @keyup.enter="handleReceive"
      />

      <p class="field-hint">Enter the 5–6 character code from the sending device.</p>

      <p v-if="errorMsg" class="error-msg">⚠ {{ errorMsg }}</p>

      <button
        class="btn-primary receive-btn"
        :class="{ 'btn-disabled': codeInput.trim().length < 4 || loading }"
        @click="handleReceive"
      >
        <span v-if="loading">Retrieving...</span>
        <span v-else>Retrieve Text →</span>
      </button>
    </template>

    <template v-else>
      <div class="result-header">
        <span class="status-dot" />
        <span class="result-label">Text retrieved successfully</span>
        <span class="code-used mono">[ {{ usedCode }} ]</span>
      </div>

      <div class="retrieved-text-box">
        <pre class="retrieved-text">{{ retrievedText }}</pre>
      </div>

      <div class="retrieved-actions">
        <button class="btn-primary" @click="doCopy">
          {{ copied ? '✓ Copied to Clipboard!' : 'Copy Text' }}
        </button>
        <button class="btn-secondary" @click="reset">
          Retrieve Another
        </button>
      </div>

      <p class="auto-delete-notice">🗑 This text has been deleted from our servers.</p>
    </template>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const codeInput     = ref('')
const retrievedText = ref('')
const usedCode      = ref('')
const loading       = ref(false)
const errorMsg      = ref('')
const copied        = ref(false)

function onInput(e) {
  codeInput.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  errorMsg.value  = ''
}

async function handleReceive() {
  const code = codeInput.value.trim()
  if (code.length < 4 || loading.value) return
  loading.value  = true
  errorMsg.value = ''
  try {
    const res = await $fetch(`/api/share/${code}`)
    usedCode.value      = code
    retrievedText.value = res.text
  } catch (e) {
    errorMsg.value = e?.response?.status === 404
      ? 'Code not found or expired. Please check and try again.'
      : e?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

async function doCopy() {
  try {
    await navigator.clipboard.writeText(retrievedText.value)
  } catch {
    const el = document.createElement('textarea')
    el.value = retrievedText.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2200)
}

function reset() {
  codeInput.value     = ''
  retrievedText.value = ''
  usedCode.value      = ''
  errorMsg.value      = ''
  copied.value        = false
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

.retrieved-text-box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius);
  padding: 18px;
  max-height: 220px;
  overflow-y: auto;
}

.retrieved-text {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
}

.retrieved-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.retrieved-actions > * { flex: 1; min-width: 120px; display: flex; justify-content: center; }

.auto-delete-notice {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-muted);
  text-align: center;
}
</style>
