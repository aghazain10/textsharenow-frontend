/**
 * useTextShare — composable for sending and receiving text via the Laravel API.
 *
 * Replace API_BASE with your Laravel backend URL.
 * All methods return { data, error } so the UI can handle states cleanly.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.textsharenow.com'

export const useTextShare = () => {
  const isSending   = ref(false)
  const isReceiving = ref(false)
  const sendError   = ref(null)
  const receiveError = ref(null)

  /**
   * Send text to the server — returns a short code.
   * @param {string} text
   * @returns {Promise<{ code: string | null, error: string | null }>}
   */
  const sendText = async (text) => {
    isSending.value  = true
    sendError.value  = null

    try {
      const response = await $fetch(`${API_BASE}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { text },
      })
      return { code: response.code, error: null }
    } catch (err) {
      const message = err?.data?.message || 'Failed to send text. Please try again.'
      sendError.value = message
      return { code: null, error: message }
    } finally {
      isSending.value = false
    }
  }

  /**
   * Retrieve text by code.
   * @param {string} code
   * @returns {Promise<{ text: string | null, error: string | null }>}
   */
  const receiveText = async (code) => {
    isReceiving.value  = true
    receiveError.value = null

    try {
      const response = await $fetch(`${API_BASE}/api/share/${code.trim().toUpperCase()}`)
      return { text: response.text, error: null }
    } catch (err) {
      const status  = err?.response?.status
      const message =
        status === 404
          ? 'Code not found or has expired. Please check and try again.'
          : err?.data?.message || 'Failed to retrieve text. Please try again.'
      receiveError.value = message
      return { text: null, error: message }
    } finally {
      isReceiving.value = false
    }
  }

  /**
   * Copy text to the clipboard.
   * @param {string} text
   * @returns {Promise<boolean>} success
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity  = '0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      return ok
    }
  }

  return {
    isSending,
    isReceiving,
    sendError,
    receiveError,
    sendText,
    receiveText,
    copyToClipboard,
  }
}
