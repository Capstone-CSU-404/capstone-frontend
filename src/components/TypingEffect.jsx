import { useState, useEffect, useRef } from "react"

function TypingEffect({ text, speed = 15, shouldAnimate = true }) {
  const [displayedText, setDisplayedText] = useState(shouldAnimate ? "" : text)
  const indexRef = useRef(0)

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(text)
      return
    }

    setDisplayedText("")
    indexRef.current = 0

    if (!text) return

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.substring(0, indexRef.current + 1))
        indexRef.current += 1
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, shouldAnimate])

  return <span>{displayedText}</span>
}

export default TypingEffect