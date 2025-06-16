import Section from "@/components/ui/section";
import ChatBotImage from "../../public/ChatBotImage.svg";
import AboutUsImage from "../../public/AboutUsImage.svg";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
    LaptopMinimal,
    LineChart,
    MessagesSquare,
    UsersRound,
} from "lucide-react";
import ItemsCarousel from "@/components/ui/itemcarousel";
import Footer from "@/components/ui/footer";

export default function Home() {
    return (
        <>
        {/* Conteúdo da página */}
            <main className="sm:ml-14 p-3">
                <Section className="sm:max-h-[350px] flex justify-between bg-blue-500 text-white">
                    <div className="w-full flex flex-col justify-center items-start gap-2">
                        <div>
                            <h1 className="text-5xl font-bold font-sans">TravelAI</h1>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold font-sans max-w-[600px]">
                                Sua assistente de viagem inteligente
                            </h3>
                        </div>
                        <div className="max-w-[600px]">
                            <h4 className="text-lg font-normal font-sans">
                                Descubra destinos incríveis, planeje itinerários personalizados
                                e receba recomendações de viagem inteligentes com a TravelAI.
                                Sua assistente de viagem inteligente que torna suas aventuras
                                inesquecíveis.
                            </h4>
                        </div>
                    </div>
                    <div className="hidden w-full md:flex justify-center items-center">
                        <Image
                            alt="Chat Bot"
                            src={ChatBotImage.src}
                            width={330}
                            height={330}
                            className="object-contain"
                        />
                    </div>
                </Section>

                <Section className="flex flex-col gap-10 py-15">
                    <h2 className="text-4xl font-bold text-center">Sua viagem completa!</h2>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col items-center gap-3 text-blue-500">
                                    <div className="bg-blue-500 text-white rounded-full p-3">
                                        <MessagesSquare size={26} />
                                    </div>
                                    <CardTitle>
                                        <span className="text-2xl">Chatbot</span>
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    <p className="text-center text-md text-black">
                                        Pronto para atender e fornecer informações sobre destinos,
                                        itinerários e muito mais.
                                    </p>
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col items-center gap-3 text-blue-500">
                                    <div className="bg-blue-500 text-white rounded-full p-3">
                                        <LaptopMinimal size={26} />
                                    </div>
                                    <CardTitle>
                                        <span className="text-2xl">
                                            Relatórios
                                        </span>
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    <p className="text-center text-md text-black">
                                        Relatórios personalizados e automatizados para você
                                        acompanhar os resultados.
                                    </p>
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col items-center gap-3 text-blue-500">
                                    <div className="bg-blue-500 text-white rounded-full p-3">
                                        <UsersRound size={26} />
                                    </div>
                                    <CardTitle>
                                        <span className="text-2xl">Curadoria</span>
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    <p className="text-center text-md text-black">
                                        Curadoria de informações e recomendações de viagem
                                        personalizadas.
                                    </p>
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col items-center gap-3 text-blue-500">
                                    <div className="bg-blue-500 text-white rounded-full p-3">
                                        <LineChart size={26} />
                                    </div>
                                    <CardTitle>
                                        <span className="text-2xl">Performance</span>
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    <p className="text-center text-md text-black">
                                        Média de 80% dos atendimentos concluídos com sucesso,
                                        garantindo uma experiência de viagem excepcional.
                                    </p>
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </section>
                </Section>

                <Section className="sm:max-h-[350px] flex justify-between bg-blue-500 text-white">
                    <div className="w-full flex flex-col justify-center items-start gap-2">
                        <div>
                            <h1 className="text-5xl font-bold font-sans">Sobre a TravelAI</h1>
                        </div>

                        <div className="max-w-[600px]">
                            <h4 className="text-lg font-normal font-sans">
                                A TravelAI é uma assistente de viagem inteligente que utiliza
                                inteligência artificial para oferecer recomendações personalizadas
                                de destinos, itinerários e atividades. Com a TravelAI, você pode
                                planejar suas viagens de forma eficiente e aproveitar ao máximo
                                suas aventuras.
                            </h4>
                        </div>
                    </div>
                    <div className="hidden w-full md:flex justify-center items-center">
                        <Image
                            alt="Chat Bot"
                            src={AboutUsImage.src}
                            width={340}
                            height={340}
                            className="object-contain"
                        />
                    </div>
                </Section>

                <Section className="sm:max-h-[350px] p-15 flex flex-col gap-5">
                    <div className="w-full flex flex-col justify-center items-start gap-2">
                        <div className="w-full">
                            <h1 className="text-4xl font-bold font-sans text-center">Tecnologias Utilizadas</h1>
                        </div>
                    </div>
                    <div className="w-full sm:flex justify-center items-center">
                        <ItemsCarousel />
                    </div>
                </Section>
            </main>
            <Footer />
        </>
    );
}