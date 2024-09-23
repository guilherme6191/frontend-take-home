import { Table, Skeleton } from "@radix-ui/themes";
import { FC } from "react";

interface UserTableProps {
  cols: number;
  rows: number;
}

const SkeletonTableBody: FC<UserTableProps> = ({ cols, rows, ...props }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Table.Row key={rowIndex} align="center" {...props}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Table.Cell key={colIndex}>
            <Skeleton width="full" />
          </Table.Cell>
        ))}
      </Table.Row>
    ))}
  </>
);

export default SkeletonTableBody;
