import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-blue-1 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card className="bg-blue-300">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-blue-900">Total Revenue</CardTitle>
            <CircleDollarSign className="max-sm:hidden" color="#1E3A8A" />
          </CardHeader>
          <CardContent>
            <p className="text-blue-900 text-body-bold">$ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-300">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-blue-900">Total Orders</CardTitle>
            <ShoppingBag className="max-sm:hidden" color="#1E3A8A" />
          </CardHeader>
          <CardContent>
            <p className="text-blue-900 text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-300">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-blue-900">Total Customer</CardTitle>
            <UserRound className="max-sm:hidden" color="#1E3A8A" />
          </CardHeader>
          <CardContent>
            <p className="text-blue-900 text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sales Chart ($)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
