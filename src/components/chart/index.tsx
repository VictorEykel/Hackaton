'use client'
import { DollarSign } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface ChartOverviewProps { }

export function ChartOverview(props: ChartOverviewProps) {

    // Exemplo de dados para o gráfico
    // Usei 'ZAP' como um exemplo para mostrar como adicionar uma nova barra
    const chartData = [
        { month: "January", desktop: 186, },
        { month: "February", desktop: 305, },
        { month: "March", desktop: 237, },
        { month: "April", desktop: 73, },
        { month: "May", desktop: 209, },
        { month: "June", desktop: 214 },
    ];

    // Configuração do gráfico
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563EB",
        },
    } satisfies ChartConfig;

    return (
        <Card className="w-full md:w-1/2 md:max-w-[600px]">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-gray-800 celect-none">
                        Overview Chats
                    </CardTitle>
                    <DollarSign className="ml-auto w-4 h-4" />
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full"
                >
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey='desktop' fill="var(--color-desktop)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}