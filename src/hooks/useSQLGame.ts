import { useState, useCallback } from 'react'
import { SQLFixItem } from '@/types/game'
import { normalizeSql } from '@/utils/normalizeSql'

interface UseSQLGameProps {
  questions: SQLFixItem[]
  onComplete: () => void
}

export function useSQLGame({ questions, onComplete }: UseSQLGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hearts, setHearts] = useState(2)
  const [userAnswer, setUserAnswer] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const goToNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      onComplete()
    } else {
      setCurrentIndex((prev) => prev + 1)
      setUserAnswer('')
      setIsLocked(false)
      setIsCorrect(null)
      setShowAnswer(false)
    }
  }, [isLastQuestion, onComplete])

  const submitAnswer = useCallback(() => {
    if (isLocked || !userAnswer.trim()) return

    const normalizedUserAnswer = normalizeSql(userAnswer)
    const normalizedCorrectAnswer = normalizeSql(currentQuestion.answer)

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      // Correct answer
      setIsCorrect(true)
      setIsLocked(true)
      
      // Auto-advance after 1 second
      setTimeout(() => {
        goToNextQuestion()
      }, 1000)
    } else {
      // Wrong answer
      setIsCorrect(false)
      const newHearts = hearts - 1
      setHearts(newHearts)

      if (newHearts === 0) {
        // No hearts left - show answer and auto-advance
        setIsLocked(true)
        setShowAnswer(true)
        
        setTimeout(() => {
          goToNextQuestion()
        }, 2000)
      } else {
        // Still has hearts - allow retry
        setUserAnswer('')
      }
    }
  }, [userAnswer, currentQuestion, hearts, isLocked, goToNextQuestion])

  const resetGame = useCallback(() => {
    setCurrentIndex(0)
    setHearts(2)
    setUserAnswer('')
    setIsLocked(false)
    setIsCorrect(null)
    setShowAnswer(false)
  }, [])

  return {
    currentIndex,
    currentQuestion,
    hearts,
    userAnswer,
    setUserAnswer,
    isLocked,
    isCorrect,
    showAnswer,
    isLastQuestion,
    submitAnswer,
    goToNextQuestion,
    resetGame,
    totalQuestions: questions.length,
  }
}

