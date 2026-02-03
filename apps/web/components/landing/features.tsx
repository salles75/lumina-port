'use client';

import { motion } from 'framer-motion';
import {
  Link2,
  FileSpreadsheet,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Webhook,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Link2,
    title: 'Análise por URL',
    description:
      'Cole o link de qualquer produto e extraia avaliações automaticamente de marketplaces populares.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileSpreadsheet,
    title: 'Upload de CSV',
    description:
      'Importe suas próprias avaliações via arquivo CSV. Suporte para múltiplos formatos e colunas customizáveis.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Brain,
    title: 'NLP Avançado',
    description:
      'Análise de sentimento com NLTK e spaCy. Detecte nuances, ironia e contexto em múltiplos idiomas.',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Interativo',
    description:
      'Visualize métricas em tempo real com gráficos interativos. Filtre por período, sentimento e keywords.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Zap,
    title: 'Processamento Rápido',
    description:
      'Análise de milhares de feedbacks em segundos. Arquitetura otimizada para alta performance.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Segurança Enterprise',
    description:
      'Dados criptografados em trânsito e em repouso. Conformidade com LGPD e GDPR.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'Suporte Multilíngue',
    description:
      'Analise feedbacks em Português, Inglês, Espanhol e mais. Detecção automática de idioma.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Webhook,
    title: 'API & Webhooks',
    description:
      'Integre com suas ferramentas favoritas. API RESTful completa e webhooks para automações.',
    gradient: 'from-red-500 to-orange-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tudo que você precisa para{' '}
            <span className="gradient-text">entender seus clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ferramentas poderosas de análise de sentimento em uma plataforma
            intuitiva e fácil de usar.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-transparent hover:border-primary/20">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
