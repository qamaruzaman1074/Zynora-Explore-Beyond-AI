import './AnimatedLogo.css'

const letters = 'ZYNORA'

function AnimatedLogo() {
  return (
    <span className="animated-logo" role="img" aria-label="ZYNORA">
      {Array.from(letters, (letter, index) => (
        <span
          className="animated-logo__letter"
          key={`${letter}-${index}`}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

export default AnimatedLogo
