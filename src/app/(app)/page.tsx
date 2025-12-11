"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryGetAllDashboardData } from "./dashboard/_api/queries/useQueryGetAllDashboardData";
import Ingredients from "./ingredients/_ingredients/Ingredients";
import AppStatus from "@/components/base/AppStatus";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Home() {
  const currentUser = useCurrentUser();
  const { permissions: currentUserPermissions } = currentUser?.data ?? {};
  const permissions = {
    product_module: currentUserPermissions?.["view_product_module"],
  };
  const { data: dashboardData, status } = useQueryGetAllDashboardData({
    enabled: true,
  });
  console.log("🚀 ~ Home ~ dashboardData:", dashboardData);

  return (
    <div className="p-6 min-h-screen">
      <AppStatus
        status={status}
        is_data={!!Object.keys(dashboardData || {}).length}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(dashboardData || {}).map((key, index) => {
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
                  <CardTitle className="text-sm font-medium ">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">Total {item.value}</div>
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
        {permissions.product_module && (
          <div className="space-y-3 mt-6">
            <h2>Ingredients</h2>
            <Ingredients />
          </div>
        )}
      </AppStatus>
    </div>
  );
}
