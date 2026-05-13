
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Perguntas Frequentes (FAQ)</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>O que é a Guardiã de Confiança?</AccordionTrigger>
          <AccordionContent>
            A Guardiã de Confiança é uma aplicação que utiliza inteligência artificial para analisar documentos jurídicos e identificar possíveis cláusulas abusivas, fornecendo uma camada extra de proteção e segurança para os usuários.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Como funciona a análise de documentos?</AccordionTrigger>
          <AccordionContent>
            Nossa IA foi treinada com uma vasta base de dados de documentos jurídicos e legislação. Ao submeter um documento, a IA compara o texto com padrões de cláusulas abusivas conhecidas, destacando os trechos que merecem atenção.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>A análise da IA substitui um advogado?</AccordionTrigger>
          <AccordionContent>
            Não. A análise da Guardiã de Confiança é uma ferramenta de apoio e não substitui a consulta a um profissional de direito. Recomendamos sempre que um advogado seja consultado para questões legais complexas.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Meus documentos estão seguros?</AccordionTrigger>
          <AccordionContent>
            Sim. A segurança e a privacidade dos seus documentos são nossa prioridade. Utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
