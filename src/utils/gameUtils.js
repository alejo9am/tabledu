
export const getRandomQuestionForCategory = (category, questions, answers) => {
  if (!category || category.type !== 'question') return null

  const categoryQuestions = questions.filter((q) => q.category_id === category.id)
  if (categoryQuestions.length === 0) {
    console.warn(`[QuestionPool] No questions found for category "${category.name}".`)
    return null
  }

  const answeredIds = new Set(answers.map((a) => a.question_id))
  const unanswered = categoryQuestions.filter((q) => !answeredIds.has(q.id))

  if (unanswered.length === 0) {
    console.warn(
      `[QuestionPool] Category "${category.name}" is exhausted. Reusing previously answered questions.`
    )
  }

  const pool = unanswered.length > 0 ? unanswered : categoryQuestions
  const randomIndex = Math.floor(Math.random() * pool.length)

  return pool[randomIndex]
}

export function getContrastTextColor(hexColor) {
  const normalizedColor = hexColor?.replace('#', '')

  if (!normalizedColor || normalizedColor.length !== 6) {
    return undefined
  }

  const red = Number.parseInt(normalizedColor.slice(0, 2), 16)
  const green = Number.parseInt(normalizedColor.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedColor.slice(4, 6), 16)
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000

  return luminance >= 160 ? '#0f172a' : '#ffffff'
}