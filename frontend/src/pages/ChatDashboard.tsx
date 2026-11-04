import {
  MessageCircle,
  Search,
  Users,
  UserRound,
  MoreVertical,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";

const ChatDashboard = () => {
  type User = {
    id: number;
    name: string;
    email: string;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const loadingRef = useRef(false);

  const fetchUsers = async (nextPage: number) => {
    if (loadingRef.current || (!hasMore && nextPage !== 1)) return;

    try {
      loadingRef.current = true;
      setIsLoadingUsers(true);

      const response = await api.get("/users", {
        params: {
          page: nextPage,
          limit: 20,
        },
      });

      const { users: newUsers, pagination } = response.data.data;

      setUsers((prevUsers) =>
        nextPage === 1 ? newUsers : [...prevUsers, ...newUsers],
      );

      setPage(nextPage);
      setHasMore(nextPage < pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      loadingRef.current = false;
      setIsLoadingUsers(false);
    }
  };

  //first load

  useEffect(() => {
    fetchUsers(1);
  }, []);

  //infinite scroll
  const handleUserScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 80;

    if (isNearBottom && hasMore && !loadingRef.current) {
      fetchUsers(page + 1);
    }
  };
  return (
    <div className="h-full min-h-[calc(100vh-8rem)] bg-background p-4 sm:p-6">
      <div className="mx-auto flex h-full max-w-7xl overflow-hidden rounded-xl border bg-card">
        {/* Users Sidebar */}
        <aside className="flex w-full flex-col border-r md:w-80 lg:w-96">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Messages
              </h2>
              <p className="text-sm text-muted-foreground">
                Connect with people
              </p>
            </div>

            <Button variant="ghost" size="icon">
              <MoreVertical className="size-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input placeholder="Search users..." className="pl-9" />
            </div>
          </div>

          {/* User List */}
          {/* User List */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-2 px-4 py-4">
              <Users className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                All Users
              </h3>
              <span className="text-xs text-muted-foreground">
                ({users.length})
              </span>
            </div>

            <div
              onScroll={handleUserScroll}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <button
                    key={user.id}
                    className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))
              ) : !isLoadingUsers ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No users available
                </div>
              ) : null}

              {isLoadingUsers && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Loading users...
                </p>
              )}

              {!hasMore && users.length > 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  You've reached the end
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Chat Window */}
        <main className="hidden flex-1 flex-col md:flex">
          {/* Chat Header */}
          <div className="flex h-[73px] items-center justify-between border-b px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <UserRound className="size-5 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Select a conversation
                </p>
                <p className="text-xs text-muted-foreground">
                  Choose a user to start chatting
                </p>
              </div>
            </div>
          </div>

          {/* Empty Chat State */}
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="size-9 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              Your messages
            </h2>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Select someone from your user list and start a conversation. Your
              messages will appear here.
            </p>
          </div>

          {/* Message Input - Disabled until conversation selected */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Input placeholder="Select a conversation first..." disabled />

              <Button disabled>
                <MessageCircle className="size-4" />
                Send
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatDashboard;
