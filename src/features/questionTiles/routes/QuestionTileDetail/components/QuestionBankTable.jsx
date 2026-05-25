import { useEffect, useRef } from 'react'
import { Add01Icon, Cancel01Icon, CheckmarkCircle02Icon, Delete02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function QuestionBankTable({ model }) {
  // Ref to the inline edit input (existing row) so we can focus it when edit mode starts.
  const rowInputRef = useRef(null)
  // Ref to the new-question draft input so user can type immediately after opening add row.
  const newQuestionInputRef = useRef(null)

  useEffect(() => {
    // Autofocus the current row input when switching a row into edit mode.
    if (model.editingRowId && rowInputRef.current) {
      rowInputRef.current.focus()
    }
  }, [model.editingRowId])

  useEffect(() => {
    // Autofocus the draft input when showing the "add question" row.
    if (model.isAddingRow && newQuestionInputRef.current) {
      newQuestionInputRef.current.focus()
    }
  }, [model.isAddingRow])

  const handleRowEditInputKeyDown = (event, questionId) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      model.cancelRowEdit()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      model.confirmRowEdit(questionId)
    }
  }

  const handleNewQuestionInputKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      model.cancelAddRow()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      model.confirmAddRow()
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="w-10 p-3">
              <Checkbox
                checked={
                  model.allVisibleSelected
                    ? true
                    : model.filteredQuestions.some((question) => model.selectedQuestionIds.includes(question.id))
                      ? 'indeterminate'
                      : false
                }
                onCheckedChange={(checked) => model.toggleSelectAllVisible(checked === true)}
                aria-label="Select all visible questions"
              />
            </th>
            <th className="p-3">Question</th>
            <th className="w-28 p-3">Answer</th>
            <th className="w-32 p-3" />
          </tr>
        </thead>
        <tbody>
          {/* Existing questions rows */}
          {model.filteredQuestions.map((question) => {
            const isEditing = model.editingRowId === question.id
            const isSelected = model.selectedQuestionIds.includes(question.id)
            const answerValue = isEditing ? model.editingRowAnswer : question.answer

            return (
              <tr key={question.id} className={`border-b ${isEditing ? 'bg-primary/8' : ''} ${isSelected ? 'bg-primary/6' : ''}`}>
                <td className="p-3 align-middle">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => model.toggleQuestionSelection(question.id, checked === true)}
                    aria-label={`Select question ${question.text}`}
                  />
                </td>
                <td className="p-3 align-middle">
                  {isEditing ? (
                    <Input
                      ref={rowInputRef}
                      value={model.editingRowText}
                      onChange={(event) => model.setEditingRowText(event.target.value)}
                      onKeyDown={(event) => handleRowEditInputKeyDown(event, question.id)}
                    />
                  ) : (
                    <button type="button" className="w-full text-left" onClick={() => model.beginRowEdit(question)}>
                      {question.text}
                    </button>
                  )}
                </td>
                <td className="p-3 align-middle">
                  {/* Answer is staged during row edit and persisted on row confirm. */}
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${answerValue ? 'bg-success-200 text-success-700' : 'bg-destructive-200 text-destructive-700'} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={() => model.setEditingRowAnswer((current) => !current)}
                    disabled={!isEditing || model.isSavingRow}
                  >
                    {answerValue ? 'True' : 'False'}
                  </button>
                </td>
                <td className="p-3 align-middle">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon-sm" variant="outline" onClick={() => model.confirmRowEdit(question.id)} disabled={model.isSavingRow}>
                            <Icon icon={CheckmarkCircle02Icon} className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save row</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon-sm" variant="outline" onClick={model.cancelRowEdit} disabled={model.isSavingRow}>
                            <Icon icon={Cancel01Icon} className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel edit</TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon-sm" variant="ghost" onClick={() => model.beginRowEdit(question)}>
                            <Icon icon={Edit02Icon} className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit row</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon-sm" variant="destructive-soft" onClick={() => model.requestDeleteQuestion(question.id)}>
                            <Icon icon={Delete02Icon} className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete question</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}

          {/* Draft row for creating a new question */}
          {model.isAddingRow ? (
            <tr className="border-b bg-primary-200">
              <td className="p-3" />
              <td className="p-3">
                <Input
                  ref={newQuestionInputRef}
                  className="bg-card border border-primary-700"
                  value={model.newQuestionText}
                  onChange={(event) => model.setNewQuestionText(event.target.value)}
                  onKeyDown={handleNewQuestionInputKeyDown}
                  placeholder="Type a question"
                  disabled={model.isSavingNewQuestion}
                />
              </td>
              <td className="p-3">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${model.newQuestionAnswer ? 'bg-success-200 text-success-700' : 'bg-destructive-200 text-destructive-700'}`}
                  onClick={() => model.setNewQuestionAnswer((current) => !current)}
                >
                  {model.newQuestionAnswer ? 'True' : 'False'}
                </button>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-2">
                  <Button size="icon-sm" variant="outline" onClick={model.confirmAddRow} disabled={model.isSavingNewQuestion}>
                    <Icon icon={CheckmarkCircle02Icon} className="size-4" />
                  </Button>
                  <Button size="icon-sm" variant="outline" onClick={model.cancelAddRow} disabled={model.isSavingNewQuestion}>
                    <Icon icon={Cancel01Icon} className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ) : null}

          {/* Row-level trigger to start draft mode */}
          <tr>
            <td colSpan={4} className="p-3">
              <Button type="button" variant="warning" size="sm" onClick={model.openAddRow}>
                <Icon icon={Add01Icon} className="size-4" />
                Add question
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default QuestionBankTable
