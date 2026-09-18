import {create} from "zustand";
export const useAssistantContext=create<{showTimeId:number|null;setShowTimeId:(id:number|null)=>void}>(set=>({showTimeId:null,setShowTimeId:id=>set({showTimeId:id})}));
