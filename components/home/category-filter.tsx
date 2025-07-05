'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  className?: string
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => {
          const isSelected = category === selectedCategory
          
          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "whitespace-nowrap transition-all",
                isSelected && "shadow-md"
              )}
            >
              {category}
            </Button>
          )
        })}
      </div>
    </div>
  )
}