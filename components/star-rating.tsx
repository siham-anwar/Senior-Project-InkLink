'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  initialRating?: number
  readonly?: boolean
  onRate?: (rating: number) => void
  size?: number
}

export function StarRating({
  initialRating = 0,
  readonly = false,
  onRate,
  size = 20,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const [rating, setRating] = useState(initialRating)

  const handleRate = (value: number) => {
    if (readonly) return
    setRating(value)
    if (onRate) onRate(value)
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            'transition-colors focus:outline-none',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
          )}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(null)}
          onClick={() => handleRate(star)}
        >
          <Star
            size={size}
            className={cn(
              'transition-all duration-200',
              (hover !== null ? star <= hover : star <= rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30 fill-transparent'
            )}
          />
        </button>
      ))}
    </div>
  )
}
