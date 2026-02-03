'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Link2,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Download,
  Eye,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate, formatRelativeTime } from '@/lib/utils';

// Mock data
const analyses = [
  {
    id: '1',
    name: 'Análise Amazon - Fone Bluetooth XYZ',
    type: 'url',
    status: 'completed',
    feedbacks: 234,
    positive: 72,
    neutral: 18,
    negative: 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    name: 'feedbacks_janeiro_2024.csv',
    type: 'csv',
    status: 'completed',
    feedbacks: 1500,
    positive: 65,
    neutral: 22,
    negative: 13,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: 'Mercado Livre - Smartphone ABC',
    type: 'url',
    status: 'completed',
    feedbacks: 89,
    positive: 45,
    neutral: 30,
    negative: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '4',
    name: 'survey_q4_2023.csv',
    type: 'csv',
    status: 'completed',
    feedbacks: 3200,
    positive: 78,
    neutral: 15,
    negative: 7,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: '5',
    name: 'Análise Shopee - Smartwatch Pro',
    type: 'url',
    status: 'completed',
    feedbacks: 156,
    positive: 58,
    neutral: 27,
    negative: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: '6',
    name: 'customer_reviews_app.csv',
    type: 'csv',
    status: 'processing',
    feedbacks: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = analysis.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || analysis.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || analysis.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Histórico de Análises</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e gerencie todas as suas análises anteriores
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar análises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {filteredAnalyses.length} análise(s) encontrada(s)
              </CardTitle>
              <CardDescription>
                Ordenado por data de criação (mais recente primeiro)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors group">
                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-background transition-colors">
                    {analysis.type === 'url' ? (
                      <Link2 className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">
                        {analysis.name}
                      </span>
                      <Badge
                        variant={
                          analysis.status === 'completed'
                            ? 'positive'
                            : analysis.status === 'processing'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="text-[10px]"
                      >
                        {analysis.status === 'completed'
                          ? 'Concluído'
                          : analysis.status === 'processing'
                          ? 'Processando'
                          : 'Falhou'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {analysis.status === 'completed' && (
                        <span>
                          {analysis.feedbacks.toLocaleString()} feedbacks
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatRelativeTime(analysis.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Sentiment Bars */}
                  {analysis.status === 'completed' && (
                    <div className="hidden md:flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">{analysis.positive}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm">{analysis.neutral}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm">{analysis.negative}%</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/analysis/${analysis.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar relatório
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}

            {filteredAnalyses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Nenhuma análise encontrada</h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou faça uma nova análise
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
