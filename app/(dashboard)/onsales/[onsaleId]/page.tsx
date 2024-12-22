"use client";

import { useEffect, useState } from "react";

import Loader from "@/components/custom ui/Loader";
import OnsaleForm from "@/components/onsales/OnsaleForm";

const OnsaleDetails = ({ params }: { params: { onsaleId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [onsaleDetails, setOnsaleDetails] = useState<OnSaleType | null>(null);

  const getOnsaleDetails = async () => {
    try {
      const res = await fetch(`/api/onsales/${params.onsaleId}`, {
        method: "GET",
      });
      const data = await res.json();
      setOnsaleDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[onsaleId_GET]", err);
    }
  };

  useEffect(() => {
    getOnsaleDetails();
  }, []);

  return loading ? <Loader /> : <OnsaleForm initialData={onsaleDetails} />;
};

export default OnsaleDetails;
