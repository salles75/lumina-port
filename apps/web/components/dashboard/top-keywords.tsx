'use client';

import { Badge } from '@/components/ui/badge';

const keywords = [
  { word: 'qualidade', count: 234, sentiment: 'positive' },
  { word: 'entrega', count: 189, sentiment: 'neutral' },
  { word: 'preço', count: 156, sentiment: 'positive' },
  { word: 'atendimento', count: 142, sentiment: 'positive' },
  { word: 'embalagem', count: 98, sentiment: 'negative' },
  { word: 'rápido', count: 87, sentiment: 'positive' },
  { word: 'recomendo', count: 76, sentiment: 'positive' },
  { word: 'defeito', count: 45, sentiment: 'negative' },
];

const maxCount = Math.max(...keywords.map((k) => k.count));

export function TopKeywords() {
  return (
    <div className="space-y-3">
      {keywords.map((keyword, index) => (
        <div key={keyword.word} className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{keyword.word}</span>
              <Badge
                variant={keyword.sentiment as 'positive' | 'neutral' | 'negative'}
                className="text-[10px] px-1.5"
              >
                {keyword.count}
              </Badge>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  keyword.sentiment === 'positive'
                    ? 'bg-green-500'
                    : keyword.sentiment === 'negative'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${(keyword.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
