'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    description: 'Perfeito para começar a explorar',
    price: { monthly: 0, yearly: 0 },
    features: [
      { name: '100 análises/mês', included: true },
      { name: 'Upload de CSV', included: true },
      { name: 'Dashboard básico', included: true },
      { name: 'Análise por URL', included: false },
      { name: 'Exportar relatórios', included: false },
      { name: 'API Access', included: false },
      { name: 'Suporte prioritário', included: false },
    ],
    cta: 'Começar Grátis',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'Ideal para profissionais e PMEs',
    price: { monthly: 79, yearly: 790 },
    features: [
      { name: '5.000 análises/mês', included: true },
      { name: 'Upload de CSV', included: true },
      { name: 'Dashboard completo', included: true },
      { name: 'Análise por URL', included: true },
      { name: 'Exportar relatórios', included: true },
      { name: 'API Access', included: false },
      { name: 'Suporte prioritário', included: true },
    ],
    cta: 'Assinar Pro',
    href: '/sign-up?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Para grandes equipes e empresas',
    price: { monthly: 299, yearly: 2990 },
    features: [
      { name: 'Análises ilimitadas', included: true },
      { name: 'Upload de CSV', included: true },
      { name: 'Dashboard completo', included: true },
      { name: 'Análise por URL', included: true },
      { name: 'Exportar relatórios', included: true },
      { name: 'API Access completo', included: true },
      { name: 'Suporte dedicado 24/7', included: true },
    ],
    cta: 'Falar com Vendas',
    href: '/contact',
    popular: false,
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planos que <span className="gradient-text">escalam</span> com você
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha o plano ideal para suas necessidades. Sem taxas escondidas.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span
            className={cn(
              'text-sm font-medium transition-colors',
              !isYearly ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Mensal
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Toggle billing period"
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-primary rounded-full"
              animate={{ x: isYearly ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span
            className={cn(
              'text-sm font-medium transition-colors',
              isYearly ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Anual
          </span>
          <Badge variant="positive" className="ml-2">
            Economize 17%
          </Badge>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative h-full flex flex-col',
                  plan.popular &&
                    'border-primary shadow-lg shadow-primary/10 scale-105'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        R${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-muted-foreground">
                          /{isYearly ? 'ano' : 'mês'}
                        </span>
                      )}
                    </div>
                    {plan.price.monthly > 0 && isYearly && (
                      <p className="text-xs text-muted-foreground mt-1">
                        equivale a R${Math.round(plan.price.yearly / 12)}/mês
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                            <X className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        <span
                          className={cn(
                            'text-sm',
                            !feature.included && 'text-muted-foreground'
                          )}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Link href={plan.href} className="w-full">
                    <Button
                      variant={plan.popular ? 'gradient' : 'outline'}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Garantia de 14 dias. Cancele quando quiser sem compromisso.
        </motion.p>
      </div>
    </section>
  );
}
