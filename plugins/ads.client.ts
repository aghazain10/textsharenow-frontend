export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const script = document.createElement('script')
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6697676712322371'
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
})
