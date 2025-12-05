import type { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
}

export const ListItem = ({ children }: ListItemProps) => {
  return <li className="text-gray-700 leading-relaxed pl-2">{children}</li>;
};
