import { useState } from 'react'
import type { AITool } from '../types/tool'
import { getToolInitials, resolveLogoSource } from '../utils/toolLogo'
import './ToolLogo.css'

type ToolLogoProps = {
  tool: Pick<AITool, 'name' | 'logo'>
  size: number
  loading?: 'eager' | 'lazy'
}

function ToolLogo({ tool, size, loading = 'lazy' }: ToolLogoProps) {
  const source = resolveLogoSource(tool.logo)
  const [failedSource, setFailedSource] = useState<string | null>(null)

  if (!source || failedSource === source) {
    return (
      <span
        aria-label={`${tool.name} logo unavailable; initials shown`}
        className="tool-logo__fallback"
        role="img"
        style={{ height: size, width: size }}
      >
        {getToolInitials(tool.name)}
      </span>
    )
  }

  return (
    <img
      alt={`${tool.name} logo`}
      decoding="async"
      height={size}
      loading={loading}
      onError={() => setFailedSource(source)}
      src={source}
      width={size}
    />
  )
}

export default ToolLogo
