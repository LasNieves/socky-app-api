import { Category } from './category.entity';
export interface Workspace {
  id: string
  name: string
  icon: string
  personal: boolean,
  categories?: Category[]
}
