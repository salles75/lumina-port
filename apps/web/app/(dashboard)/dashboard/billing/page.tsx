'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  CreditCard,
  Download,
  ExternalLink,
  Receipt,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      { name: '100 análises/mês', included: true },
      { name: 'Upload de CSV', included: true },
      { name: 'Dashboard básico', included: true },
      { name: 'Análise por URL', included: false },
      { name: 'Exportar relatórios', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    popular: true,
    features: [
      { name: '5.000 análises/mês', included: true },
      { name: 'Upload de CSV', included: true },
      { name: 'Dashboard completo', included: true },
      { name: 'Análise por URL', included: true },
      { name: 'Exportar relatórios', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    features: [
      { name: 'Análises ilimitadas', included: true },
      { name: 'Upload de CSV', included: true },
      { name: 'Dashboard completo', included: true },
      { name: 'Análise por URL', included: true },
      { name: 'API Access completo', included: true },
    ],
  },
];

const invoices = [
  { id: '1', date: '01/01/2024', amount: 79, status: 'Pago' },
  { id: '2', date: '01/12/2023', amount: 79, status: 'Pago' },
  { id: '3', date: '01/11/2023', amount: 79, status: 'Pago' },
];

export default function BillingPage() {
  const currentPlan = 'pro'; // Would come from API
  const usage = { current: 2345, limit: 5000 };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Plano e Cobrança</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua assinatura e histórico de pagamentos
        </p>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Plano Atual</CardTitle>
                <Badge variant="positive">Ativo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Pro</p>
                  <p className="text-sm text-muted-foreground">
                    R$79/mês • Renova em 01/02/2024
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uso este mês</span>
                  <span className="font-medium">
                    {usage.current.toLocaleString()}/{usage.limit.toLocaleString()} análises
                  </span>
                </div>
                <Progress
                  value={(usage.current / usage.limit) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {((usage.current / usage.limit) * 100).toFixed(1)}% utilizado
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Gerenciar no Stripe
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded bg-muted">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">
                    Expira em 12/2025
                  </p>
                </div>
                <Badge variant="outline">Padrão</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Atualizar
              </Button>
              <Button variant="outline" className="flex-1">
                Adicionar
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Plans Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mudar de Plano</CardTitle>
            <CardDescription>
              Compare os planos e escolha o melhor para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    'relative p-4 rounded-xl border',
                    plan.id === currentPlan && 'border-primary bg-primary/5',
                    plan.popular && plan.id !== currentPlan && 'border-primary/50'
                  )}
                >
                  {plan.popular && plan.id !== currentPlan && (
                    <Badge className="absolute -top-2 right-4" variant="default">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}

                  {plan.id === currentPlan && (
                    <Badge className="absolute -top-2 right-4" variant="positive">
                      Plano atual
                    </Badge>
                  )}

                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold">R${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/mês</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            !feature.included && 'text-muted-foreground'
                          )}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.id === currentPlan ? 'secondary' : 'outline'}
                    className="w-full"
                    disabled={plan.id === currentPlan}
                  >
                    {plan.id === currentPlan
                      ? 'Plano atual'
                      : plan.price > 79
                      ? 'Fazer upgrade'
                      : plan.price === 0
                      ? 'Fazer downgrade'
                      : 'Selecionar'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <CardTitle>Histórico de Faturas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-muted">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Fatura #{invoice.id} - R${invoice.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="positive">{invoice.status}</Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
