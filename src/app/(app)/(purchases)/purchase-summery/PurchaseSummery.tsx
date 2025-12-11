//PurchaseSummery
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useManageUrl } from "@/hooks/use-manage-url";
import PurchaseSummeryReceivedProducts from "./PurchaseSummeryReceivedProducts";
import PurchaseSummeryCategoryWiseProducts from "./PurchaseSummeryCategoryWiseProducts";
import PurchaseSummeryCategoryWiseProductsSum from "./PurchaseSummeryCategoryWiseProductsSum";
import PurchaseSummerySupplierWiseProductsSum from "./PurchaseSummerySupplierWiseProductsSum";
const tabs = [
  {
    id: 1,
    value: "received-products",
    name: "Received Products",
    content: <PurchaseSummeryReceivedProducts />,
  },
  {
    id: 2,
    value: "category-wise-products",
    name: "Category Wise Products",
    content: <PurchaseSummeryCategoryWiseProducts />,
  },
  {
    id: 3,
    value: "category-wise-products-sum",
    name: "Category Wise Products Sum",
    content: <PurchaseSummeryCategoryWiseProductsSum />,
  },
  {
    id: 4,
    value: "supplier-wise-products-sum",
    name: "Supplier Wise Products Sum ",
    content: <PurchaseSummerySupplierWiseProductsSum />,
  },
];
export default function PurchaseSummery() {
  const { setParams, getParam } = useManageUrl();

  return (
    <Tabs
      defaultValue={getParam("active_tab") || tabs[0].value}
      onValueChange={(value) =>
        setParams({ page: 1, search: "", active_tab: value })
      }
    >
      <TabsList className="min-w-72">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.value}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
