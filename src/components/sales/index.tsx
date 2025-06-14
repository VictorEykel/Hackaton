import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SalesProps {

}
export default function Sales(props : SalesProps){
    // Card opicional para exibir os últimos clientes cadastrados
    return(
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="text-lg sm:text-xl text-gray-800 celect-none">
                Ultimos Clientes.
              </CardTitle>
              <Users className="ml-auto w-4 h-4"/>
            </div>

            <CardDescription>
                Lista dos últimos clientes cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <article className="flex items-center gap-2 border-b py-2">
                <Avatar className="w-8 h-8">
                    <AvatarImage src='https://github.com/victoreykel.png'/>
                    <AvatarFallback>VE</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm sm:text-base font-semibold">
                        Victor Eykel
                    </p>
                    <span className="text-xs sm:text-sm text-gray-400">
                        victoreykel@gmail.com
                    </span>
                </div>
            </article>
            
            <article className="flex items-center gap-2 border-b py-2">
                <Avatar className="w-8 h-8">
                    <AvatarImage src='https://github.com/victoreykel.png'/>
                    <AvatarFallback>VE</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm sm:text-base font-semibold">
                        Victor Eykel
                    </p>
                    <span className="text-xs sm:text-sm text-gray-400">
                        victoreykel@gmail.com
                    </span>
                </div>
            </article>
          </CardContent>
        </Card>
    )
}