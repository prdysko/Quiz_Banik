import { users, quizQuestions, quizSessions, type User, type InsertUser, type QuizQuestion, type InsertQuizQuestion, type QuizSession, type InsertQuizSession } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, QuizQuestion>;
  private sessions: Map<number, QuizSession>;
  private currentUserId: number;
  private currentQuestionId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentSessionId = 1;

    // Initialize with Baník Ostrava quiz questions
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const questionData = [
      {"text": "Baník Ostrava získal svůj první titul mistra Československa v roce 1976", "answer": "True"},
      {"text": "Baník Ostrava byl založen v roce 1922 jako SK Slezská Ostrava", "answer": "True"},
      {"text": "V sezóně 2003/2004 Baník Ostrava vyhrál českou nejvyšší ligu", "answer": "True"},
      {"text": "Stadion Bazaly byl domovským stadionem Baníku až do roku 2014", "answer": "False"},
      {"text": "Baník Ostrava odehrál své domácí zápasy v sezóně 2020/2021 na Městském stadionu v Ostravě-Vítkovicích", "answer": "True"},
      {"text": "Baník Ostrava nikdy nehrál semifinále evropského poháru", "answer": "False"},
      {"text": "Baník Ostrava vyhrál československou ligu celkem pětkrát", "answer": "False"},
      {"text": "Nejvíce ligových gólů za Baník Ostrava vstřelil Milan Baroš", "answer": "False"},
      {"text": "V roce 1980 Baník vyhrál Československý pohár", "answer": "True"},
      {"text": "Fanoušci baníku jsou přezdíváni Chachaři", "answer": "True"},
      {"text": "Historicky nejúspěšnějším trenérem Baníku je Evžen Hadamczik", "answer": "True"},
      {"text": "Baník Ostrava nikdy nesestoupil do druhé ligy", "answer": "False"},
      {"text": "Milan Baroš ukončil kariéru právě v dresu Baníku Ostrava", "answer": "True"},
      {"text": "V 70. letech hrál za Baník známý útočník Václav Daněk", "answer": "False"},
      {"text": "Je nejlepším střelcem Baníku hráč, který dal přes 100 gólů?", "answer": "True"},
      {"text": "Největšími rivaly Baníku jsou Sparta Praha a Sigma Olomouc", "answer": "True"},
      {"text": "Baník Ostrava má partnerský klub v Polsku", "answer": "True"},
      {"text": "V roce 2005 Baník Ostrava sestoupil do druhé ligy", "answer": "False"},
      {"text": "Baník Ostrava se účastnil základní skupiny Ligy mistrů UEFA", "answer": "False"},
      {"text": "Před přestěhováním na Městský stadion proběhla rozsáhlá rekonstrukce Bazalů", "answer": "False"},
      {"text": "Baník Ostrava hraje tradičně v modro-bílých dresech", "answer": "True"},
      {"text": "Slavný obránce Tomáš Ujfaluši začínal kariéru v Baníku Ostrava", "answer": "True"},
      {"text": "Baník Ostrava byl založen během první světové války", "answer": "False"},
      {"text": "V historii Baníku nikdy nepůsobil žádný zahraniční trenér", "answer": "False"},
      {"text": "Legendární brankář Jan Laštůvka chytal za Baník Ostrava", "answer": "True"},
      {"text": "Baník Ostrava měl v minulosti sekci házené", "answer": "True"},
      {"text": "Získal Baník Ostrava někdy domácí double (liga + pohár) během jedné sezóny?", "answer": "False"},
      {"text": "Baník Ostrava nikdy nehrál finále domácího poháru", "answer": "False"},
      {"text": "Z Baníku Ostrava vzešlo několik českých reprezentantů", "answer": "True"},
      {"text": "Kapitánem Baníku Ostrava v roce 2022 byl Daniel Holzer", "answer": "False"}
    ];

    questionData.forEach((q, index) => {
      const question: QuizQuestion = {
        id: index + 1,
        text: q.text,
        answer: q.answer
      };
      this.questions.set(question.id, question);
    });
    this.currentQuestionId = questionData.length + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.questions.values());
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = this.currentSessionId++;
    const session: QuizSession = {
      id,
      score: insertSession.score || 0,
      totalQuestions: insertSession.totalQuestions || 0,
      completedAt: insertSession.completedAt || null
    };
    this.sessions.set(id, session);
    return session;
  }
}

export const storage = new MemStorage();
