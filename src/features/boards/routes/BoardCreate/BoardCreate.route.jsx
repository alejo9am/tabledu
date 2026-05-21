import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import BoardCreateStepper from '@/features/boards/routes/BoardCreate/components/BoardCreateStepper'
import { useBoardCreateForm } from '@/features/boards/routes/BoardCreate/hooks/useBoardCreateForm.hook'
import BoardLayoutPage from '@/features/boards/routes/BoardCreate/pages/BoardLayout.page'
import QuestionTilesPage from '@/features/boards/routes/BoardCreate/pages/QuestionTiles.page'
import SpecialTilesPage from '@/features/boards/routes/BoardCreate/pages/SpecialTiles.page'
import { cn } from '@/lib/utils'

function BoardCreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const form = useBoardCreateForm()
  const stepValidationError = form.getStepValidationError(currentStep)

  const handleBack = () => {
    setCurrentStep((step) => Math.max(1, step - 1))
  }

  const handleNext = () => {
    if (stepValidationError) {
      toast.error(stepValidationError)
      return
    }

    setCurrentStep((step) => Math.min(3, step + 1))
  }

  const renderStep = () => {
    if (currentStep === 1) return <SpecialTilesPage form={form} />
    if (currentStep === 2) return <QuestionTilesPage />
    return <BoardLayoutPage />
  }

  return (
    <section className="flex flex-1 flex-col p-4 pt-0" aria-label="Create board page">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
        <BoardCreateStepper currentStep={currentStep} />

        {renderStep()}

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
            Back
          </Button>
          <Button
            type="button"
            variant="warning"
            onClick={handleNext}
            disabled={currentStep === 3}
            aria-disabled={Boolean(stepValidationError)}
            className={cn(stepValidationError && 'cursor-not-allowed opacity-50 hover:bg-warning')}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BoardCreatePage
