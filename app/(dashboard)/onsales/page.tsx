"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/onsales/OnsaleColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Onsales = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [onsales, setOnsales] = useState([]);

  const getOnsales = async () => {
    try {
      const res = await fetch("/api/onsales", {
        method: "GET",
      });
      const data = await res.json();
      setOnsales(data);
      setLoading(false);
    } catch (err) {
      console.log("[onsales_GET]", err);
    }
  };

  useEffect(() => {
    getOnsales();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Onsales</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/onsales/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Onsale
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={onsales} searchKey="title" />
    </div>
  );
};

export default Onsales;
