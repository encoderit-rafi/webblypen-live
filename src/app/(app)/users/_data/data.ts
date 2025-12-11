import { EMPTY_OPTIONS_DATA,  } from "@/data/global_data";
import {  UserSchemaType } from "../_types/user_types";

export const INITIAL_FORM_DATA: UserSchemaType= {
    id: "",
    name: "",
    email: "",
    avatar: null,
    status: true,
    branch: {id:'',name:''},
    user_role: {id:'',name:''},
};
