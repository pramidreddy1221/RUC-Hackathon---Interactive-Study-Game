import { Heart } from 'lucide-react'

interface HeartsProps {
  count: number
  maxCount?: number
}

export function Hearts({ count, maxCount = 2 }: HeartsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxCount }).map((_, index) => (
        <Heart
          key={index}
          className={`h-6 w-6 ${
            index < count
              ? 'fill-red-500 text-red-500'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

