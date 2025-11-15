import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameContentItem, MCQ, Flashcard, FillInTheBlank, MiniQuiz } from '@/types/game'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'

interface GameContentProps {
  content: GameContentItem[]
}

export function GameContent({ content }: GameContentProps) {
  const [flashcardFlipped, setFlashcardFlipped] = useState<{ [key: number]: boolean }>({})
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: number]: number | null }>({})
  const [fillAnswers, setFillAnswers] = useState<{ [key: string]: string }>({})
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({})

  const renderMCQ = (mcq: MCQ, index: number) => {
    const userAnswer = mcqAnswers[index] ?? null
    const showResult = showResults[index]

    return (
      <Card key={index} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{mcq.question}</p>
          <div className="space-y-2">
            {mcq.options.map((option, optIndex) => {
              const isSelected = userAnswer === optIndex
              const isCorrect = optIndex === mcq.correctAnswer
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <button
                  key={optIndex}
                  onClick={() => {
                    if (!showResult) {
                      setMcqAnswers({ ...mcqAnswers, [index]: optIndex })
                    }
                  }}
                  disabled={showResult}
                  className={`w-full text-left p-3 rounded-md border-2 transition-colors ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                      </>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          {showResult && mcq.explanation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-900">{mcq.explanation}</p>
            </div>
          )}
          <Button
            onClick={() => setShowResults({ ...showResults, [index]: !showResult })}
            variant="outline"
            size="sm"
          >
            {showResult ? 'Hide Answer' : 'Check Answer'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderFlashcard = (flashcard: Flashcard, index: number) => {
    const isFlipped = flashcardFlipped[index] || false

    return (
      <Card key={index} className="mb-4">
        <CardContent className="p-6">
          <div
            className="relative h-64 cursor-pointer perspective-1000"
            onClick={() => setFlashcardFlipped({ ...flashcardFlipped, [index]: !isFlipped })}
          >
            <div
              className="absolute inset-0 w-full h-full transform-style-3d transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <div
                className="absolute inset-0 w-full h-full backface-hidden bg-primary text-primary-foreground rounded-lg flex items-center justify-center p-6 shadow-lg"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <p className="text-xl font-medium text-center">{flashcard.front}</p>
              </div>
              <div
                className="absolute inset-0 w-full h-full backface-hidden bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center p-6 shadow-lg"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  WebkitTransform: 'rotateY(180deg)',
                }}
              >
                <p className="text-xl font-medium text-center">{flashcard.back}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setFlashcardFlipped({ ...flashcardFlipped, [index]: !isFlipped })}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Flip Card
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderFillInTheBlank = (fill: FillInTheBlank, index: number) => {
    const showResult = showResults[index]
    const parts = fill.sentence.split(/(___)/g)
    let blankIndex = 0

    return (
      <Card key={index} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Fill in the Blanks {index + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {parts.map((part, partIndex) => {
              if (part === '___') {
                const blank = fill.blanks[blankIndex]
                const answerKey = `${index}-${blankIndex}`
                const userAnswer = fillAnswers[answerKey] || ''
                const isCorrect = userAnswer.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim()
                blankIndex++

                return (
                  <span key={partIndex} className="inline-block">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => {
                        setFillAnswers({ ...fillAnswers, [answerKey]: e.target.value })
                      }}
                      disabled={showResult}
                      className={`inline-block w-32 mx-1 px-2 py-1 border-2 rounded ${
                        showResult
                          ? isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {showResult && (
                      <span className="ml-2 text-sm">
                        {isCorrect ? (
                          <CheckCircle2 className="inline h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-red-500">
                            (Correct: {blank.correctAnswer})
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                )
              }
              return <span key={partIndex}>{part}</span>
            })}
          </div>
          <Button
            onClick={() => setShowResults({ ...showResults, [index]: !showResult })}
            variant="outline"
            size="sm"
          >
            {showResult ? 'Hide Answer' : 'Check Answer'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderMiniQuiz = (quiz: MiniQuiz, index: number) => {
    return (
      <Card key={index} className="mb-4">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.timeLimit && (
            <CardDescription>Time Limit: {quiz.timeLimit} seconds</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((question, qIndex) => renderMCQ(question, qIndex))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generated Learning Content</CardTitle>
          <CardDescription>
            {content.length} item{content.length !== 1 ? 's' : ''} generated from your PDF
          </CardDescription>
        </CardHeader>
      </Card>

      {content.map((item, index) => {
        switch (item.type) {
          case 'mcq':
            return renderMCQ(item.data as MCQ, index)
          case 'flashcard':
            return renderFlashcard(item.data as Flashcard, index)
          case 'fill-in-the-blank':
            return renderFillInTheBlank(item.data as FillInTheBlank, index)
          case 'mini-quiz':
            return renderMiniQuiz(item.data as MiniQuiz, index)
          default:
            return null
        }
      })}
    </div>
  )
}

