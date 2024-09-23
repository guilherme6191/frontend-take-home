import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Flex, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

export const ErrorBox = ({ children, ...props }: { children?: ReactNode }) => {
  return (
    <Flex justify="center" align="center" {...props}>
      {children ? (
        children
      ) : (
        <>
          <ExclamationTriangleIcon color="red" />
          <Text size="2" color="red" ml="2">
            Something went wrong!
          </Text>
        </>
      )}
    </Flex>
  );
};
