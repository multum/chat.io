export default function (url, { name, width, height } = {}) {
  const top = window.outerHeight / 2 - height / 2
  const left = window.outerWidth / 2 - width / 2
  const opened = window.open(
    url,
    name,
    `width=${width}, height=${height}, top=${top}, left=${left}`,
  )
  if (window.focus) {
    opened.focus()
  }
  return opened
}
