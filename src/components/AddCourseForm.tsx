import React, { useState } from 'react';
import { Course } from '../types';
import { BookOpen, DollarSign, Calendar, Plus, Check, HelpCircle } from 'lucide-react';

interface AddCourseFormProps {
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  id: string;
}

export const AddCourseForm: React.FC<AddCourseFormProps> = ({ onAddCourse, id }) => {
  const [name, setName] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(150);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCourse({
      name: name.trim(),
      monthlyFee: Number(monthlyFee) || 0,
      durationMonths: Number(durationMonths) || 1,
    });

    // Reset Form
    setName('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const calculatedTotalValue = monthlyFee * durationMonths;

  return (
    <div id={id} className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold font-display text-slate-800">
          Cadastrar Novo Curso / Turma
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
            Nome do Curso
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Ex: Teclado Iniciante, Mentoria, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Fee input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
              Mensalidade (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
              <input
                type="number"
                min="1"
                required
                value={monthlyFee || ''}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all"
              />
            </div>
          </div>

          {/* Duration in months */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
              Duração (Meses)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="120"
                required
                value={durationMonths || ''}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white rounded-xl text-sm font-sans outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Dynamic calculation banner */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-sans">
          <span>Potencial do Contrato:</span>
          <strong className="text-indigo-600 text-sm font-bold font-mono">
            R$ {calculatedTotalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </strong>
        </div>

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
              <span>Curso Criado!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Criar Curso</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
