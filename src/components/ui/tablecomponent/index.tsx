"use server";
import { columns, Services } from "./columns";
import DataTable from "./data-table";

async function getData(): Promise<Services[]> {
  const now = new Date();
  const formattedDate = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}/${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${now.getFullYear()}`;

  return [
    {
      id: 1,
      registerDate: formattedDate,
      ticketId: "6547839",
      operation: "Cotemig",
      clientName: "Victor Eykel",
      attendant: "Daniel",
      contact: "(31) 99999-9999",
      tag: "Como faço pra fazer uma reclamação?",
      status: "Ativo",
    },
    {
      id: 2,
      registerDate: formattedDate,
      ticketId: "6547840",
      operation: "Cotemig",
      clientName: "Ana Paula",
      attendant: "Mariana",
      contact: "(31) 98888-8888",
      tag: "Qual o horário de funcionamento?",
      status: "Pendente",
    },
    {
      id: 3,
      registerDate: formattedDate,
      ticketId: "6547841",
      operation: "Cotemig",
      clientName: "Carlos Silva",
      attendant: "João",
      contact: "(31) 97777-7777",
      tag: "Como posso cancelar meu serviço?",
      status: "Resolvido",
    },
    {
      id: 4,
      registerDate: formattedDate,
      ticketId: "6547842",
      operation: "Cotemig",
      clientName: "Maria Oliveira",
      attendant: "Daniel",
      contact: "(31) 96666-6666",
      tag: "Quais são os planos disponíveis?",
      status: "Ativo",
    },
    {
      id: 5,
      registerDate: formattedDate,
      ticketId: "6547843",
      operation: "Cotemig",
      clientName: "José Santos",
      attendant: "Ricardo",
      contact: "(31) 95555-5555",
      tag: "Como faço para alterar meu plano?",
      status: "Pendente",
    },
  ];
}

export default async function TableComponent() {
  const data = await getData();

  return <DataTable columns={columns} data={data} />;
}
