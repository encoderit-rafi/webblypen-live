"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useManageUrl } from "@/hooks/use-manage-url";
import KeyItems from "./_key-items/KeyItems";
import BatchItems from "./_batch-items/BatchItems";
import { useUserPermissions } from "@/hooks/use-user-permission";
import { PERMISSIONS } from "@/data/global_data";
export default function IngredientsAndItems() {
  const { setParams, getParam } = useManageUrl();
  const permissions = useUserPermissions([
    ...PERMISSIONS.daily_key_item,
    ...PERMISSIONS.daily_batch_item,
  ]);

  return (
    <Tabs
      defaultValue={getParam("active_tab") || "key"}
      onValueChange={(value) =>
        setParams({ page: 1, search: "", active_tab: value })
      }
    >
      <TabsList className="min-w-72">
        {permissions.view_daily_key_item && (
          <TabsTrigger value="key">Key Items</TabsTrigger>
        )}
        {permissions.view_daily_batch_item_module && (
          <TabsTrigger value="batch">Batch Items</TabsTrigger>
        )}
      </TabsList>
      {permissions.view_daily_key_item && (
        <TabsContent value="key">
          <KeyItems />
        </TabsContent>
      )}
      {permissions.view_daily_batch_item_module && (
        <TabsContent value="batch">
          <BatchItems />
        </TabsContent>
      )}
    </Tabs>
  );
}
