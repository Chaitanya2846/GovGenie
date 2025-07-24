// "use client"
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { io } from "socket.io-client";
// import { toast } from "react-toastify";
import {
  Search,
  MessageSquare,
  Phone,
  Video,
  File,
  Send,
  Clock,
  MoreVertical,
  Image,
  Paperclip,
  Smile,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";

const CONVERSATIONS = [
  {
    id: 1,
    customer: {
      id: "c1",
      name: "Priya Patel",
      image: "/placeholder.svg?height=40&width=40",
    },
    lastMessage:
      "I need help with my Aadhar card update. Can you guide me through the process?",
    timestamp: "10:30 AM",
    unread: 2,
    online: true,
    orderId: "ORD-1234",
    service: "Aadhar Card Update",
  },
  {
    id: 2,
    customer: {
      id: "c2",
      name: "Raj Verma",
      image: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Thank you for your help with the PAN card application!",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
    orderId: "ORD-1233",
    service: "PAN Card Application",
  },
  {
    id: 3,
    customer: {
      id: "c3",
      name: "Amit Kumar",
      image: "/placeholder.svg?height=40&width=40",
    },
    lastMessage:
      "I have uploaded the required documents for my income certificate.",
    timestamp: "Yesterday",
    unread: 1,
    online: true,
    orderId: "ORD-1232",
    service: "Income Certificate",
  },
  {
    id: 4,
    customer: {
      id: "c4",
      name: "Sneha Gupta",
      image: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "When can I expect my domicile certificate to be ready?",
    timestamp: "Mar 8",
    unread: 0,
    online: false,
    orderId: "ORD-1231",
    service: "Domicile Certificate",
  },
];

const MESSAGES = [
  {
    id: "m1",
    senderId: "c1",
    content:
      "Hello! I need help with my Aadhar card update. Can you guide me through the process?",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: "m2",
    senderId: "agent",
    content:
      "Hi Priya! I'd be happy to help you with your Aadhar card update. Could you please tell me what specific changes you need to make?",
    timestamp: "10:32 AM",
    type: "text",
  },
  {
    id: "m3",
    senderId: "c1",
    content: "I need to update my address and mobile number.",
    timestamp: "10:33 AM",
    type: "text",
  },
  {
    id: "m4",
    senderId: "agent",
    content:
      "Great! For address and mobile number updates, we'll need the following documents:\n\n1. Address proof (utility bill, rental agreement, etc.)\n2. Identity proof (any government ID)\n3. Your current Aadhar card",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: "m5",
    senderId: "c1",
    content:
      "I have my electricity bill for address proof and my voter ID card. Will these work?",
    timestamp: "10:36 AM",
    type: "text",
  },
  {
    id: "m6",
    senderId: "agent",
    content:
      "Yes, those documents will work perfectly! Could you please upload scanned copies or clear photos of them?",
    timestamp: "10:37 AM",
    type: "text",
  },
  {
    id: "m7",
    senderId: "c1",
    content: "Here is my electricity bill",
    timestamp: "10:40 AM",
    type: "file",
    fileType: "pdf",
    fileName: "Electricity_Bill.pdf",
  },
  {
    id: "m8",
    senderId: "c1",
    content: "And here is my voter ID card",
    timestamp: "10:40 AM",
    type: "file",
    fileType: "image",
    fileName: "Voter_ID.jpg",
  },
  {
    id: "m9",
    senderId: "agent",
    content:
      "Thank you for uploading the documents. I've received them and they look good. Let me start processing your Aadhar update request. It usually takes 3-5 working days to complete the update.",
    timestamp: "10:42 AM",
    type: "text",
  },
  {
    id: "m10",
    senderId: "c1",
    content: "Great! Is there anything else I need to do?",
    timestamp: "10:43 AM",
    type: "text",
  },
  {
    id: "m11",
    senderId: "agent",
    content:
      "No, that's all we need for now. I'll keep you updated on the progress. If you have any questions in the meantime, feel free to ask!",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "m12",
    senderId: "c1",
    content: "Thank you! I appreciate your help.",
    timestamp: "10:46 AM",
    type: "text",
  },
];

// function ConversationList({
//   conversations,
//   activeConversation,
//   setActiveConversation,
//   searchQuery,
// }) {
//   const { orderId } = useParams();
//   const [agentId, setAgentId] = useState(null);
//   const [order, setOrder] = useState([]);
//   const [agent, setAgent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [file, setFile] = useState(null);
//   //const [message, setMessage] = useState([]);
//   const [typing, setTyping] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [showVideoCall, setShowVideoCall] = useState(false);
//   const [localChatHistory, setLocalChatHistory] = useState([]);
//   const messagesEndRef = useRef(null);

//   const { user } = useAuthStore();
//   // const { addNotification } = useNotification();
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // setLoading(true);
//         // const resAgent = await axios.get(
//         //   `http://localhost:5001/api/user/orderdata/${orderId}`
//         // );
//         // console.log("resagent ", resAgent.data.orders);
//         // const fetch = resAgent.data.orders.agentId;
//         // const customer = resAgent.data.orders.customer;
//         // setOrder(resAgent.data.orders);
//         // setAgentId(fetch);

//         // console.log("ordeadfadrrr", user._id);
//         // const newSocket = io("http://localhost:7000");
//         // console.log("socket", newSocket);
//         // setSocket(newSocket);
//         if (user && fetch) {
//           newSocket.emit("join", { userId: customer, agentId: fetch });
//         }

//         newSocket.on("chatHistory", (messages) => {
//           setChatHistory(messages.map((msg) => ({ ...msg, text: msg.text })));
//         });
//         // newSocket.on("chatHistory", (messages) => {
//         //   setChatHistory(messages.map((msg) => ({ ...msg, text: msg.text })));
//         // });

//         newSocket.on("userTyping", () => setIsTyping(true));
//         newSocket.on("userStoppedTyping", () => setIsTyping(false));
//         // newSocket.on("user_typing", ({ senderId }) => {
//         //   if (senderId === fetch) setTyping(true);
//         // });

//         // newSocket.on("user_stopped_typing", ({ senderId }) => {
//         //   if (senderId === fetch) setTyping(false);
//         // });

//         return () => {
//           newSocket.disconnect();
//         };
//       } catch (error) {
//         console.error("Error fetching chat data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orderId, user]);

//   console.log("chat history", chatHistory);

//   // const sendMessage = (e) => {
//   //   e.preventDefault();
//   //   if (!message.trim()) return;

//   //   const messageData = {
//   //     senderId: user._id,
//   //     receiverId: agentId,
//   //     text: message,
//   //     createdAt: new Date().toISOString(),
//   //   };

//   //   setChatHistory((prev) => [...prev, { ...messageData, text: message }]);
//   //   socket.emit("sendMessage", messageData);
//   //   setMessage("");
//   // };

//   // useEffect(() => {
//   //   if (messagesEndRef.current) {
//   //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   //   }
//   // }, [chatHistory]);

//   // const filteredConversations = conversations.filter(
//   //   (convo) =>
//   //     convo.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     convo.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     convo.service.toLowerCase().includes(searchQuery.toLowerCase()),
//   // )

//   return (
//     <div className="border-r-2 ">
//       {/* <div className="p-4">
//         <div className="relative">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search conversations..."
//             className="pl-8"
//             value={searchQuery}
//             onChange={(e) => searchQuery(e.target.value)}
//           />
//         </div>
//       </div> */}
//       {/* <ScrollArea className="h-[calc(100vh-12rem)] ">
//         <div className="px-3">
//           {filteredConversations.map((convo) => (
//             <div
//               key={convo.id}
//               className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-muted ${
//                 activeConversation?.id === convo.id ? "bg-muted" : ""
//               }`}
//               onClick={() => setActiveConversation(convo)}
//             >
//               <div className="relative">
//                 <Avatar>
//                   <AvatarImage src={convo.customer.image} alt={convo.customer.name} />
//                   <AvatarFallback>{convo.customer.name.charAt(0)}</AvatarFallback>
//                 </Avatar>
//                 {convo.online && (
//                   <span className="absolute right-0 top-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium">{convo.customer.name}</span>
//                   <span className="text-xs text-muted-foreground">{convo.timestamp}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="truncate text-sm text-muted-foreground">{convo.lastMessage}</div>
//                   {convo.unread > 0 && (
//                     <Badge variant="default" className="ml-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
//                       {convo.unread}
//                     </Badge>
//                   )}
//                 </div>
//                 <div className="mt-1 flex items-center gap-1">
//                   <Badge variant="outline" className="text-[10px] h-5 ">
//                     {convo.orderId}
//                   </Badge>
//                   <Badge variant="outline" className="text-[10px] h-5 rounded-sm">
//                     {convo.service}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </ScrollArea> */}
//     </div>
//   );
// }

function ChatHeader({ conversation, setVideoCallOpen }) {
  const { orderId } = useParams();
  return (
    <div className=" flex items-center justify-between border-b-2  border-r-2 p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={conversation?.customer?.image}
              alt={conversation?.customer?.name}
            />
            <AvatarFallback>
              {conversation?.customer?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {conversation?.online && (
            <span className="absolute right-0 top-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>
        <div>
          <div className="font-medium leading-tight">
            {conversation?.customer?.name}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {conversation?.online ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span>Offline</span>
            )}

            <span>•</span>
            <span>{conversation?.service}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to={`/communication/room/${orderId}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVideoCallOpen(true)}
          >
            <Video className="h-4 w-4" />
            <span className="sr-only">Video Call</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function MessageBubble({ message, customer }) {
  const isAgent = message.senderId === "agent";
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] flex-col ${
          isAgent ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isAgent ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm">{message.text}</div>
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <span>{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ChatMessages({ messages, customer }) {
  console.log("chat data", messages);
  return (
    <ScrollArea className="h-[calc(100vh-18rem)] border-r-2 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message} message={message} customer={customer} />
        ))}
      </div>
    </ScrollArea>
  );
}

function ChatInput() {
  const [message, setMessage] = useState("");

  return (
    <div className="border-t-2 border-b-2 border-r-2 p-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="shrink-0">
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Textarea
          placeholder="Type your message..."
          className="min-h-10 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button size="icon" className="shrink-0" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}

function NoConversationSelected() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-xl font-medium">Your Conversations</h3>
      <p className="text-center text-muted-foreground">
        Select a conversation from the list to start chatting.
      </p>
    </div>
  );
}

function VideoCallDialog({ open, onOpenChange, conversation }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Video Call</DialogTitle>
          <DialogDescription>
            Start a video call with {conversation?.customer?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={conversation?.customer?.image}
                alt={conversation?.customer?.name}
              />
              <AvatarFallback>
                {conversation?.customer?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{conversation?.customer?.name}</div>
              <div className="text-sm text-muted-foreground">
                {conversation?.orderId} • {conversation?.service}
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-muted p-4 text-center">
            <Video className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-1 font-medium">Ready to start video call?</p>
            <p className="text-sm text-muted-foreground">
              Connect face-to-face to discuss service details and requirements.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            <span>Start Call</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function Communication() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const { orderId } = useParams();
  const [agentId, setAgentId] = useState(null);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();
  const socketRef = useRef(null);
  const [customer, setCustomer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch order data
        const resAgent = await axios.get(
          `http://localhost:5001/api/user/orderdata/${orderId}`
        );

        const fetch = resAgent.data.orders.agentId;
        const customer = resAgent.data.orders.customer;
        setCustomer(customer);
        setOrder(resAgent.data.orders);
        setAgentId(fetch);

        // Initialize socket connection if not already initialized
        if (!socketRef.current) {
          const newSocket = io("http://localhost:7000");
          socketRef.current = newSocket;

          // Join the chat room
          if (user && fetch) {
            newSocket.emit("join", { userId: customer, agentId: fetch });
          }

          // Listen for chat history
          newSocket.on("chatHistory", (messages) => {
            setChatHistory(messages.map((msg) => ({ ...msg, text: msg.text })));
          });

          // Listen for new messages
          newSocket.on("receiveMessage", (message) => {
            setChatHistory((prev) => [...prev, message]);
          });

          // Listen for typing events
          newSocket.on("userTyping", () => setIsTyping(true));
          newSocket.on("userStoppedTyping", () => setIsTyping(false));
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to remove event listeners and disconnect socket
    return () => {
      if (socketRef.current) {
        socketRef.current.off("chatHistory");
        socketRef.current.off("receiveMessage");
        socketRef.current.off("userTyping");
        socketRef.current.off("userStoppedTyping");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Use stable dependencies // Dependencies to ensure this runs only when `orderId` or `user` changes// Add dependencies to ensure this runs only when `orderId` or `user` changes

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const messageData = {
      senderId: agentId,
      receiverId: customer,
      text: message,
      createdAt: new Date().toISOString(),
    };

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", messageData);
    } else {
      console.error("Socket connection is not established.");
    }

    setMessage("");
  };


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "Invalid Date";
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col border-l-2">
      <div className="grid flex-1 grid-cols-1">
        <div className="flex h-full flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-t-2 border-r-2 border-b-2 px-2">
              <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </TabsList>
            </div>

            <TabsContent value="messages" className="flex h-full flex-col">
              {order ? (
                <>
                  <div className="flex items-center justify-between border-b-2 border-r-2 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={order?.customer?.image}
                            alt={order?.customer?.name}
                          />
                          <AvatarFallback>
                            {order?.customer?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {order?.online && (
                          <span className="absolute right-0 top-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium leading-tight">
                          {order?.customer?.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                     
                          <span>{order?.service}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/communication/room/${orderId}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setVideoCallOpen(true)}
                        >
                          <Video className="h-4 w-4" />
                          <span className="sr-only">Video Call</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <ScrollArea className="h-[calc(100vh-18rem)] border-r-2 p-4">
                    <div className="space-y-4">
                      {chatHistory.map((message, index) => {
                        const isAgent = message.senderId === agentId;
                        return (
                          <div
                            key={
                              message._id || message.id || `message-${index}`
                            } // Ensure a unique key
                            className={`flex ${
                              isAgent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex max-w-[80%] flex-col ${
                                isAgent ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  isAgent
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <div className="whitespace-pre-wrap text-sm">
                                  {message.text}
                                </div>
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{formatTime(message.createdAt)}</span>
                              </div>
                            </div>
                            {isTyping && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                The agent is typing...
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="border-t-2 border-b-2 border-r-2 p-2 flex gap-4">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <a
                        href="https://fileqrkaro.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Attach file</span>
                      </a>
                    </Button>
                    <form
                      onSubmit={sendMessage}
                      className="flex items-center gap-2 w-full"
                    >
                      <Textarea
                        type="text"
                        placeholder="Type your message..."
                        className="min-h-10 resize-none"
                        value={message}
                        // onKeyDown={handleTyping}
                        // onKeyUp={handleStopTyping}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button size="icon" className="shrink-0" type="submit">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-4">
                  <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-medium">
                    Your Conversations
                  </h3>
                  <p className="text-center text-muted-foreground">
                    Select a conversation from the list to start chatting.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <VideoCallDialog
        open={videoCallOpen}
        onOpenChange={setVideoCallOpen}
        conversation={order}
      />
    </div>
  );
}

export default Communication;
