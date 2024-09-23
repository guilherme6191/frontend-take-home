import { Button, Table } from "@radix-ui/themes";
import { ComponentProps, ReactNode } from "react";
import "./pagination.css";

const PaginationRoot = ({ children }: { children: ReactNode }) => {
  return (
    <tr
      className="table-footer"
      role="tfoot"
      aria-description="Table footer with pagination"
    >
      <Table.Cell className="cell">{children}</Table.Cell>
    </tr>
  );
};

type PaginationButtonProps = {
  disabled?: boolean;
  onClick: ComponentProps<typeof Button>["onClick"];
  children: ReactNode;
};

const PaginationButton = ({
  disabled = false,
  onClick,
  children,
  ...props
}: PaginationButtonProps) => {
  return (
    <Button
      size="1"
      variant="outline"
      color="gray"
      highContrast
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

const Pagination = {
  Root: PaginationRoot,
  Button: PaginationButton,
};

export { Pagination };
