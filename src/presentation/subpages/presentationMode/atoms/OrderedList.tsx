import type { ReactNode } from "react";

interface OrderedListProps {
  children: ReactNode;
}

export const OrderedList = ({ children }: OrderedListProps) => {
  return (
    <ol className="list-decimal list-inside space-y-2 my-4 ml-4">{children}</ol>
  );
};
