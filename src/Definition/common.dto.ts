export interface login {
  email?: string;
  password?: string;
}

export interface ICategory {
  description?: string;
  id?: number;
  name?: string;
}

export interface ICustomer {
  avatar?: string | null;
  email?: string;
  first_name?: string;
  id?: number;
  last_name?: string;
}

export interface IMedicine {
  created_at?: string;
  description?: string;
  id?: number;
  price?: number;
  price_sale?: number;
  quantity?: number;
  status?: number;
  thumbnail?: string;
  title?: string;
  updated_at?: string;
  category?: ICategory;
  user?: ICustomer;
}
