import {
  Home,
  LaptopMinimal,
  LineChart,
  MessageCircle,
  PanelBottom,
  Plane,
} from "lucide-react";
import { Button } from "../button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";
import Link from "next/link";

interface HeaderProps {}

export default function Header(props: HeaderProps) {
  return (
    <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelBottom className="w-5 h-5" />
              <span className="sr-only">Abrir / Fechar menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="sm:max-w-x">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <Link
                    href={"/"}
                    className="flex items-center justify-center text-primary-foreground md:text-base h-10 w-10 bg-primary rounded-full gap-2"
                    prefetch={false}
                  >
                    <Plane className="h-5 w-5 transition-all" />
                    <span className="sr-only">Logo do projeto</span>
                  </Link>
                  <h2 className="text-lg font-semibold">
                    TravelAI
                  </h2>
                </div>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-6 text-lg font-medium px-5">
              <Link
                href={"/"}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <Home className="h-5 w-5 transition-all" />
                <span>Início</span>
              </Link>

              <Link
                href={"/dashboard"}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <LineChart className="h-5 w-5 transition-all" />
                <span>Dashboard</span>
              </Link>

              <Link
                href={"/chathistory"}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <MessageCircle className="h-5 w-5 transition-all" />
                <span>Historico de Conversas</span>
              </Link>
              
              <Link
                href={"/services"}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <LaptopMinimal className="h-5 w-5 transition-all" />
                <span>Atendimentos</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <h2>Menu</h2>
      </header>
    </div>
  );
}
