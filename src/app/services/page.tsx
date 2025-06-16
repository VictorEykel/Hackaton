import TableComponent from "@/components/ui/tablecomponent";
import { LaptopMinimal } from "lucide-react";

interface ServicesPageProps { }
export default function ServicesPage(props: ServicesPageProps) {
    return (
        <main className="sm:ml-14 p-4">
            <div className="flex items-center gap-3 py-4">
                <LaptopMinimal size={30} />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Atendimentos
                </h1>
            </div>
            <section>
                <TableComponent />
            </section>
        </main>
    );
}