'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  BarChart3,
  MessageSquareText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: 'Análises realizadas', value: '2M+' },
  { label: 'Precisão média', value: '94%' },
  { label: 'Empresas ativas', value: '500+' },
  { label: 'Feedbacks processados', value: '50M+' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Powered by Advanced NLP
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transforme feedbacks em{' '}
            <span className="gradient-text">insights acionáveis</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Analise sentimentos de avaliações de clientes em escala com
            inteligência artificial. Cole um link ou faça upload de um CSV e
            obtenha insights instantâneos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/sign-up">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Como Funciona
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.p
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            ✓ Não precisa de cartão de crédito &nbsp;&nbsp; ✓ 100 análises
            grátis/mês &nbsp;&nbsp; ✓ Cancele quando quiser
          </motion.p>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  className="text-3xl sm:text-4xl font-bold gradient-text"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    delay: 0.6 + index * 0.1,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Preview Dashboard */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl">
              {/* Mock Dashboard Preview */}
              <div className="bg-card rounded-xl p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Dashboard de Análise</h3>
                    <p className="text-sm text-muted-foreground">
                      Última análise: há 5 minutos
                    </p>
                  </div>
                  <Badge variant="positive">+12% esta semana</Badge>
                </div>

                {/* Mock Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sentiment Distribution */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Distribuição</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }} />
                        <span className="text-xs text-muted-foreground">65%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-amber-500 rounded-full" style={{ width: '20%' }} />
                        <span className="text-xs text-muted-foreground">20%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '15%' }} />
                        <span className="text-xs text-muted-foreground">15%</span>
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Tendência</span>
                    </div>
                    <div className="h-16 flex items-end gap-1">
                      {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 bg-primary/60 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Resumo</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Score médio</span>
                        <span className="font-medium text-green-500">+0.72</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Keywords</span>
                        <span className="font-medium">48</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Feedbacks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Últimos Feedbacks</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { text: 'Produto excelente! Superou minhas expectativas.', sentiment: 'positive' },
                      { text: 'Entrega rápida, mas embalagem poderia melhorar.', sentiment: 'neutral' },
                      { text: 'Atendimento excepcional da equipe de suporte.', sentiment: 'positive' },
                    ].map((feedback, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + i * 0.15 }}
                      >
                        <span className="text-sm truncate flex-1 mr-4">{feedback.text}</span>
                        <Badge variant={feedback.sentiment as 'positive' | 'neutral' | 'negative'}>
                          {feedback.sentiment === 'positive' ? 'Positivo' : 'Neutro'}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
