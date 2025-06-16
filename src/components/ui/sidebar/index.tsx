import Link from "next/link";
import {
  Home,
  LaptopMinimal,
  LineChart,
  LogOut,
  MessageCircle,
  Plane,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import Header from "../header";

interface SidebarProps {}
export function Sidebar(props: SidebarProps) {
  return (
    <div className="w-full flex flex-col bg-muted/40">
      <Header />
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex sm:flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/chat"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center bg-blue-500 text-primary-foreground rounded-full"
                >
                  <Plane className="w-5 h-5" />
                  <span className="sr-only">Chat</span>
                </Link>
              </TooltipTrigger>
              {/* <TooltipContent side="right">
                  <span>TravelAI</span>
                </TooltipContent> */}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground"
                >
                  <Home className="w-5 h-5" />
                  <span className="sr-only">Inicio</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Início</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/dashboard"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground"
                >
                  <LineChart className="w-5 h-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Dashboard</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/chathistory"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="sr-only">Histórico de Conversas</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Histórico de Conversas</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/services"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground"
                >
                  <LaptopMinimal className="w-5 h-5" />
                  <span className="sr-only">Atendimentos</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Atendimentos</span>
              </TooltipContent>
            </Tooltip>

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"#"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground"
                >
                  <Settings2 className="w-5 h-5" />
                  <span className="sr-only">Configuracões</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Configuracões</span>
              </TooltipContent>
            </Tooltip> */}
          </TooltipProvider>
        </nav>

        {/* botao de sair */}
        {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"#"}
                  className="flex w-9 h-9 shrink-0 items-center justify-center text-muted-foreground rounded-lg transition-colors hover:text-foreground"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="sr-only">Sair</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Sair</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav> */}
      </aside>
    </div>
  );
}
