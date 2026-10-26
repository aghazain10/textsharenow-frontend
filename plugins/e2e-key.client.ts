/**
 * Captures the E2E decryption key from the URL that opened this page
 * (#k=... fragment + ?code=...) at app startup — before pages/r.vue and
 * pages/index.vue clear the query string in their onMounted hooks.
 *
 * The fragment never reaches the server (browsers strip it from requests);
 * this only keeps it in memory for ReceiveCode to decrypt with.
 */
import { captureFragmentKey } from '~/utils/e2e.js'

export default defineNuxtPlugin(() => {
  captureFragmentKey()
})
