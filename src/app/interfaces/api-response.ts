export interface ApiResponse {
  status: string;
  message: string;
  data?: any;
  token?: string;
  user_id?: string;
}
