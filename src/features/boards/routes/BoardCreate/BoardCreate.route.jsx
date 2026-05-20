import { useState } from 'react'
import { Button } from '@/components/ui/button'
import BoardCreateStepper from '@/features/boards/routes/BoardCreate/components/BoardCreateStepper'
import BoardDetailsPage from '@/features/boards/routes/BoardCreate/pages/BoardDetails.page'
import BoardLayoutPage from '@/features/boards/routes/BoardCreate/pages/BoardLayout.page'
import QuestionCategoriesPage from '@/features/boards/routes/BoardCreate/pages/QuestionCategories.page'

function BoardCreatePage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleBack = () => {
    setCurrentStep((step) => Math.max(1, step - 1))
  }

  const handleNext = () => {
    setCurrentStep((step) => Math.min(3, step + 1))
  }

  const renderStep = () => {
    if (currentStep === 1) return <BoardDetailsPage />
    if (currentStep === 2) return <QuestionCategoriesPage />
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
          <Button type="button" variant="warning" onClick={handleNext} disabled={currentStep === 3}>
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BoardCreatePage
