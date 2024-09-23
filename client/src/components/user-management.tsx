import { FC, useState } from "react";
import {
  Flex,
  TextField,
  Button,
  Table,
  Avatar,
  Text,
  DropdownMenu,
  IconButton,
  AlertDialog,
} from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { User, UsersResponse, RolesResponse } from "../types";
import SkeletonTableBody from "./skeleton-table-body";
import { useDebounce } from "../hooks/useDebounce";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchRoles, fetchUsers } from "../api";
import { Pagination } from "./pagination";
import { ErrorBox } from "./error-box";

const SEARCH_DEBOUNCE_TIME = 300;

const UserManagement: FC = () => {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debounceSeachValue = useDebounce(searchTerm, SEARCH_DEBOUNCE_TIME);

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery<UsersResponse>({
    queryKey: ["users", { debounceSeachValue, currentPage }],
    queryFn: () => fetchUsers(debounceSeachValue, currentPage.toString()),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    error: rolesError,
  } = useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: () => fetchRoles(),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/users/${userId}`, {
        method: "DELETE",
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToDelete(null);
    },
    onSuccess: () => {
      console.log("User deleted successfuly");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const isLoading = isUsersLoading || isRolesLoading;
  const hasError = Boolean(
    usersError || rolesError || deleteUserMutation.error
  );

  return (
    <Flex gap="5" direction="column">
      <Flex gap="2">
        <TextField.Root
          placeholder="Search by name..."
          style={{ width: "100%" }}
          value={searchTerm}
          onChange={(ev) => setSearchTerm(ev.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        <Button size="2">
          <PlusIcon fontSize="11.2px" />
          Add user
        </Button>
      </Flex>

      {hasError && <ErrorBox />}

      <Table.Root variant="surface" className="table">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Text size="2">User</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text size="2">Role</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Text size="2">Joined</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <SkeletonTableBody rows={10} cols={4} />
          ) : (
            usersData?.data?.map((user) => (
              <Table.Row key={user.id} align="center">
                <Table.Cell>
                  <Avatar
                    size="1"
                    radius="full"
                    src={user.photo}
                    alt={`${user.first} avatar picture`}
                    fallback={"A"}
                  />
                  <Text ml="2">{`${user.first} ${user.last}`}</Text>
                </Table.Cell>
                <Table.Cell>
                  {rolesData?.data.find((r) => r.id === user.roleId)?.name ||
                    user.roleId}
                </Table.Cell>
                <Table.Cell>
                  <Text>{format(new Date(user.createdAt), "MMM d, yyyy")}</Text>
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
                        <DropdownMenu.Item>Edit user</DropdownMenu.Item>

                        <DropdownMenu.Item
                          onClick={() => setUserToDelete(user)}
                        >
                          Delete user
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
              disabled={isLoading || hasError || !usersData?.prev}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Pagination.Button>
            <Pagination.Button
              disabled={isLoading || hasError || !usersData?.next}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Pagination.Button>
          </Pagination.Root>
        </Table.Body>
      </Table.Root>
      {userToDelete ? (
        <AlertDialog.Root
          open={!!userToDelete}
          onOpenChange={(open) => {
            if (open) setUserToDelete(null);
          }}
        >
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Delete user</AlertDialog.Title>
            <AlertDialog.Description size="2">
              Are you sure? The user {userToDelete.first} {userToDelete.last}{" "}
              will be permanently deleted.
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel onClick={() => setUserToDelete(null)}>
                <Button variant="outline" color="gray">
                  <Text highContrast>Cancel</Text>
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  variant="outline"
                  color="red"
                  onClick={() => deleteUserMutation.mutate(userToDelete.id)}
                  loading={deleteUserMutation.isPending}
                >
                  Delete user
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      ) : null}
    </Flex>
  );
};

export default UserManagement;
