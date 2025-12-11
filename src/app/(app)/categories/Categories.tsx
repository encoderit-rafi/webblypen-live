"use client";
import AppDeleteDialog from "@/components/base/AppDeleteDialog";
import React, { useEffect, useState } from "react";
import { Plus, ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

import { CategoryFormType, CategoryNode } from "./_types/category_types";
import { INITIAL_FORM_DATA } from "./_data/data";
import CategoryForm from "./_component/CategoryForm";
import { Button } from "@/components/ui/button";
import { useQueryGetAllCategories } from "./_api/queries/useQueryGetAllCategories";
import { useMutationDeleteCategory } from "./_api/mutations/useMutationDeleteCategory";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AppStatus from "@/components/base/AppStatus";
import { useQueryCurrentUser } from "../users/_api/queries/useQueryCurrentUser";
type NumberType = string | number | undefined;
export default function Categories() {
  const { data: currentUser } = useQueryCurrentUser();

  const {
    permissions: currentUserPermissions,
    // manager_of_branches: currentUserManagerOfBranches,
  } = currentUser ?? {};
  const permissions = {
    create: currentUserPermissions?.["create_category"],
    update: currentUserPermissions?.["update_category"],
    delete: currentUserPermissions?.["delete_category"],
    // update_status: currentUserPermissions?.["update_status_recipe_category"],
  };
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CategoryFormType>(INITIAL_FORM_DATA);
  const { data, status } = useQueryGetAllCategories({});
  useEffect(() => {
    console.log("✅ ~ Categories ~ data:", data);
  }, [data]);
  const [expanded, setExpanded] = useState<Set<NumberType>>(() => {
    return new Set();
  });
  const [selectedId, setSelectedId] = useState<NumberType>(undefined);

  const { mutate: deleteCategory, isPending: isPendingDeleteCategory } =
    useMutationDeleteCategory();

  return (
    <div>
      <div className="flex  items-center justify-end mb-4 gap-2">
        {permissions.create && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...INITIAL_FORM_DATA,
                type: "create",
                title: "Create new category",
                buttonText: "create",
              })
            }
          >
            <Plus className="mr-2" />
            Add Category
          </Button>
        )}
      </div>
      <AppStatus status={status} is_data={!!data}>
        <Tree
          nodes={data}
          expanded={expanded}
          setExpanded={setExpanded}
          selectedId={selectedId}
          onSelect={setSelectedId}
          setFormData={setFormData}
          permissions={permissions}
        />
      </AppStatus>
      <CategoryForm
        open={formData.type === "create" || formData.type === "update"}
        onOpenChange={() => {
          setFormData(INITIAL_FORM_DATA);
        }}
        formData={formData}
      />
      <AppDeleteDialog
        description={formData.description}
        open={formData.type === "delete"}
        loading={isPendingDeleteCategory}
        onOpenChange={() => setFormData(INITIAL_FORM_DATA)}
        onConfirmDelete={() => {
          deleteCategory(
            { ...formData.data },
            {
              onSuccess() {
                queryClient.invalidateQueries({
                  queryKey: ["get-categories-query"],
                });
                toast.success("Category is deleted successfully!");
                setFormData(INITIAL_FORM_DATA);
              },
              onError(error) {
                if (isAxiosError(error)) {
                  toast.error(
                    error.response?.data?.message ||
                      "Failed to delete Category."
                  );
                } else {
                  toast.error("Something went wrong.");
                }
              },
            }
          );
        }}
      />
    </div>
  );
}

function Tree({
  nodes,
  expanded,
  setExpanded,
  selectedId,
  onSelect,
  setFormData,
  permissions,
}: {
  nodes: CategoryNode[];
  expanded: Set<NumberType>;
  setExpanded: React.Dispatch<React.SetStateAction<Set<NumberType>>>;
  selectedId: NumberType;
  onSelect: (id: NumberType) => void;
  setFormData: (data: CategoryFormType) => void;
  permissions: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}) {
  return (
    <ul className="space-y-1">
      {nodes?.map((n) => (
        <TreeNode
          key={n.id}
          node={n}
          depth={0}
          expanded={expanded}
          setExpanded={setExpanded}
          selectedId={selectedId}
          onSelect={onSelect}
          setFormData={setFormData}
          permissions={permissions}
        />
      ))}
    </ul>
  );
}

function TreeNode({
  node,
  depth,
  expanded,
  setExpanded,
  selectedId,
  onSelect,
  setFormData,
  permissions,
}: {
  node: CategoryNode;
  depth: number;
  // expanded: Set<NumberType>;
  expanded: Set<NumberType>;
  setExpanded: React.Dispatch<React.SetStateAction<Set<NumberType>>>;
  selectedId: NumberType;
  onSelect: (id: NumberType) => void;
  setFormData: (data: CategoryFormType) => void;
  permissions: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}) {
  const hasParent = !!node.parent_id;
  const hasChildren = (node.children_recursive?.length ?? 0) > 0;
  console.log("👉 ~ TreeNode ~ node:", node);
  const isOpen = expanded.has(node.id);

  const toggle = () =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });

  return (
    <li>
      <div
        className={`group flex items-center gap-2 rounded-lg px-3 py-1 ${
          selectedId === node.id
            ? "bg-primary/10 ring-1 ring-primary/30"
            : "hover:bg-muted"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-6 w-6"
          >
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center opacity-50">
            <span className="h-1 w-1 rounded-full bg-gray-400" />
          </span>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(node.id)}
          className="flex flex-1 justify-start gap-2 truncate"
        >
          <span className="truncate font-medium">{node.name}</span>
        </Button>
        <div className="hidden group-hover:flex items-center gap-4 h-4">
          {permissions.create && !hasParent && (
            <Plus
              className="size-full"
              onClick={() =>
                setFormData({
                  type: "create",
                  title: `Create new sub category | ${node.name}`,
                  buttonText: "create",
                  data: {
                    ...INITIAL_FORM_DATA.data,
                    parent_id: node.id,
                  },
                })
              }
            />
          )}
          {permissions.update && (
            <Pencil
              className="size-full"
              onClick={() =>
                setFormData({
                  type: "update",
                  title: `Update | ${node.name}`,
                  buttonText: "update",
                  data: { ...node, is_active: !!Number(node.is_active) },
                })
              }
            />
          )}

          {!hasChildren && permissions.delete && (
            <Trash2
              className="size-full text-destructive"
              onClick={() => {
                setFormData({
                  type: "delete",
                  description: `Are you sure you want to delete ${node.name}? All your data will be removed permanently.`,
                  buttonText: "delete",
                  data: { ...node, is_active: !!Number(node.is_active) },
                });
              }}
            />
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <ul className="mt-1 space-y-1">
          {node.children_recursive!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              setExpanded={setExpanded}
              selectedId={selectedId}
              onSelect={onSelect}
              setFormData={setFormData}
              permissions={permissions}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// // ===== Filtering =====
// // function filterTree(nodes: CategoryNode[], query: string): CategoryNode[] {
// //   const q = query.trim().toLowerCase();
// //   if (!q) return nodes;

// //   const walk = (list: CategoryNode[]): CategoryNode[] => {
// //     const out: CategoryNode[] = [];
// //     for (const n of list) {
// //       const children = walk(n.children ?? []);
// //       const selfMatches =
// //         n.name.toLowerCase().includes(q) ||
// //         (n.code ?? "").toLowerCase().includes(q);
// //       if (selfMatches || children.length) {
// //         out.push({ ...n, children });
// //       }
// //     }
// //     return out;
// //   };

// //   return walk(nodes);
// // }
