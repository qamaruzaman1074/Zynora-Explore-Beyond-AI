export function getToolInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'AI'
  if (words.length === 1) return words[0].slice(0, 2).toLocaleUpperCase()
  return `${words[0][0]}${words[1][0]}`.toLocaleUpperCase()
}

export function resolveLogoSource(logo: string | null) {
  const source = logo?.trim()
  if (!source) return null
  if (
    (source.startsWith('/') && !source.startsWith('//')) ||
    source.startsWith('./') ||
    source.startsWith('../')
  ) {
    return source
  }
  if (
    /^data:image\/(?:svg\+xml|png|jpeg|webp|gif|x-icon)(?:;[^,]*)?,/i.test(
      source,
    )
  ) {
    return source
  }

  return null
}
