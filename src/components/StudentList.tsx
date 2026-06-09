import React, { useState } from 'react';
import { Student, Course, StudentStatus } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  CircleDot, 
  Search, 
  DollarSign, 
  ChevronRight, 
  UserMinus, 
  Plus, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentListProps {
  students: Student[];
  courses: Course[];
  onUpdateStudentStatus: (studentId: string, status: StudentStatus, monthsPaid?: number) => void;
  onIncrementMonth: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  id: string;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  courses,
  onUpdateStudentStatus,
  onIncrementMonth,
  onDeleteStudent,
  id
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getCourseForStudent = (student: Student) => {
    return courses.find(c => c.id === student.courseId);
  };

  const calculateFinancials = (student: Student, course?: Course) => {
    if (!course) return { earned: 0, lost: 0, total: 0 };
    const total = course.monthlyFee * course.durationMonths;
    const earned = course.monthlyFee * student.monthsPaid;
    let lost = 0;
    
    if (student.status === 'dropped_out') {
      lost = course.monthlyFee * (course.durationMonths - student.monthsPaid);
    }
    
    return { earned, lost, total };
  };

  // Filter students based on search term and selected status filter
  const filteredStudents = students.filter(student => {
    const course = getCourseForStudent(student);
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div id={id} className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-slate-800">
            Lista de Alunos e Impacto Individual
          </h2>
          <p className="text-sm text-slate-500 font-sans mt-0.5">
            Visualize o quanto você ganhou e perdeu com cada aluno. Atualize com 1 clique.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-white text-slate-800 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              statusFilter === 'active' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Ativos ({students.filter(s => s.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              statusFilter === 'completed' 
                ? 'bg-white text-emerald-600 shadow-xs' 
                : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            Concluídos ({students.filter(s => s.status === 'completed').length})
          </button>
          <button
            onClick={() => setStatusFilter('dropped_out')}
            className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              statusFilter === 'dropped_out' 
                ? 'bg-white text-rose-600 shadow-xs' 
                : 'text-slate-500 hover:text-rose-600'
            }`}
          >
            Desistentes ({students.filter(s => s.status === 'dropped_out').length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar aluno por nome ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all"
        />
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/50">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium font-sans">Nenhum aluno encontrado</p>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Tente mudar o filtro ou cadastrar um novo aluno para começar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student) => {
              const course = getCourseForStudent(student);
              const { earned, lost, total } = calculateFinancials(student, course);
              const percentProgress = course ? Math.min(100, (student.monthsPaid / course.durationMonths) * 100) : 0;

              return (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`border rounded-2xl p-5 transition-all bg-white hover:border-slate-300 ${
                    student.status === 'dropped_out' 
                      ? 'border-rose-100 bg-rose-50/5 hover:bg-rose-50/10' 
                      : student.status === 'completed' 
                      ? 'border-emerald-100 bg-emerald-50/5 hover:bg-emerald-50/10' 
                      : 'border-slate-100'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Student Identity and Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 font-sans text-sm sm:text-base truncate">
                          {student.name}
                        </h3>

                        {/* Status Badges */}
                        {student.status === 'active' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 font-sans border border-blue-100">
                            <CircleDot className="w-3.5 h-3.5 text-blue-500 fill-current" />
                            Ativo
                          </span>
                        )}
                        {student.status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 font-sans border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Concluído
                          </span>
                        )}
                        {student.status === 'dropped_out' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 font-sans border border-rose-100">
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            Desistente
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 font-sans mt-1">
                        Curso: <strong className="text-slate-700 font-medium">{course?.name || 'N/A'}</strong> 
                        <span className="mx-1.5 text-slate-300">•</span> 
                        Mensalidade: <strong className="text-slate-700 font-medium">R$ {course?.monthlyFee || 0}</strong>
                        <span className="mx-1.5 text-slate-300">•</span> 
                        Duração: <strong className="text-slate-700 font-medium">{course?.durationMonths || 0} meses</strong>
                      </p>

                      {/* Progress Bar of Months Paid */}
                      <div className="mt-3.5">
                        <div className="flex justify-between text-xs text-slate-500 mb-1 font-sans">
                          <span>Progresso: {student.monthsPaid} de {course?.durationMonths || 0} meses pagos</span>
                          <span className="font-semibold font-mono">{Math.round(percentProgress)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              student.status === 'dropped_out' 
                                ? 'bg-rose-500' 
                                : student.status === 'completed' 
                                ? 'bg-emerald-500' 
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${percentProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Values Display ("quanto eu ganhei", "quanto eu perdi") */}
                    <div className="flex flex-row sm:flex-col lg:items-end justify-between sm:justify-start gap-4 p-3 bg-slate-50 rounded-xl lg:bg-transparent lg:p-0 min-w-[200px]">
                      
                      {/* Earned amount */}
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                          💼 Quanto você GANHOU:
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-emerald-600 font-display">
                          R$ {earned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[9px] text-slate-400 font-sans">
                          ({student.monthsPaid} x R$ {course?.monthlyFee})
                        </p>
                      </div>

                      {/* Lost amount */}
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                          💸 Quanto você PERDEU:
                        </p>
                        <p className={`text-sm sm:text-base font-extrabold font-display ${
                          lost > 0 ? 'text-rose-600 font-mono' : 'text-slate-400'
                        }`}>
                          {lost > 0 ? `- R$ ${lost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                        </p>
                        {lost > 0 && course && (
                          <p className="text-[9px] text-rose-500 font-sans">
                            ({course.durationMonths - student.monthsPaid} meses restantes)
                          </p>
                        )}
                        {lost === 0 && student.status === 'active' && course && (
                          <p className="text-[9px] text-indigo-500 font-sans">
                            Previsão: R$ {(course.monthlyFee * (course.durationMonths - student.monthsPaid)).toLocaleString('pt-BR')} restantes
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Quick easy-mode controls */}
                    <div className="flex items-center gap-1.5 self-end lg:self-center border-t border-slate-100 lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                      
                      {/* Active student Quick actions */}
                      {student.status === 'active' && course && (
                        <>
                          {/* Increment Month Button */}
                          {student.monthsPaid < course.durationMonths && (
                            <button
                              onClick={() => onIncrementMonth(student.id)}
                              title="Registrar mais 1 mês pago"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-150 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span className="sm:inline font-sans">+1 Mês</span>
                            </button>
                          )}
                          
                          {/* Force Complete */}
                          <button
                            onClick={() => onUpdateStudentStatus(student.id, 'completed', course.durationMonths)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer shrink-0"
                          >
                            Concluir
                          </button>
                          
                          {/* Mark Dropout */}
                          <button
                            onClick={() => onUpdateStudentStatus(student.id, 'dropped_out')}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shrink-0"
                          >
                            Desistir
                          </button>
                        </>
                      )}

                      {/* Reactivate Dropped Out Student */}
                      {student.status === 'dropped_out' && (
                        <button
                          onClick={() => onUpdateStudentStatus(student.id, 'active')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reativar Aluno
                        </button>
                      )}

                      {/* Reopen Completed Student's Contract */}
                      {student.status === 'completed' && (
                        <button
                          onClick={() => onUpdateStudentStatus(student.id, 'active', student.monthsPaid - 1)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reabrir Contrato
                        </button>
                      )}

                      {/* Permanent Delete Icon */}
                      <button
                        onClick={() => onDeleteStudent(student.id)}
                        title="Remover Cadastro do Aluno"
                        className="p-2 ml-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer shrink-0"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};
