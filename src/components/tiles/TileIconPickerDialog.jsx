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
import { getTileIconPublicUrl } from '@/services/storage'

const tileIconOptions = [
  { path: 'system/lightbulb.png', label: 'Lightbulb' },
  { path: 'system/padlock.png', label: 'Lock' },
  { path: 'system/hourglass.png', label: 'Hourglass' },
  { path: 'system/shield.png', label: 'Shield' },
  { path: 'system/hacker.png', label: 'Hacker' },
  { path: 'system/pipe.png', label: 'Pipe' },
  { path: 'system/swords.png', label: 'Swords' },
  { path: 'system/special_ladder.png', label: 'Ladder' }, 
  { path: 'system/anatomy.png', label: 'Anatomy' },
  { path: 'system/cell.png', label: 'Cell' },
  { path: 'system/earth.png', label: 'Earth' },
  { path: 'system/plant.png', label: 'Plant' },
  { path: 'system/dna.png', label: 'DNA' },
  { path: 'system/geology.png', label: 'Geology' },
  { path: 'system/square.png', label: 'Square' },
  { path: 'system/triangle.png', label: 'Triangle' },
  { path: 'system/rhombus.png', label: 'Rhombus' },
  { path: 'system/hexagon.png', label: 'Hexagon' },
  { path: 'system/cross.png', label: 'Cross' },
  { path: 'system/special_bolt.png', label: 'Bolt' },
  { path: 'system/special_boxing.png', label: 'Boxing' },
  { path: 'system/special_clamp.png', label: 'Clamp' },
  { path: 'system/special_clover.png', label: 'Clover' },
  { path: 'system/special_dice.png', label: 'Dice' },
  { path: 'system/special_fight.png', label: 'Fight' },
  { path: 'system/special_thief.png', label: 'Thief' },
  { path: 'system/special_thunder collision.png', label: 'Collision' },
  { path: 'system/brass.png', label: 'Brass' },
  { path: 'system/music_attack.png', label: 'Music Battle' },
  { path: 'system/Percussion.png', label: 'Percussion' },
  { path: 'system/special_silence.png', label: 'Silence' },
  { path: 'system/treble_clef.png', label: 'Treble Clef' },
  { path: 'system/woodwind.png', label: 'Woodwind' },
  { path: 'system/string.png', label: 'String' },
  { path: 'system/note.png', label: 'Notes' },
   { path: 'system/special_thunder collision.png', label: 'Collision' },
  { path: 'system/3R.png', label: '3 R´s' },
  { path: 'system/bin.png', label: 'Bin' },
  { path: 'system/climatechange.png', label: 'Climate Change' },
  { path: 'system/habits.png', label: 'Environmental Habits' },
  { path: 'system/industry.png', label: 'Industry Process' },
  { path: 'system/insect.png', label: 'Insects' },
  { path: 'system/oceans.png', label: 'Oceans' },
  { path: 'system/recycle.png', label: 'Recycle' },
]

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
                        <img src={iconUrl} alt={option.label} className="size-14 object-contain" />
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
