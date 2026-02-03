'use client';

import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Link2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const recentAnalyses = [
  {
    id: '1',
    name: 'Análise Amazon - Fone Bluetooth',
    type: 'url',
    feedbacks: 234,
    positive: 72,
    neutral: 18,
    negative: 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: '2',
    name: 'feedbacks_janeiro.csv',
    type: 'csv',
    feedbacks: 1500,
    positive: 65,
    neutral: 22,
    negative: 13,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    name: 'Mercado Livre - Smartphone XYZ',
    type: 'url',
    feedbacks: 89,
    positive: 45,
    neutral: 30,
    negative: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    name: 'survey_q4_2023.csv',
    type: 'csv',
    feedbacks: 3200,
    positive: 78,
    neutral: 15,
    negative: 7,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: '5',
    name: 'Análise Shopee - Smartwatch',
    type: 'url',
    feedbacks: 156,
    positive: 58,
    neutral: 27,
    negative: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
];

export function RecentAnalyses() {
  return (
    <div className="space-y-4">
      {recentAnalyses.map((analysis) => (
        <Link
          key={analysis.id}
          href={`/dashboard/analysis/${analysis.id}`}
          className="block"
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
                <span className="font-medium truncate">{analysis.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {analysis.type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{analysis.feedbacks.toLocaleString()} feedbacks</span>
                <span>•</span>
                <span>{formatRelativeTime(analysis.createdAt)}</span>
              </div>
            </div>

            {/* Sentiment Bars */}
            <div className="hidden sm:flex items-center gap-2 w-40">
              <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-muted">
                <div
                  className="bg-green-500"
                  style={{ width: `${analysis.positive}%` }}
                />
                <div
                  className="bg-amber-500"
                  style={{ width: `${analysis.neutral}%` }}
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${analysis.negative}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                <DropdownMenuItem>Exportar relatório</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>
      ))}
    </div>
  );
}
