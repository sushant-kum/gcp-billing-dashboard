export interface UserData {
  _id: string;
  app_permissions: {
    app: string;
    permissions: ('read' | 'write')[];
  }[];
  created_date: Date;
  email: string;
  gender: 'male' | 'female' | 'others';
  is_active: boolean;
  name: string;
  password_hash: string;
  phone?: string;
  username: string;
  extra_data?: any;
}
