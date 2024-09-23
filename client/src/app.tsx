import "./app.css";
import { Container, Flex, Tabs } from "@radix-ui/themes";
import { fetchRoles, fetchUsers } from "./api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { UsersResponse, RolesResponse } from "./types";
import UserManagement from "./components/user-management";
import RoleManagement from "./components/role-management";

const TABS: Record<TabKeyOptions, { value: string; title: string }> = {
  users: {
    title: "Users",
    value: "users",
  },
  roles: {
    title: "Roles",
    value: "roles",
  },
};
type TabKeyOptions = "users" | "roles";

function App() {
  // load all page data on app load
  useQuery<UsersResponse>({
    queryKey: ["users", { debounceSeachValue: "", currentPage: 1 }],
    queryFn: () => fetchUsers("", "1"),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
  useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: () => fetchRoles(),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  return (
    <div>
      <Container size="4" py="7">
        <Tabs.Root defaultValue={TABS.users.value}>
          <Flex gap="5" direction="column">
            <Tabs.List>
              {Object.keys(TABS).map((key) => {
                return (
                  <Tabs.Trigger
                    value={TABS[key as TabKeyOptions].value}
                    key={key}
                  >
                    {TABS[key as TabKeyOptions].title}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <Tabs.Content value="users">
              <UserManagement />
            </Tabs.Content>
            <Tabs.Content value="roles">
              <RoleManagement />
            </Tabs.Content>
          </Flex>
        </Tabs.Root>
      </Container>
    </div>
  );
}

export default App;
