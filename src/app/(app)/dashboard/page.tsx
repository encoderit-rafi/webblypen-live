"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useQueryGetAllDashboardData } from "./_api/queries/useQueryGetAllDashboardData";
import Ingredients from "../ingredients/_ingredients/Ingredients";

export default function Dashboard() {
  const { data: dashboardData, isLoading: dashboardDataLoading } =
    useQueryGetAllDashboardData({ enabled: true });

  return (
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData &&
          Object.keys(dashboardData || {}).map((key, index) => {
            const { total, active } = dashboardData[key];

            const item = {
              title: key.replace(/_/g, " ").toUpperCase(),
              value: total || 0,
              subtitle: `Active: ${active || 0}`,
              change: "",
            };

            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600">
                    {item.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-muted">
                    <ShoppingCart className="h-5 w-5 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">Total {item.value}</div>
                    <p className="text-sm text-green-600">{item.subtitle}</p>
                    {item.change && (
                      <div className="flex items-center text-xs">
                        <span
                          className={`font-medium ${
                            item.change.includes("+")
                              ? "text-green-600"
                              : item.change.includes("critical") ||
                                item.change.includes("urgent")
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {item.change}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="space-y-3 mt-6">
        <h2>Ingredients</h2>
        <Ingredients />
      </div>
    </div>
  );
}
