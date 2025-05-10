export interface Client {
    id: string;
    name: string;
  }

export interface ClientResponse {
    content: Client[];
    totalElements: number;
}