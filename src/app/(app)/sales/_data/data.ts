import { FORM_DATA } from "@/data/global_data";
import { SaleFormType } from "../_types/sale_types";

export const INITIAL_FORM_DATA: SaleFormType = {
  ...FORM_DATA,
  data: {
    branch: { id: "", label: "", value: "", name: "" },
    file: {
      name: "",
      size: 0,
      type: "",
      url: "",
      id: ""
    },

  },
};
// // export const INITIAL_TABLE_DATA: SaleSchemaType[] = [
// //   {
// //     sl: 1,
// //     product: { label: "Rice", value: "rice" },
// //     brand: { label: "ACI", value: "aci" },
// //     category: { label: "Grocery", value: "grocery" },
// //     sale_date: "2025-07-01T00:00:00.000Z",
// //     quantity: 100,
// //     revenue: 5000,
// //   },
// //   {
// //     sl: 2,
// //     product: { label: "Salt", value: "salt" },
// //     brand: { label: "ACI", value: "aci" },
// //     category: { label: "Grocery", value: "grocery" },
// //     sale_date: "2025-07-02T00:00:00.000Z",
// //     quantity: 60,
// //     revenue: 1200,
// //   },
// //   {
// //     sl: 3,
// //     product: { label: "Milk Powder", value: "milk_powder" },
// //     brand: { label: "Dano", value: "dano" },
// //     category: { label: "Dairy", value: "dairy" },
// //     sale_date: "2025-07-03T00:00:00.000Z",
// //     quantity: 45,
// //     revenue: 7200,
// //   },
// //   {
// //     sl: 4,
// //     product: { label: "Cooking Oil", value: "cooking_oil" },
// //     brand: { label: "Fresh", value: "fresh" },
// //     category: { label: "Grocery", value: "grocery" },
// //     sale_date: "2025-07-04T00:00:00.000Z",
// //     quantity: 70,
// //     revenue: 9800,
// //   },
// //   {
// //     sl: 5,
// //     product: { label: "Tea", value: "tea" },
// //     brand: { label: "Ispahani", value: "ispahani" },
// //     category: { label: "Beverages", value: "beverages" },
// //     sale_date: "2025-07-04T00:00:00.000Z",
// //     quantity: 40,
// //     revenue: 4000,
// //   },
// //   {
// //     sl: 6,
// //     product: { label: "Soap", value: "soap" },
// //     brand: { label: "Lifebuoy", value: "lifebuoy" },
// //     category: { label: "Personal Care", value: "personal_care" },
// //     sale_date: "2025-07-05T00:00:00.000Z",
// //     quantity: 90,
// //     revenue: 3600,
// //   },
// //   {
// //     sl: 7,
// //     product: { label: "Flour", value: "flour" },
// //     brand: { label: "Teer", value: "teer" },
// //     category: { label: "Grocery", value: "grocery" },
// //     sale_date: "2025-07-06T00:00:00.000Z",
// //     quantity: 120,
// //     revenue: 4800,
// //   },
// //   {
// //     sl: 8,
// //     product: { label: "Sugar", value: "sugar" },
// //     brand: { label: "Desh", value: "desh" },
// //     category: { label: "Grocery", value: "grocery" },
// //     sale_date: "2025-07-07T00:00:00.000Z",
// //     quantity: 80,
// //     revenue: 3200,
// //   },
// //   {
// //     sl: 9,
// //     product: { label: "Lentils", value: "lentils" },
// //     brand: { label: "Pran", value: "pran" },
// //     category: { label: "Grocery", value: "grocery" },
// //     sale_date: "2025-07-08T00:00:00.000Z",
// //     quantity: 50,
// //     revenue: 2500,
// //   },
// //   {
// //     sl: 10,
// //     product: { label: "Butter", value: "butter" },
// //     brand: { label: "Amul", value: "amul" },
// //     category: { label: "Dairy", value: "dairy" },
// //     sale_date: "2025-07-09T00:00:00.000Z",
// //     quantity: 30,
// //     revenue: 4500,
// //   },
// // ];
