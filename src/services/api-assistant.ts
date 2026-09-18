import axios from "../configs/axios.config";
import type {Discount} from "./api-discount";
export type Topic="MOVIES"|"MOVIE_DETAILS"|"SEATS"|"DISCOUNTS";
export interface MovieSuggestion {minTicketPrice:number|null;filmId:number;name:string;thumbnail:string|null;duration:number|null;genre:string|null;reason:string;}
export interface SeatSuggestion {showTimeId:number;seatIds:number[];labels:string[];totalPrice:number;reason:string;}
export interface ChatMemory {intent:"DISCOUNTS"|"MOVIES"|"MORE_MOVIES"|"MOVIE_DETAILS"|"SEATS"|"GREETING"|"CLARIFY";genre:string|null;maxDuration:number|null;date:string|null;people:number|null;budget:number|null;discountCode?:string|null;}
export interface ChatReply {discounts:Discount[];memory:ChatMemory|null;reply:string;movies:MovieSuggestion[];seatGroups:SeatSuggestion[];}
export interface ChatRequest {history?:{role:"user"|"assistant";text:string}[];memory?:ChatMemory;memoryFilmId?:number;memoryShowTimeId?:number;seenFilmIds?:number[];useAi?:boolean;message:string;topic:Topic;filmId?:number;preferences?:{genre?:string;maxDuration?:number;date?:string;budget?:number};seats?:{showTimeId:number;people:number;budget?:number};}
export default {chat:async(request:ChatRequest)=>await axios.post("/api/v1/assistant/chat",request) as unknown as {data:ChatReply}};
