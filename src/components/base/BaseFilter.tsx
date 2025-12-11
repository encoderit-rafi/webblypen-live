import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import BranchDropdown from "../dropdowns/BranchDropdown";
import { useManageUrl } from "@/hooks/use-manage-url";
import SupplierDropdown from "../dropdowns/SupplierDropdown";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import ProductDropdown from "../dropdowns/ProductDropdown";
import UnitDropdown from "../dropdowns/UnitDropdown";
import CostCenterDropdown from "../dropdowns/CostCenterDropdown";
import ExpenseCategoriesDropdown from "../dropdowns/ExpenseCategoriesDropdown";
import RecipeDropdown from "../dropdowns/RecipeDropdown";
import RecipeCategoriesDropdown from "../dropdowns/RecipeCategory";
import UserDropdown from "../dropdowns/UserDropdown";
import { ReactNode } from "react";
import { useQueryCurrentUser } from "@/app/(app)/users/_api/queries/useQueryCurrentUser";

type values =
  | "branch_id"
  | "supplier_id"
  | "product_id"
  | "unit_id"
  | "category_id"
  | "sub_category_id"
  | "cost_center_id"
  | "expense_category_id"
  | "recipe_id"
  | "recipe_category_id"
  | "requested_by"
  | "approved_by"
  | "received_by";
type TProps = {
  filters: values[];
};
export function BaseFilter({ filters = [] }: TProps) {
  const { getParams, setParams } = useManageUrl();
  const {
    branch_id,
    supplier_id,
    product_id,
    unit_id,
    category_id,
    sub_category_id,
    cost_center_id,
    expense_category_id,
    recipe_id,
    recipe_category_id,
    approved_by,
    requested_by,
    received_by,
  } = getParams;
  const { data: currentUser } = useQueryCurrentUser();
  const { branch_id: currentUserBranchID, branch: currentUserBranch } =
    currentUser ?? {};
  const items: { values: values; component: ReactNode }[] = [
    {
      values: "approved_by",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <UserDropdown
            selected_id={approved_by}
            props={{ placeholder: "Approved By" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == approved_by;
              const userID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["approved_by"]);
                return;
              }

              setParams({
                approved_by: String(userID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "received_by",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <UserDropdown
            selected_id={received_by}
            props={{ placeholder: "Received By" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == received_by;
              const userID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["received_by"]);
                return;
              }

              setParams({
                received_by: String(userID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "requested_by",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <UserDropdown
            selected_id={requested_by}
            props={{ placeholder: "Requested By" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == requested_by;
              const userID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["requested_by"]);
                return;
              }

              setParams({
                requested_by: String(userID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "branch_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <BranchDropdown
            selected_id={branch_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == branch_id;
              const branchID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["branch_id"]);
                return;
              }

              setParams({
                branch_id: String(branchID),
              });
            }}
            props={{
              label: "Branch",
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "supplier_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <SupplierDropdown
            selected_id={supplier_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == supplier_id;
              const supplierID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["supplier_id"]);
                return;
              }

              setParams({
                supplier_id: String(supplierID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "product_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <ProductDropdown
            selected_id={product_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == product_id;
              const productID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["product_id"]);
                return;
              }

              setParams({
                product_id: String(productID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "unit_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <UnitDropdown
            selected_id={unit_id}
            params={{
              product_id: product_id,
            }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == unit_id;
              const unitID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["unit_id"]);
                return;
              }

              setParams({
                unit_id: String(unitID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "category_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <CategoryDropdown
            selected_id={category_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == category_id;
              const categoryID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["category_id"]);
                return;
              }

              setParams({
                category_id: String(categoryID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "sub_category_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <CategoryDropdown
            selected_id={sub_category_id}
            props={{ placeholder: "Select Sub Category" }}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == sub_category_id;
              const subCategoryID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["sub_category_id"]);
                return;
              }

              setParams({
                sub_category_id: String(subCategoryID),
              });
            }}
            params={{
              parent_id: category_id,
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "cost_center_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <CostCenterDropdown
            selected_id={cost_center_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == cost_center_id;
              const costCenterID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["cost_center_id"]);
                return;
              }

              setParams({
                cost_center_id: String(costCenterID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "expense_category_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <ExpenseCategoriesDropdown
            selected_id={expense_category_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == expense_category_id;
              const expenseCategoryID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["expense_category_id"]);
                return;
              }

              setParams({
                expense_category_id: String(expenseCategoryID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "recipe_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <RecipeDropdown
            selected_id={recipe_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == recipe_id;
              const recipeID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["recipe_id"]);
                return;
              }

              setParams({
                recipe_id: String(recipeID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
    {
      values: "recipe_category_id",
      component: (
        <DropdownMenuItem asChild className="p-0">
          <RecipeCategoriesDropdown
            selected_id={recipe_category_id}
            onValueChange={(val) => {
              if (!val.id) return;
              const isEqual = val.id == recipe_category_id;
              const branchID = isEqual ? "" : val.id;
              if (isEqual) {
                setParams({}, ["recipe_category_id"]);
                return;
              }

              setParams({
                recipe_category_id: String(branchID),
              });
            }}
          />
        </DropdownMenuItem>
      ),
    },
  ] as const satisfies { values: values; component: ReactNode }[];
  const filteredItems = items.filter((item) => {
    // Hide branch_id dropdown if current user already has branch assigned
    if (item.values === "branch_id" && currentUserBranchID) {
      return false;
    }

    // Otherwise, include only if it's in filters
    return filters.includes(item.values);
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-8 "
          disabled={filters.length == 0}
        >
          <Filter />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="space-y-0.5">
        <DropdownMenuItem asChild className="p-0">
          <Button
            variant={"ghost"}
            className="h-8 text-destructive hover:text-destructive!  w-full"
            onClick={() => {
              setParams({ page: 1 }, [
                "branch_id",
                "supplier_id",
                "product_id",
                "unit_id",
                "category_id",
                "sub_category_id",
                "cost_center_id",
                "expense_category_id",
                "recipe_id",
                "recipe_category_id",
                "requested_by",
                "approved_by",
              ]);
            }}
          >
            Clear All
            <X className="ml-auto text-destructive" />
          </Button>
        </DropdownMenuItem>
        {filteredItems.map((item) => item.component)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
