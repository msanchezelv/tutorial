import { Client } from "./Client";
import { Game } from "./Game";

export interface Loan {
  id: string,
  client?: Client,
  game?: Game,
  loanDate: string,
  returnDate: string,
}

export interface LoanResponse {
    content: Loan[];
    totalElements: number;
}