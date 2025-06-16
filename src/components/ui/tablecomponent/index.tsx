"use client"; // para usar hooks e fetch no cliente
import React, { useEffect, useState } from "react";
import DataTable from "./data-table";
import { columns } from "./columns";

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

export default function TableComponent() {
  const [data, setData] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAtendimentos() {
      try {
        const res = await fetch("/api/atendimentos");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Erro ao buscar atendimentos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAtendimentos();
  }, []);

  if (loading) return <p>Carregando atendimentos...</p>;

  return <DataTable columns={columns} data={data} />;
}
