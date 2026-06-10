import PublicHeader from "@/components/app/PublicHeader";
import { FaWhatsapp } from "react-icons/fa";

export default function QuemSomos() {
  return (
    <>
      <PublicHeader />
      <main className="container py-8">
        <h1 className="text-3xl font-bold">Quem Somos</h1>
        <p className="mt-4 text-lg">
          A JusMulher é uma plataforma dedicada a oferecer segurança e
          tranquilidade para mulheres em seus relacionamentos. Nossa missão é
          fornecer ferramentas que ajudem a verificar o histórico de
          antecedentes de potenciais parceiros, promovendo relações mais
          seguras e conscientes.
        </p>
        <p className="mt-4 text-lg">
          A JusMulher é uma iniciativa da empresa Jusbot Tenológica Ltda., fundada por um grupo de profissionais apaixonados por tecnologia aplicada a assuntos Jurídicos. Nossa equipe é formada por especialistas em inteligência artificial, direito e desenvolvimento de software.
        </p>
        <p className="mt-4 text-lg">
          Especificamente neste projeto, criamos um fluxo de análise de processos judiciais e criminais focado na identificação de riscos relacionados a condutas violentas, abusivas ou criminais que indiquem possíveis conflitos interpessoais. A análise tem por objetivo fornecer informações ágeis e confiáveis para a proteção da mulher no combate ao feminicídio e outras práticas de violência contra a Mulher.
        </p>
        <p className="mt-4 text-lg">
          Acreditamos que a informação é uma ferramenta poderosa de proteção.
          Com a nossa ajuda, você pode tomar decisões mais informadas e
          proteger-se de possíveis riscos.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Informações da Empresa</h2>
          <p className="mt-2 text-lg">
            <strong>Nome da Empresa:</strong> Jusbot Tecnológica Ltda.
          </p>
          <p className="mt-2 text-lg">
            <strong>CNPJ:</strong> 59.707.336/0001-31
          </p>
          <p className="mt-2 text-lg">
            <strong>Telefone de contato:</strong>{" "}
            <a
              href="https://wa.me/5535910238956"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <FaWhatsapp className="mr-2" />
              (35) 91023-8956
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
