import { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Hearts } from './Hearts'
import { useSQLGame } from '@/hooks/useSQLGame'
import { SQLFixItem } from '@/types/game'
import { CheckCircle2, XCircle, Code } from 'lucide-react'

interface LevelOneSQLGameProps {
  questions: SQLFixItem[]
  onComplete: () => void
}

export function LevelOneSQLGame({ questions, onComplete }: LevelOneSQLGameProps) {
  const {
    currentIndex,
    currentQuestion,
    hearts,
    userAnswer,
    setUserAnswer,
    isLocked,
    isCorrect,
    showAnswer,
    submitAnswer,
    totalQuestions,
  } = useSQLGame({ questions, onComplete })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea when question changes
  useEffect(() => {
    if (textareaRef.current && !isLocked) {
      textareaRef.current.focus()
    }
  }, [currentIndex, isLocked])

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      submitAnswer()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Level 1: SQL Typo Fixing</CardTitle>
              <CardDescription>
                Question {currentIndex + 1} of {totalQuestions}
              </CardDescription>
            </div>
            <Hearts count={hearts} maxCount={2} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Display */}
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <div className="flex items-start gap-3">
              <Code className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Task:</p>
                <p className="text-lg font-mono text-gray-900 whitespace-pre-wrap break-words">
                  {currentQuestion.task}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label htmlFor="sql-answer" className="text-sm font-medium text-gray-700">
              Type the corrected SQL query:
            </label>
            <Textarea
              id="sql-answer"
              ref={textareaRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLocked}
              placeholder="Enter your corrected SQL query here..."
              className="font-mono text-base min-h-[120px] resize-none"
            />
            <p className="text-xs text-gray-500">
              Press Ctrl+Enter (or Cmd+Enter on Mac) to submit
            </p>
          </div>

          {/* Feedback Messages */}
          {isCorrect === true && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Correct! 🎉</p>
                <p className="text-sm text-green-700">Moving to next question...</p>
              </div>
            </div>
          )}

          {isCorrect === false && hearts > 0 && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-900">Incorrect</p>
                <p className="text-sm text-red-700">Try again! You have {hearts} heart{hearts !== 1 ? 's' : ''} remaining.</p>
              </div>
            </div>
          )}

          {showAnswer && (
            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
              <p className="font-medium text-yellow-900 mb-2">Correct Answer:</p>
              <p className="font-mono text-base text-yellow-800 bg-yellow-100 p-3 rounded break-words">
                {currentQuestion.answer}
              </p>
              <p className="text-sm text-yellow-700 mt-2">Moving to next question...</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={submitAnswer}
            disabled={isLocked || !userAnswer.trim()}
            className="w-full"
            size="lg"
          >
            {isLocked ? (
              'Processing...'
            ) : (
              'Submit Answer'
            )}
          </Button>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

