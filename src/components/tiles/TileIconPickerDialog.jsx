import { useMemo, useState } from 'react'
import { CheckmarkCircle02Icon, Search01Icon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Separator } from '@/components/ui/separator'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { tileIconOptions } from '@/features/boards/routes/BoardCreate/components/tileIconOptions'
import { getTileIconPublicUrl } from '@/services/storage'

function TileIconPickerDialog({ open, onOpenChange, value, tileName, tileType = 'question', onSelect }) {
  const [draftIcon, setDraftIcon] = useState(value ?? '')
  const [search, setSearch] = useState('')

  const filteredIconOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return tileIconOptions

    return tileIconOptions.filter((option) => option.label.toLowerCase().includes(normalizedSearch))
  }, [search])

  const previewTile = {
    id: null,
    type: tileType,
    name: tileName || 'Tile',
    icon: draftIcon || '',
    description: '',
  }

  const handleSave = () => {
    onSelect(draftIcon)
    onOpenChange(false)
  }

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      setDraftIcon(value ?? '')
      setSearch('')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose tile icon</DialogTitle>
          <DialogDescription>
            Select an icon for this tile, or choose the letter option to show the first letter of the tile name.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-6 pb-2 lg:grid-cols-[10rem_auto_1fr]">
          <div className="flex items-center justify-center lg:min-h-72">
            <TileCard tile={previewTile} showShadow={false} className="size-24" />
          </div>

          <Separator className="lg:hidden" />
          <Separator orientation="vertical" className="hidden h-full lg:block" />

          <div className="grid gap-3">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <Icon icon={Search01Icon} className="size-4" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search icon"
              />
            </InputGroup>

            <ScrollArea className="max-h-72">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setDraftIcon('')}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border bg-card px-2 py-2 text-center transition-colors hover:bg-muted/40',
                    !draftIcon && 'border-2 border-primary'
                  )}
                >
                  {!draftIcon ? (
                    <Icon icon={CheckmarkCircle02Icon} className="absolute top-2 right-2 size-4 text-primary" />
                  ) : null}
                  <span className="font-display text-5xl font-bold uppercase text-foreground">{(tileName || 'T').charAt(0)}</span>
                  <span className="text-sm text-muted-foreground">First letter</span>
                </button>

                {filteredIconOptions.map((option) => {
                  const isSelected = draftIcon === option.path
                  const iconUrl = getTileIconPublicUrl(option.path)

                  return (
                    <button
                      key={option.path}
                      type="button"
                      onClick={() => setDraftIcon(option.path)}
                      className={cn(
                        'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border bg-card px-2 py-2 text-center transition-colors hover:bg-muted/40',
                        isSelected && 'border-2 border-primary'
                      )}
                    >
                      {isSelected ? (
                        <Icon icon={CheckmarkCircle02Icon} className="absolute top-2 right-2 size-4 text-primary" />
                      ) : null}
                      {iconUrl ? (
                        <img src={iconUrl} alt="" aria-hidden="true" className="size-14 object-contain" />
                      ) : (
                        <span className="font-display text-5xl font-bold uppercase text-foreground">
                          {option.label.charAt(0)}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TileIconPickerDialog
