import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface FinancialSimulatorProps {
  totalLost: number;
  droppedOutStudentsCount: number;
  id: string;
}

export const FinancialSimulator: React.FC<FinancialSimulatorProps> = ({
  totalLost,
  droppedOutStudentsCount,
  id
}) => {
  const [conversionRate, setConversionRate] = useState<number>(30); // default to 30% recovery

  const amountRecovered = (totalLost * (conversionRate / 100));
  const studentsSaved = Math.round(droppedOutStudentsCount * (conversionRate / 100));

  return (
    <div id={id} className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-indigo-500/30 rounded-lg text-indigo-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-sans">
            Simulador "Modo Fácil" de Resgate
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
          E se você pudesse reverter as desistências?
        </h3>
        
        <p className="text-slate-300 text-sm mt-2 max-w-2xl font-sans leading-relaxed">
          Trazer alunos de volta é muito mais barato do que conquistar novos. Ajuste o controle de resgate abaixo para simular ações simples de contato e retenção.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-center">
          
          {/* Slider and Range controls */}
          <div className="md:col-span-2 bg-slate-800/40 border border-slate-700/30 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-200">
                Meta de Resgate de Alunos:
              </span>
              <span className="text-xl font-bold text-indigo-300 font-mono">
                {conversionRate}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              id="recovery-slider"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
              <span>0% (Cru)</span>
              <span>25% (Possível)</span>
              <span>50% (Bom Retorno)</span>
              <span>100% (Utopia)</span>
            </div>
          </div>

          {/* Real-time Calculation Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
            <p className="text-xs text-indigo-200 font-medium font-sans uppercase tracking-wider">
              Recuperação Estimada
            </p>
            <motion.p 
              key={amountRecovered}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display my-2"
            >
              R$ {amountRecovered.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1 font-sans">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Resgatando cerca de <strong>{studentsSaved}</strong> {studentsSaved === 1 ? 'aluno' : 'alunos'}</span>
            </div>
          </div>

        </div>

        {/* Practical tips bar */}
        <div className="mt-6 bg-indigo-950/50 border border-indigo-800/40 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-indigo-200">
          <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-100 block mb-1">💡 Dica Prática de Redução de Desistências ("Modo Fácil"):</span>
            Mande uma mensagem amigável no WhatsApp quando o aluno faltar 2 aulas seguidas. 
            Isso demonstra cuidado e diminui em até <strong className="text-emerald-400">30%</strong> a desistência imediata por desestímulo!
          </div>
        </div>

      </div>
    </div>
  );
};
