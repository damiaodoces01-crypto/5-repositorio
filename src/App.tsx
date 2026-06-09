import { useState, useEffect } from 'react';
import { Course, Student, StudentStatus } from './types';
import { INITIAL_COURSES, INITIAL_STUDENTS } from './data';
import { MetricCard } from './components/MetricCard';
import { FinancialSimulator } from './components/FinancialSimulator';
import { StudentList } from './components/StudentList';
import { AddStudentForm } from './components/AddStudentForm';
import { AddCourseForm } from './components/AddCourseForm';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  GraduationCap, 
  HelpCircle, 
  RotateCcw, 
  DollarSign, 
  ShieldAlert,
  Percent,
  TrendingUp as GainIcon,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Load initial courses and students from localStorage if they exist, else use defaults
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('school_dropouts_courses');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch (e) {
      return INITIAL_COURSES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('school_dropouts_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch (e) {
      return INITIAL_STUDENTS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('school_dropouts_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('school_dropouts_students', JSON.stringify(students));
  }, [students]);

  // Handle resets
  const handleResetToDemo = () => {
    if (window.confirm('Tem certeza que deseja restaurar as informações de exemplo originais?')) {
      setCourses(INITIAL_COURSES);
      setStudents(INITIAL_STUDENTS);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja apagar TODOS os dados e começar em branco?')) {
      setCourses([]);
      setStudents([]);
    }
  };

  // State modifying helpers
  const handleAddCourse = (newCourseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`
    };
    setCourses([...courses, newCourse]);
  };

  const handleAddStudent = (newStudentData: {
    name: string;
    courseId: string;
    status: StudentStatus;
    monthsPaid: number;
  }) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `student-${Date.now()}`
    };
    setStudents([...students, newStudent]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleIncrementMonth = (studentId: string) => {
    setStudents(students.map(s => {
      if (s.id !== studentId) return s;
      const course = courses.find(c => c.id === s.courseId);
      if (!course) return s;
      
      const nextMonthsPaid = s.monthsPaid + 1;
      const willBeCompleted = nextMonthsPaid >= course.durationMonths;
      
      return {
        ...s,
        monthsPaid: Math.min(course.durationMonths, nextMonthsPaid),
        status: willBeCompleted ? 'completed' : s.status
      };
    }));
  };

  const handleUpdateStudentStatus = (studentId: string, status: StudentStatus, monthsPaid?: number) => {
    setStudents(students.map(s => {
      if (s.id !== studentId) return s;
      const course = courses.find(c => c.id === s.courseId);
      const limit = course ? course.durationMonths : 12;

      let finalMonthsPaid = monthsPaid !== undefined ? monthsPaid : s.monthsPaid;
      
      // If marking as completed, fill up completed months
      if (status === 'completed') {
        finalMonthsPaid = limit;
      }

      return {
        ...s,
        status,
        monthsPaid: Math.min(limit, Math.max(0, finalMonthsPaid))
      };
    }));
  };

  // ----- Financial Calculations (The heart of Dropout financial impacts) -----
  
  let totalEarned = 0;
  let totalLost = 0;
  let totalProjected = 0;
  let activeCount = 0;
  let completedCount = 0;
  let droppedOutCount = 0;

  students.forEach(student => {
    const course = courses.find(c => c.id === student.courseId);
    if (!course) return;

    const studentEarned = course.monthlyFee * student.monthsPaid;
    totalEarned += studentEarned;

    if (student.status === 'active') {
      activeCount++;
      const studentProjected = course.monthlyFee * (course.durationMonths - student.monthsPaid);
      totalProjected += studentProjected;
    } else if (student.status === 'completed') {
      completedCount++;
    } else if (student.status === 'dropped_out') {
      droppedOutCount++;
      const studentLost = course.monthlyFee * (course.durationMonths - student.monthsPaid);
      totalLost += studentLost;
    }
  });

  const totalRegisteredStudents = students.length;
  const dropoutRate = totalRegisteredStudents > 0 
    ? (droppedOutCount / totalRegisteredStudents) * 100 
    : 0;

  return (
    <div className="min-h-screen pb-16 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Welcome Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 font-sans border border-emerald-200">
                  ⚡ Modo Fácil Ativado
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mt-1">
                Calculadora de Desistência Escolar
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-sans">
                Acompanhe o impacto financeiro da evasão escolar: descubra o valor ganho em caixa e quanto faturamento você deixou de receber.
              </p>
            </div>
            
            {/* Seed Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                title="Restaurar dados de exemplo do sistema"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Usar Dados Exemplo</span>
              </button>
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-150 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-all cursor-pointer"
                title="Limpar todos os Alunos e Cursos"
              >
                <span>Começar do Zero</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* educational banner explain logic ("Modo fácil explicado") */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-3">
            <h3 className="text-slate-800 font-bold text-base sm:text-lg flex items-center gap-2 font-display">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Como a matemática de evasão funciona no Modo Fácil?
            </h3>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-sans">
              Cada aluno possui um contrato mensal com duração definida. Quando um aluno desiste, o faturamento do período que restava é cancelado. 
              Por isso, exibimos <strong>Quanto Ganhou</strong> (meses que o aluno pagou no período em que esteve ativo) versus <strong>Quanto Perdeu</strong> (mensalidades que o aluno se comprometeu do contrato, mas não pagará por ter saído cedo da escola).
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-indigo-100/50 flex flex-col justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Exemplo Clássico</span>
            <div className="mt-2 text-xs font-sans text-slate-700 space-y-1">
              <p>Contrato: 12 meses de R$100</p>
              <p>Desistiu no Mês 3 (pagou 3 meses)</p>
              <div className="pt-1.5 mt-1.5 border-t border-slate-100 font-bold flex justify-between">
                <span className="text-emerald-600">👍 Ganhou: R$ 300</span>
                <span className="text-rose-600">👎 Perdeu: R$ 900</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Bento Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Stat 1: Taxa de Desistência % */}
          <MetricCard
            id="stat-dropout-rate"
            title="Taxa de Desistência Geral"
            value={`${dropoutRate.toFixed(1)}%`}
            description={`${droppedOutCount} de ${totalRegisteredStudents} alunos cancelados`}
            icon={<Percent className="w-6 h-6 text-indigo-600" />}
            colorClass="bg-indigo-50 text-indigo-600"
            trend={dropoutRate > 15 ? 'Evasão Alta' : dropoutRate > 0 ? 'Sob Controle' : 'Excelente 0%'}
            trendDirection={dropoutRate > 15 ? 'down' : 'up'}
          />

          {/* Stat 2: Faturamento Ganho (Em Caixa) */}
          <MetricCard
            id="stat-earned"
            title="Faturamento Ganho (Recebido)"
            value={`R$ ${totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            description="Total já cobrado e faturado na conta"
            icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
            colorClass="bg-emerald-50 text-emerald-600"
            trend={`Média: R$ ${totalRegisteredStudents > 0 ? (totalEarned / totalRegisteredStudents).toFixed(0) : '0'}/aluno`}
            trendDirection="neutral"
          />

          {/* Stat 3: Faturamento Perdido (Evasão) */}
          <MetricCard
            id="stat-lost"
            title="Faturamento Perdido"
            value={`R$ ${totalLost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            description="Deixou de entrar devido aos desistentes"
            icon={<ShieldAlert className="w-6 h-6 text-rose-600" />}
            colorClass="bg-rose-50 text-rose-600"
            trend={totalLost > 0 ? `Desperdício financeiro` : 'Nenhum desperdício'}
            trendDirection={totalLost > 0 ? 'down' : 'up'}
          />

          {/* Stat 4: Previsão Futura de Ativos */}
          <MetricCard
            id="stat-projected"
            title="Previsão de Ativos (Futuro)"
            value={`R$ ${totalProjected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            description="Valor contratado restante a vencer"
            icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
            colorClass="bg-blue-50 text-blue-600"
            trend={`${activeCount} alunos ativos`}
            trendDirection="neutral"
          />

        </section>

        {/* Dynamic Simulator Section */}
        <section>
          <FinancialSimulator 
            id="retention-simulator-widget"
            totalLost={totalLost} 
            droppedOutStudentsCount={droppedOutCount} 
          />
        </section>

        {/* Inner Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Alunos list (takes 2 sections) */}
          <div className="lg:col-span-2">
            <StudentList
              id="student-list-container"
              students={students}
              courses={courses}
              onUpdateStudentStatus={handleUpdateStudentStatus}
              onIncrementMonth={handleIncrementMonth}
              onDeleteStudent={handleDeleteStudent}
            />
          </div>

          {/* Right Column: Registrations & Administration (takes 1 section) */}
          <div className="space-y-6">
            
            {/* Form 1: Add new student */}
            <AddStudentForm
              id="registration-student-form"
              courses={courses}
              onAddStudent={handleAddStudent}
            />

            {/* Form 2: Add new course configuration */}
            <AddCourseForm
              id="registration-course-form"
              onAddCourse={handleAddCourse}
            />

            {/* Quick tips about Easy Mode math */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-3xl p-5 text-amber-900 shadow-3xs">
              <h4 className="font-bold text-xs uppercase tracking-widest text-amber-800 font-sans flex items-center gap-1.5">
                💡 Por que acompanhar perdas?
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed font-sans mt-2">
                Muitas escolas consideram apenas o faturamento recebido atual e ignoram o custo implícito da evasão. 
                Saber exatamente quanto cada desistência custou ao seu fluxo de caixa ajuda a justificar pequenos investimentos em suporte, acompanhamento pedagógico de alunos desajustados ou descontos pontuais de fidelização.
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* Footer credit bar */}
      <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400 font-sans space-y-1">
        <p>© 2026 Calculadora de Desistência Escolar • Licenciado no Modo Fácil (Visual & Intuitivo)</p>
        <p>Desenvolvido para acompanhamento simplificado de faturamento escolar de cursos livres.</p>
      </footer>

    </div>
  );
}
