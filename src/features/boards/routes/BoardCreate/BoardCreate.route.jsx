import { useState } from 'react'
import { toast } from 'sonner'
import BoardCreateStepper from '@/features/boards/routes/BoardCreate/components/BoardCreateStepper'
import { useBoardCreateForm } from '@/features/boards/routes/BoardCreate/hooks/useBoardCreateForm.hook'
import BoardInfoPage from '@/features/boards/routes/BoardCreate/pages/BoardInfo.page'
import BoardLayoutPage from '@/features/boards/routes/BoardCreate/pages/BoardLayout.page'
import QuestionTilesPage from '@/features/boards/routes/BoardCreate/pages/QuestionTiles.page'
import SpecialTilesPage from '@/features/boards/routes/BoardCreate/pages/SpecialTiles.page'

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

    setCurrentStep((step) => Math.min(4, step + 1))
  }

  const renderStep = () => {
    if (currentStep === 1) return <BoardInfoPage form={form} />
    if (currentStep === 2) return <SpecialTilesPage form={form} />
    if (currentStep === 3) return <QuestionTilesPage />
    return <BoardLayoutPage />
  }

  return (
    <section className="flex flex-1 flex-col p-4 pt-0" aria-label="Create board page">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4">
        <BoardCreateStepper
          currentStep={currentStep}
          onBack={handleBack}
          onNext={handleNext}
          stepValidationError={stepValidationError}
        />

        {renderStep()}
      </div>
    </section>
  )
}

export default BoardCreatePage
