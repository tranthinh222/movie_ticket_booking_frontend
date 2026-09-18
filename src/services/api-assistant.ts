import axios from "../configs/axios.config";
export type Topic="MOVIES"|"MOVIE_DETAILS"|"SEATS";
export interface MovieSuggestion {filmId:number;name:string;thumbnail:string|null;duration:number|null;genre:string|null;reason:string;}
export interface SeatSuggestion {showTimeId:number;seatIds:number[];labels:string[];totalPrice:number;reason:string;}
export interface ChatReply {reply:string;movies:MovieSuggestion[];seatGroups:SeatSuggestion[];}
export interface ChatRequest {message:string;topic:Topic;filmId?:number;preferences?:{genre?:string;maxDuration?:number;date?:string};seats?:{showTimeId:number;people:number;budget?:number};}
export default {chat:async(request:ChatRequest)=>await axios.post("/api/v1/assistant/chat",request) as unknown as {data:ChatReply}};
