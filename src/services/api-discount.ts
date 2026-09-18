import axios from "../configs/axios.config";
export interface Discount {
 id:number;code:string;title:string;description:string;image:string;type:"FIXED"|"PERCENT";value:number;minOrder:number;maxDiscount:number|null;startsOn:string;endsOn:string;active:boolean;
}
export type DiscountInput=Omit<Discount,"id">;
export interface DiscountQuote {code:string;subtotal:number;discountAmount:number;total:number;}
interface Result<T>{statusCode:number;data:T;}
const discountApi={
 list:async(admin=false)=>await axios.get(admin?"/api/v1/admin/discounts":"/api/v1/discounts") as unknown as Result<Discount[]>,
 quote:async(code:string)=>await axios.post("/api/v1/discounts/quote",{code}) as unknown as Result<DiscountQuote>,
 create:async(input:DiscountInput)=>await axios.post("/api/v1/discounts",input),
 update:async(id:number,input:DiscountInput)=>await axios.put(`/api/v1/discounts/${id}`,input),
 remove:async(id:number)=>await axios.delete(`/api/v1/discounts/${id}`),
};
export default discountApi;
