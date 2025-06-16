"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "../button";

interface Atendimento {
  id: string;
  registerDate: string;
  ticketId: string;
  clientName: string;
  attendant: string;
  contact: string;
  tag: string;
  status: string;
}

export const columns: ColumnDef<Atendimento>[] = [
  {
    accessorKey: "registerDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cadastro
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "ticketId",
    header: () => <div className="px-2 py-2">Ticket</div>,
  },
  {
    accessorKey: "operation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Operação
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "attendant",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Atendente
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contato
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "tag",
    header: () => <div className="px-2 py-2">Tag</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      let bgColor = "";
      switch (status) {
        case "Ativo":
          bgColor = "bg-green-300";
          break;
        case "Inativo":
          bgColor = "bg-amber-300";
          break;
        case "Pendente":
          bgColor = "bg-red-300";
          break;
        default:
          bgColor = "bg-gray-200";
      }
      return (
        <div
          className={`max-w-fit py-0.5 px-2.5 ${bgColor} text-center rounded-lg`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(service.clientName)}
            >
              Copiar Nome do Cliente
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ação 1</DropdownMenuItem>
            <DropdownMenuItem>Ação 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
