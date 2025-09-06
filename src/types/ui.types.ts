import { type IconType } from "react-icons";

export type SidebarItem = {
  label: string;
  icon: IconType;
  path: string;
};

export interface formData {
  name: string;
  motto: string;
  abbreviation: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  logo: string;
  docs: File | null;
}
