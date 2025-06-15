// components/sales/index.tsx

import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Usuario } from "@/types/user.types";

interface SalesProps {
    usuarios: Usuario[];
}

export default function Sales({ usuarios }: SalesProps) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                        Últimos Clientes
                    </CardTitle>
                    <Users className="ml-auto w-4 h-4" />
                </div>
                <CardDescription>
                    Lista dos últimos clientes cadastrados.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {usuarios.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhum cliente cadastrado.</p>
                ) : (
                    usuarios.map((usuario) => {
                        const initials = usuario.nome
                            ? usuario.nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "??"; // fallback para quando nome não existir

                        return (
                            <article key={usuario._id?.toString() ?? usuario.telefone} className="flex items-center gap-2 border-b py-2">
                                <Avatar className="w-8 h-8">
                                    {/* Se tiver imagem, pode usar AvatarImage, senão AvatarFallback */}
                                    {/* Aqui não tem imagem no tipo Usuario, então só fallback */}
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm sm:text-base font-semibold">{usuario.nome}</p>
                                    <span className="text-xs sm:text-sm text-gray-400">{usuario.telefone}</span>
                                </div>
                            </article>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
