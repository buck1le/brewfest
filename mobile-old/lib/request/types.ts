export interface FetchResponse<Response> {
  loading: boolean;
  status?: number;
  data?: Response;
  error?: string;
}
