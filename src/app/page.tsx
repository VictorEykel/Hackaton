import { ChartOverview } from "@/components/chart";
import Sales from "@/components/sales";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, DollarSign, MessageCircle, MessageCircleMore, Percent, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 celect-none">
                Conversas Iniciadas
              </CardTitle>
              <MessageCircleMore className="ml-auto w-4 h-4"/>
            </div>

            <CardDescription>
              Total de conversas iniciadas no mês atual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 celect-none">
                Novos Clientes
              </CardTitle>
              <Users className="ml-auto w-4 h-4"/>
            </div>

            <CardDescription>
              Novos clientes cadastrados no mês atual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              234
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 celect-none">
                Chats Ativos
              </CardTitle>
              <MessageCircle className="ml-auto w-4 h-4"/>
            </div>

            <CardDescription>
              Total de chats ativos hoje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              65
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 flex flex-col gap-4 md:flex-row">
        <ChartOverview />
        <Sales />
      </section>
    </main>    
  );
}
