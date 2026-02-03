'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  FileText,
  MessageSquare,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SentimentChart } from '@/components/dashboard/sentiment-chart';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { RecentAnalyses } from '@/components/dashboard/recent-analyses';
import { TopKeywords } from '@/components/dashboard/top-keywords';

// Mock data - would come from API
const stats = [
  {
    title: 'Total de Análises',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: BarChart3,
  },
  {
    title: 'Feedbacks Processados',
    value: '45,678',
    change: '+8.2%',
    trend: 'up',
    icon: MessageSquare,
  },
  {
    title: 'Score Médio',
    value: '+0.72',
    change: '+3.1%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Taxa Negativa',
    value: '12.3%',
    change: '-2.4%',
    trend: 'down',
    icon: TrendingDown,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Pronto para analisar feedbacks?
                </h2>
                <p className="text-muted-foreground">
                  Cole um link ou faça upload de um CSV para começar
                </p>
              </div>
              <Link href="/dashboard/analyze">
                <Button variant="gradient" size="lg">
                  Nova Análise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge
                  variant={stat.trend === 'up' ? 'positive' : 'negative'}
                  className="text-xs"
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Distribuição de Sentimentos</CardTitle>
              <CardDescription>
                Visão geral dos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SentimentChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Tendência de Sentimentos</CardTitle>
              <CardDescription>Evolução ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Análises Recentes</CardTitle>
                <CardDescription>Suas últimas 5 análises</CardDescription>
              </div>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentAnalyses />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Top Keywords</CardTitle>
              <CardDescription>Palavras mais frequentes</CardDescription>
            </CardHeader>
            <CardContent>
              <TopKeywords />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
