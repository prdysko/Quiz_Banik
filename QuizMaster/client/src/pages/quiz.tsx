import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, RotateCcw, Share, Zap, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { QuizQuestion } from "@shared/schema";

interface QuizState {
  currentQuestionIndex: number;
  score: number;
  gameState: 'playing' | 'finished';
  showFeedback: boolean;
  lastAnswerCorrect: boolean;
}

export default function Quiz() {
  const { toast } = useToast();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    gameState: 'playing',
    showFeedback: false,
    lastAnswerCorrect: false,
  });

  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz/questions'],
  });

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: { score: number; totalQuestions: number; completedAt: string }) => {
      return apiRequest('POST', '/api/quiz/sessions', sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/sessions'] });
    },
  });

  const currentQuestion = questions?.[quizState.currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? ((quizState.currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const finalPercentage = totalQuestions > 0 ? Math.round((quizState.score / totalQuestions) * 100) : 0;

  const handleAnswer = (userAnswer: boolean) => {
    if (!currentQuestion || quizState.showFeedback) return;

    const isCorrect = (userAnswer.toString() === currentQuestion.answer.toLowerCase());
    
    setQuizState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      showFeedback: true,
      lastAnswerCorrect: isCorrect,
    }));

    if (isCorrect) {
      toast({
        title: "Správně! ✅",
        description: "Výborná znalost Baníku!",
      });
    } else {
      toast({
        title: "Špatně ❌",
        description: `Správná odpověď: ${currentQuestion.answer === "True" ? "Pravda" : "Nepravda"}`,
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex + 1 >= totalQuestions) {
      // Quiz finished
      setQuizState(prev => ({
        ...prev,
        gameState: 'finished',
        showFeedback: false,
      }));
      
      // Save session
      saveSessionMutation.mutate({
        score: quizState.score,
        totalQuestions,
        completedAt: new Date().toISOString(),
      });
    } else {
      // Next question
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
      }));
    }
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      gameState: 'playing',
      showFeedback: false,
      lastAnswerCorrect: false,
    });
  };

  const shareResults = () => {
    const text = `Právě jsem dokončil kvíz o Baníku Ostrava s výsledkem ${quizState.score}/${totalQuestions} (${finalPercentage}%)! 🔵⚪`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Baník Ostrava Kvíz',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Zkopírováno! 📋",
        description: "Výsledek byl zkopírován do schránky",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banik-blue mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Načítání kvízu...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-error mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Chyba při načítání</h2>
            <p className="text-slate-600">Nepodařilo se načíst otázky kvízu.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="text-center mb-8">
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Zap className="text-banik-blue text-4xl mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-banik-blue">Baník Ostrava Kvíz</h1>
          </div>
          <p className="text-slate-600 text-lg">Otestuj své znalosti o legendárním klubu!</p>
        </Card>
      </header>

      {quizState.gameState === 'playing' ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Postup</span>
              <span className="text-sm font-medium text-banik-blue">
                {quizState.currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </Card>

          {/* Score Display */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="text-yellow-500 text-2xl mr-3" />
                <span className="text-lg font-semibold text-slate-700">Aktuální skóre:</span>
              </div>
              <div className="text-2xl font-bold text-banik-blue">
                {quizState.score}/{quizState.currentQuestionIndex + (quizState.showFeedback ? 1 : 0)}
              </div>
            </div>
          </Card>

          {/* Question Card */}
          {currentQuestion && (
            <Card className="p-8 transform transition-all duration-300 hover:shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Otázka {quizState.currentQuestionIndex + 1}
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>

              {!quizState.showFeedback ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="group bg-success hover:bg-green-600 text-white font-semibold py-4 px-8 h-auto transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    size="lg"
                  >
                    <div className="flex items-center justify-center">
                      <CheckCircle className="text-2xl mr-3" />
                      <span className="text-xl">Pravda</span>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="group bg-error hover:bg-red-600 text-white font-semibold py-4 px-8 h-auto transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    size="lg"
                  >
                    <div className="flex items-center justify-center">
                      <XCircle className="text-2xl mr-3" />
                      <span className="text-xl">Nepravda</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <Card className="bg-slate-50 p-6">
                  <div className="flex items-center justify-center mb-4">
                    {quizState.lastAnswerCorrect ? (
                      <div className="flex items-center text-success">
                        <CheckCircle className="text-3xl mr-3" />
                        <span className="text-xl font-semibold">Správně!</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-error">
                        <XCircle className="text-3xl mr-3" />
                        <span className="text-xl font-semibold">Špatně!</span>
                      </div>
                    )}
                  </div>
                  
                  {!quizState.lastAnswerCorrect && (
                    <div className="text-center mb-4">
                      <p className="text-slate-600">
                        Správná odpověď je: <span className="font-semibold text-banik-blue">
                          {currentQuestion.answer === "True" ? "Pravda" : "Nepravda"}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <Button
                    onClick={nextQuestion}
                    className="w-full bg-banik-blue hover:bg-blue-800 text-white font-semibold py-3 px-6"
                  >
                    {quizState.currentQuestionIndex + 1 >= totalQuestions ? 'Dokončit kvíz' : 'Další otázka'}
                    <ArrowRight className="ml-2" />
                  </Button>
                </Card>
              )}
            </Card>
          )}
        </div>
      ) : (
        /* Final Results */
        <div className="space-y-6">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <Trophy className="text-banik-blue text-5xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-banik-blue mb-2">Kvíz dokončen!</h2>
              <p className="text-lg text-slate-600">Skvělá práce, fanoušku Baníku!</p>
            </div>

            <Card className="bg-gradient-to-r from-banik-blue to-banik-light p-6 mb-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Tvé konečné skóre</h3>
              <div className="text-4xl font-bold">
                {quizState.score}/{totalQuestions}
              </div>
              <div className="text-blue-100 mt-2">
                {finalPercentage}% správných odpovědí
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={restartQuiz}
                className="bg-success hover:bg-green-600 text-white font-semibold py-3 px-6 transform hover:scale-105"
              >
                <RotateCcw className="mr-2" />
                Zkusit znovu
              </Button>
              
              <Button
                onClick={shareResults}
                className="bg-banik-blue hover:bg-blue-800 text-white font-semibold py-3 px-6 transform hover:scale-105"
              >
                <Share className="mr-2" />
                Sdílet výsledek
              </Button>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Rozložení odpovědí</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{quizState.score}</div>
                <div className="text-sm text-slate-600">Správné</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">{totalQuestions - quizState.score}</div>
                <div className="text-sm text-slate-600">Nesprávné</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-12 py-6">
        <div className="text-slate-500 text-sm">
          <p className="mb-2">© 2024 Baník Ostrava Kvíz</p>
          <p className="flex items-center justify-center">
            <span className="text-red-500 mx-1">❤️</span>
            Vytvořeno s láskou pro fanoušky modro-bílých
            <span className="text-red-500 mx-1">❤️</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
