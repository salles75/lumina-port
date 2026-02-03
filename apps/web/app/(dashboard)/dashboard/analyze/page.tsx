'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  FileSpreadsheet,
  Link2,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type AnalysisStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

interface AnalysisResult {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleAnalyze = async () => {
    setStatus('uploading');
    setProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 30) {
          clearInterval(uploadInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus('processing');

    // Simulate processing progress
    const processInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(processInterval);
          return prev;
        }
        return prev + 2;
      });
    }, 50);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setStatus('completed');
    setResult({
      total: 1234,
      positive: 802,
      neutral: 284,
      negative: 148,
    });
  };

  const resetAnalysis = () => {
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setFile(null);
    setUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Nova Análise</h1>
        <p className="text-muted-foreground mt-1">
          Cole um link de produto ou faça upload de um CSV com feedbacks
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Selecione a fonte dos dados
                </CardTitle>
                <CardDescription>
                  Nossa IA irá processar os feedbacks e gerar insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      URL do Produto
                    </TabsTrigger>
                    <TabsTrigger value="csv" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Upload CSV
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Link do produto
                      </label>
                      <Input
                        placeholder="https://www.amazon.com.br/dp/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        icon={<Link2 className="h-4 w-4" />}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Suportamos Amazon, Mercado Livre, Shopee e mais
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Amazon</Badge>
                      <Badge variant="outline">Mercado Livre</Badge>
                      <Badge variant="outline">Shopee</Badge>
                      <Badge variant="outline">Magazine Luiza</Badge>
                    </div>

                    <Button
                      variant="gradient"
                      className="w-full"
                      size="lg"
                      disabled={!url}
                      onClick={handleAnalyze}
                    >
                      Analisar Avaliações
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TabsContent>

                  <TabsContent value="csv" className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                        isDragActive
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-primary/50'
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      {file ? (
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">
                            Arraste um arquivo CSV aqui
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ou clique para selecionar
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Formato esperado:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Coluna &quot;text&quot; ou &quot;feedback&quot; com o texto</li>
                        <li>Opcional: coluna &quot;date&quot; com a data</li>
                        <li>Máximo 50MB por arquivo</li>
                      </ul>
                    </div>

                    <Button
                      variant="gradient"
                      className="w-full"
                      size="lg"
                      disabled={!file}
                      onClick={handleAnalyze}
                    >
                      Processar Arquivo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-muted" />
                    <div
                      className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                      style={{ animationDuration: '1s' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {status === 'uploading'
                      ? 'Enviando dados...'
                      : 'Processando com IA...'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {status === 'uploading'
                      ? 'Aguarde enquanto enviamos seus dados'
                      : 'Analisando sentimentos e extraindo insights'}
                  </p>
                  <div className="max-w-xs mx-auto">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {progress}% concluído
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {status === 'completed' && result && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Análise concluída com sucesso!
                    </h3>
                    <p className="text-muted-foreground">
                      {result.total.toLocaleString()} feedbacks processados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="py-6 text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {result.positive.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Positivos ({((result.positive / result.total) * 100).toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6 text-center">
                  <div className="text-3xl font-bold text-amber-500">
                    {result.neutral.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Neutros ({((result.neutral / result.total) * 100).toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6 text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {result.negative.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Negativos ({((result.negative / result.total) * 100).toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button variant="gradient" className="flex-1">
                Ver Análise Completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={resetAnalysis}>
                Nova Análise
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
