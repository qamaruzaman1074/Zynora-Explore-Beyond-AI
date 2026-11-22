import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../routing'

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

function AppLink({
  href,
  onClick,
  target,
  download,
  ...props
}: AppLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== '_self') ||
      download
    ) {
      return
    }

    const destination = new URL(href, window.location.href)
    if (destination.origin !== window.location.origin) return

    event.preventDefault()
    navigate(`${destination.pathname}${destination.search}${destination.hash}`)
  }

  return (
    <a
      {...props}
      download={download}
      href={href}
      onClick={handleClick}
      target={target}
    />
  )
}

export default AppLink
