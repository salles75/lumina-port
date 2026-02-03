'use client';

import { motion } from 'framer-motion';
import {
  Upload,
  Cpu,
  LineChart,
  Lightbulb,
} from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Importe os Dados',
    description:
      'Cole um link de produto ou faça upload de um CSV com suas avaliações. Suportamos diversos formatos e fontes.',
    color: 'bg-blue-500',
  },
  {
    icon: Cpu,
    title: 'Processamento NLP',
    description:
      'Nossa IA analisa cada feedback usando técnicas avançadas de Processamento de Linguagem Natural.',
    color: 'bg-purple-500',
  },
  {
    icon: LineChart,
    title: 'Visualize Métricas',
    description:
      'Explore gráficos interativos mostrando a distribuição de sentimentos, tendências e keywords.',
    color: 'bg-green-500',
  },
  {
    icon: Lightbulb,
    title: 'Obtenha Insights',
    description:
      'Tome decisões baseadas em dados. Identifique pontos fortes e áreas de melhoria rapidamente.',
    color: 'bg-amber-500',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Como <span className="gradient-text">funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em apenas 4 passos simples, transforme feedbacks brutos em insights
            valiosos para seu negócio.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-amber-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step Number */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`relative z-10 w-12 h-12 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Video/Image Placeholder */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card p-2">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    className="w-0 h-0 border-l-[20px] border-l-primary border-y-[12px] border-y-transparent ml-1"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                <p className="text-muted-foreground">Assista a demonstração</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
