
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Perguntas Frequentes (FAQ)</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>O que é o JusMulher?</AccordionTrigger>
          <AccordionContent>
            JusMulher é uma aplicação que utiliza inteligência artificial para encontrar e analisar processos jurídicos e identificar possíveis riscos relacionados a condutas violentas, abusivas ou criminais que indiquem possíveis conflitos interpessoais. A análise tem por objetivo fornecer informações agéis e confiáveis para a proteção da mulher no combate ao feminicídio e outras práticas de violência contra a Mulher.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Quais tribunais são consultados?</AccordionTrigger>
          <AccordionContent>
            Nosso sistema consulta todos os tribunais do Brasil, incluindo as esferas estadual, federal, trabalhista, militar e eleitoral. Isso garante uma análise abrangente do histórico judicial das pessoas consultadas.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>A análise da IA substitui um advogado?</AccordionTrigger>
          <AccordionContent>
            Não. A análise do Jusmulher é uma ferramenta de apoio com base em informações disponíveis e não substitui a consulta a um profissional de direito. Recomendamos sempre que um advogado seja consultado para questões legais complexas.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Minhas consultas estão seguras?</AccordionTrigger>
          <AccordionContent>
            Sim. A segurança e a privacidade das suas consultas são nossa prioridade. Utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Posso consultar qualquer pessoa?</AccordionTrigger>
          <AccordionContent>
            Sim. Embora a IA esteja treinada para identificação de riscos para mulheres, o sistema permite a consulta de qualquer pessoa e retornará todos os processos encontrados no CPF consultado.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>E se ocorrer um erro durante a consulta?</AccordionTrigger>
          <AccordionContent>
            Embora façamos o possível para garantir a precisão, erros podem ocorrer. Mas fique tranquila, seu crédito só é consumido em caso de sucesso na consulta. Se um erro ocorrer, você pode tentar novamente em alguns instantes. Se o problema persistir, entre em contato com nosso suporte para assistência.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>Comprei créditos, mas não alterou o saldo</AccordionTrigger>
          <AccordionContent>
            O mais provável é que você tenha utilizado um email diferente do que usou para criar sua conta no JusMulher. Para resolver isso, entre em contato com nosso suporte e informe o email usado na compra e o email da sua conta JusMulher para que possamos corrigir seu saldo.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>Posso confiar nas informações fornecidas?</AccordionTrigger>
          <AccordionContent>
            Sim. As informações fornecidas pelo JusMulher são baseadas em dados públicos dos tribunais e diários oficiais e análises são realizadas por inteligência artificial. Contamos com auditoria periódica de amostras de resultados por equipe de advogados especializados. Isso garante a qualidade e confiabilidade das informações e o aprimoramento contínuo do sistema. No entanto, é importante lembrar que esta é uma ferramenta de apoio e não substitui a consulta a um profissional de direito para casos mais complexos.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
