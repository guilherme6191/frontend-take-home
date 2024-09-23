import { FC, useState } from "react";
import {
  Flex,
  TextField,
  Button,
  Table,
  Text,
  DropdownMenu,
  IconButton,
  AlertDialog,
  TextArea,
} from "@radix-ui/themes";
import {
  DotsHorizontalIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Role, RolesResponse } from "../types";
import SkeletonTableBody from "./skeleton-table-body";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchRoles } from "../api";
import { Pagination } from "./pagination";
import { ErrorBox } from "./error-box";

const RoleManagement: FC = () => {
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

  const { data, isLoading, error } = useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: () => fetchRoles(),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const updateRoleMutation = useMutation({
    mutationFn: (role: Role) => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/roles/${role.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(role),
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      setRoleToEdit(null);
    },
    onSuccess: () => {
      console.log("Role updated successfuly");
    },
    onError: (error) => {
      console.error("Error updating role:", error);
    },
  });

  const hasError = Boolean(error || updateRoleMutation.error);

  return (
    <Flex gap="5" direction="column">
      {hasError && <ErrorBox />}
      <Table.Root variant="surface" className="table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Text size="2">Name</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text size="2">Description</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text size="2">Last Update at</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text size="2">Is Default</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <SkeletonTableBody rows={10} cols={4} />
          ) : (
            data?.data?.map((role) => (
              <Table.Row key={role.id} align="center">
                <Table.Cell>
                  <Text>{role.name}</Text>
                </Table.Cell>
                <Table.Cell justify="start">
                  <Text>{role.description}</Text>
                </Table.Cell>
                <Table.Cell justify="start">
                  <Text>{format(new Date(role.updatedAt), "MMM d, yyyy")}</Text>
                </Table.Cell>
                <Table.Cell justify="center">
                  {role.isDefault ? (
                    <CheckCircledIcon color="green" />
                  ) : (
                    <CrossCircledIcon color="red" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Flex>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton
                          radius="full"
                          variant="ghost"
                          color="gray"
                          highContrast
                          size="1"
                        >
                          <DotsHorizontalIcon />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => setRoleToEdit(role)}>
                          Edit role
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
          <Pagination.Root>
            <Pagination.Button
              disabled={isLoading || !error || !data?.prev}
              onClick={() => {}}
            >
              Previous
            </Pagination.Button>
            <Pagination.Button
              disabled={isLoading || !error || !data?.next}
              onClick={() => {}}
            >
              Next
            </Pagination.Button>
          </Pagination.Root>
        </Table.Body>
      </Table.Root>
      <RoleUpdateAlertForm
        role={roleToEdit}
        onClose={() => setRoleToEdit(null)}
        onSave={(role) => updateRoleMutation.mutate(role)}
        isLoading={updateRoleMutation.isPending}
      />
    </Flex>
  );
};

const RoleUpdateAlertForm = ({
  role,
  onClose,
  onSave,
  isLoading = false,
}: {
  role: Role | null;
  onClose: () => void;
  isLoading: boolean;
  onSave: (role: Role) => void;
}) => {
  const [name, setName] = useState(role?.name || "");

  if (!role) return null;

  return (
    <AlertDialog.Root
      open={!!role}
      onOpenChange={(open) => {
        if (open) onClose();
      }}
    >
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Edit role</AlertDialog.Title>
        <AlertDialog.Description>
          <Flex direction="column" gap="3">
            <Text>Name</Text>
            <TextField.Root
              defaultValue={role.name}
              disabled={isLoading}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSave({ ...role, name });
                }
              }}
            />
            <Text>Description</Text>
            <TextArea defaultValue={role.description} disabled />
          </Flex>
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel onClick={() => onClose()}>
            <Button variant="outline" color="gray">
              <Text highContrast>Cancel</Text>
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="outline"
              onClick={() => onSave({ ...role, name })}
              loading={isLoading}
              disabled={name === role.name}
            >
              Save
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default RoleManagement;
