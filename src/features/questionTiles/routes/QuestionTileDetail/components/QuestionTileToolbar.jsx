import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

function QuestionTileToolbar({ search, onSearchChange, answerFilter, onAnswerFilterChange, filteredCount, totalCount }) {
  const answerTriggerClassName = answerFilter === 'true'
    ? 'border-success-700 bg-success-200 text-success-700'
    : answerFilter === 'false'
      ? 'border-destructive-700 bg-destructive-200 text-destructive-700'
      : null

  return (
    <div className="rounded-2xl border bg-card p-3 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_7rem_8rem] sm:items-center">
        <div className="hidden sm:block" />

        <InputGroup className="w-full max-w-sm">
          <InputGroupAddon>
            <InputGroupText>
              <Icon icon={Search01Icon} className="size-4" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search question text"
          />
          {search ? (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <Icon icon={Cancel01Icon} className="size-3.5" />
              </Button>
            </InputGroupAddon>
          ) : null}
        </InputGroup>

        <div className="flex items-center justify-between sm:justify-end sm:gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="answer-filter" className="text-sm font-medium text-muted-foreground">Answer</label>
            <Select
              value={answerFilter}
              onValueChange={onAnswerFilterChange}
            >
              <SelectTrigger id="answer-filter" className={`h-9 w-28 border-0 ${answerTriggerClassName}`}>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem
                  value="true"
                  className="text-success-700 data-[state=checked]:bg-success-200"
                >
                  True
                </SelectItem>
                <SelectItem
                  value="false"
                  className="text-destructive-700 data-[state=checked]:bg-destructive-200"
                >
                  False
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-muted-foreground sm:hidden">{filteredCount} of {totalCount}</span>
        </div>

        <p className="hidden text-sm text-muted-foreground sm:block sm:text-right sm:pr-2">{filteredCount} of {totalCount}</p>
      </div>
    </div>
  )
}

export default QuestionTileToolbar
