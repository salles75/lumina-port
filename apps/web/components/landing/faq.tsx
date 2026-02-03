'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Como funciona a análise de sentimento?',
    answer:
      'Utilizamos técnicas avançadas de Processamento de Linguagem Natural (NLP) com bibliotecas como NLTK e spaCy. Nossa IA analisa o texto, identifica padrões linguísticos e classifica cada feedback como positivo, neutro ou negativo, além de extrair keywords relevantes.',
  },
  {
    question: 'Quais idiomas são suportados?',
    answer:
      'Atualmente suportamos Português (BR/PT), Inglês, Espanhol e Francês. O sistema detecta automaticamente o idioma do texto e aplica o modelo apropriado para garantir máxima precisão.',
  },
  {
    question: 'Posso integrar com minha plataforma existente?',
    answer:
      'Sim! No plano Enterprise, você tem acesso completo à nossa API RESTful e webhooks. Isso permite integrar o Lumina com CRMs, sistemas de e-commerce, ferramentas de BI e qualquer outra plataforma que aceite integrações via API.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Absolutamente. Utilizamos criptografia AES-256 para dados em repouso e TLS 1.3 para dados em trânsito. Estamos em conformidade com LGPD e GDPR. Seus dados são processados de forma isolada e nunca são compartilhados com terceiros.',
  },
  {
    question: 'Qual a precisão da análise?',
    answer:
      'Nossa precisão média é de 94% em benchmarks padrão. A precisão pode variar dependendo do domínio e qualidade do texto. Continuamente treinamos nossos modelos com dados reais para melhorar a acurácia.',
  },
  {
    question: 'Posso cancelar minha assinatura a qualquer momento?',
    answer:
      'Sim, você pode cancelar sua assinatura a qualquer momento diretamente no painel. Não há taxas de cancelamento ou contratos de fidelidade. Você continuará tendo acesso até o fim do período já pago.',
  },
  {
    question: 'Como funciona a análise por URL?',
    answer:
      'Nos planos Pro e Enterprise, você pode colar o link de um produto de marketplaces suportados (Amazon, Mercado Livre, etc). Nossa ferramenta extrai automaticamente as avaliações públicas e as processa, gerando insights imediatos.',
  },
  {
    question: 'Existe um limite de tamanho para upload de CSV?',
    answer:
      'No plano Free, o limite é de 1.000 linhas por arquivo. No Pro, até 50.000 linhas. No Enterprise, não há limite de linhas. O tamanho máximo do arquivo é de 50MB em todos os planos.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Não encontrou o que procura?{' '}
            <a href="mailto:suporte@lumina.com" className="text-primary hover:underline">
              Entre em contato
            </a>
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
