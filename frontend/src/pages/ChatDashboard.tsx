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
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const ChatDashboard = () => {
  type User = {
    id: number;
    name: string;
    email: string;
  };

  type Message = {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
  };

  type MessagePagination = {
    limit: number;
    hasMore: boolean;
    nextCursor: number | null;
  };

  //states
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  //selected user
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  //message states
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagePagination, setMessagePagination] =
    useState<MessagePagination | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  //sent message
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { user: currentUser } = useAuth();
  //refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  //fetchs
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
  //chat history fetch
  const fetchChatHistory = async (receiverId: number, before?: number) => {
    try {
      if (before) {
        setIsLoadingOlder(true);
      } else {
        setIsLoadingMessages(true);
        setMessages([]);
      }

      const response = await api.get(`/messages/${receiverId}`, {
        params: {
          limit: 30,
          ...(before && { before }),
        },
      });

      const { messages: newMessages, pagination } = response.data.data;

      if (before) {
        setMessages((prev) => [...newMessages, ...prev]);
      } else {
        setMessages(newMessages);
      }

      setMessagePagination(pagination);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      toast.error("Unable to load chat history");
    } finally {
      setIsLoadingMessages(false);
      setIsLoadingOlder(false);
    }
  };

  //infinite scroll
  const handleUserScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 80;

    if (isNearBottom && hasMore && !loadingRef.current) {
      fetchUsers(page + 1);
    }
  };
  const handleChatScroll = async () => {
    const container = chatContainerRef.current;

    if (!container || !messagePagination?.hasMore) return;

    if (container.scrollTop <= 50 && !isLoadingOlder) {
      const previousHeight = container.scrollHeight;
      const cursor = messagePagination.nextCursor;

      if (!cursor || !selectedUser) return;

      await fetchChatHistory(selectedUser.id, cursor);

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - previousHeight;
      });
    }
  };

  //sent message function
  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = messageContent.trim();

    if (!content || !selectedUser || isSending) return;

    try {
      setIsSending(true);

      const response = await api.post("/messages", {
        receiverId: selectedUser.id,
        content,
      });

      const newMessage = response.data.data;

      setMessages((prev) => [...prev, newMessage]);
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Unable to send message");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background px-4 pt-4 pb-0 sm:p-6">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden rounded-xl border bg-card">
        {/* Users Sidebar */}
        <aside className="flex w-[38%] shrink-0 flex-col border-r sm:w-2/5 md:w-80 lg:w-96">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b p-2 sm:p-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground sm:text-lg">
                Messages
              </h2>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Connect with people
              </p>
            </div>

            <Button variant="ghost" size="icon">
              <MoreVertical className="size-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="border-b p-2 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input placeholder="Search..." className="h-8 pl-8 text-xs sm:h-9 sm:pl-9 sm:text-sm" />
            </div>
          </div>

          {/* User List */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-1 px-2 py-3 sm:gap-2 sm:px-4 sm:py-4">
              <Users className="size-4 text-muted-foreground" />
              <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm">
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
                    onClick={() => {
                      setSelectedUser(user);
                      fetchChatHistory(user.id);
                    }}
                    className={`flex w-full items-center gap-2 border-b px-2 py-2 text-left transition-colors hover:bg-accent sm:gap-3 sm:px-4 sm:py-3 ${
                      selectedUser?.id === user.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground sm:size-10 sm:text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                        {user.name}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
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
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex h-18.25 items-center justify-between border-b px-3 sm:px-6">
            {selectedUser ? (
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedUser.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Select a conversation
                </p>
                <p className="text-xs text-muted-foreground">
                  Choose a user to start chatting
                </p>
              </div>
            )}
          </div>

          {/*  Chat State */}
          <div
            ref={chatContainerRef}
            onScroll={handleChatScroll}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-2 sm:p-4"
          >
            {isLoadingMessages && (
              <p className="text-center text-sm text-muted-foreground">
                Loading messages...
              </p>
            )}

            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUser?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 sm:max-w-[75%] sm:px-4 sm:py-3 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="break-words text-sm">{message.content}</p>

                    <p
                      className={`mt-1 text-[10px] ${
                        isOwnMessage
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input - Disabled until conversation selected */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 border-t p-2 sm:gap-3 sm:p-4"
          >
            <Input
              placeholder={
                selectedUser
                  ? "Type your message..."
                  : "Select a conversation first..."
              }
              value={messageContent}
              onChange={(event) => setMessageContent(event.target.value)}
              disabled={!selectedUser || isSending}
              maxLength={5000}
            />

            <Button
              type="submit"
              disabled={!selectedUser || !messageContent.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatDashboard;
