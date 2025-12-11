"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Ingredients from "./_ingredients/Ingredients";
import Items from "./_items/Items";
import { useManageUrl } from "@/hooks/use-manage-url";
export default function IngredientsAndItems() {
  const { setParams, getParam } = useManageUrl();

  return (
    <Tabs
      defaultValue={getParam("active_tab") || "ingredients"}
      onValueChange={(value) =>
        setParams({ page: 1, search: "", active_tab: value })
      }
    >
      <TabsList className="min-w-72">
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
      </TabsList>
      <TabsContent value="ingredients">
        <Ingredients />
      </TabsContent>
      <TabsContent value="items">
        <Items />
      </TabsContent>
    </Tabs>
  );
}
