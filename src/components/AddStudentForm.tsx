import React, { useState } from 'react';
import { Course, StudentStatus } from '../types';
import { UserPlus, Plus, Check, Info } from 'lucide-react';

interface AddStudentFormProps {
  courses: Course[];
  onAddStudent: (student: { name: string; courseId: string; status: StudentStatus; monthsPaid: number }) => void;
  id: string;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ courses, onAddStudent, id }) => {
  const [name, setName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [monthsPaid, setMonthsPaid] = useState<number>(1);
  const [status, setStatus] = useState<StudentStatus>('active');
  const [isSuccess, setIsSuccess] = useState(false);

  // Automatically update selected course if it was empty, or sync it
  React.useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const activeCourse = courses.find((c) => c.id === selectedCourseId);
  const maxMonths = activeCourse ? activeCourse.durationMonths : 12;

  // Ensure monthsPaid doesn't exceed course duration
  React.useEffect(() => {
    if (monthsPaid > maxMonths) {
      setMonthsPaid(maxMonths);
    }
  }, [selectedCourseId, maxMonths, monthsPaid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedCourseId) return;

    onAddStudent({
      name: name.trim(),
      courseId: selectedCourseId,
      status,
      monthsPaid: Number(monthsPaid) || 0,
    });

    // Reset Form
    setName('');
    setMonthsPaid(1);
    setStatus('active');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const initialEarned = activeCourse ? activeCourse.monthlyFee * monthsPaid : 0;
  const initialLost = activeCourse && status === 'dropped_out' 
    ? activeCourse.monthlyFee * (activeCourse.durationMonths - monthsPaid) 
    : 0;

  return (
    <div id={id} className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
          <UserPlus className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold font-display text-slate-800">
          Matricular Novo Aluno
        </h3>
      </div>

      {courses.length === 0 ? (
        <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-2xl p-4 text-xs font-medium leading-relaxed font-sans">
          ⚠️ <strong>Atenção:</strong> Você precisa cadastrar pelo menos um curso no painel ao lado primeiro para poder matricular alunos!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
              Nome do Aluno
            </label>
            <input
              type="text"
              required
              placeholder="Ex: João da Silva Santos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all"
            />
          </div>

          {/* Course Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
              Escolher Curso
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all cursor-pointer"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} (R$ {course.monthlyFee}/mês)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
                Status Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all cursor-pointer"
              >
                <option value="active">Ativo (Estudando)</option>
                <option value="completed">Concluído</option>
                <option value="dropped_out">Desistente (Saiu)</option>
              </select>
            </div>

            {/* Months Paid field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
                Meses Pagos Inicialmente
              </label>
              <input
                type="number"
                min="0"
                max={maxMonths}
                required
                value={monthsPaid}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthsPaid(val > maxMonths ? maxMonths : val);
                }}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all"
              />
              <span className="text-[10px] text-slate-400 font-sans mt-1 block">
                Máx do curso: {maxMonths}
              </span>
            </div>
          </div>

          {/* Preview of impact */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs font-sans space-y-1.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Impacto Financeiro Previsto:
            </span>
            <div className="flex justify-between">
              <span className="text-slate-600">Dinheiro ganho em caixa:</span>
              <strong className="text-emerald-600 font-mono">
                R$ {initialEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
            {status === 'dropped_out' ? (
              <div className="flex justify-between border-t border-slate-100 pt-1.5 mt-1.5">
                <span className="text-rose-600 font-semibold">Prejuízo imediato:</span>
                <strong className="text-rose-600 font-mono">
                  R$ {initialLost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            ) : (
              <div className="flex justify-between border-t border-slate-100 pt-1.5 mt-1.5">
                <span className="text-indigo-600">Previsão futura restante:</span>
                <strong className="text-indigo-600 font-mono">
                  R$ {((activeCourse?.monthlyFee ?? 0) * (maxMonths - monthsPaid)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Matrícula Realizada!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Matricular Aluno</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
