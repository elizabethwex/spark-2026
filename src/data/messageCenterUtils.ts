export type Message = {
  id: string;
  subject: string;
  hasAttachment: boolean;
  category: string;
  categoryColor: string;
  categoryTextColor: string;
  deliveryDate: string;
  isStarred: boolean;
  isBold: boolean;
  isRead: boolean;
  isArchived: boolean;
  body?: string;
  attachmentFileName?: string;
};

const MESSAGE_READ_STATUS_KEY = "messageCenter_readStatus";
const MESSAGE_ARCHIVE_STATUS_KEY = "messageCenter_archiveStatus";
const UNREAD_COUNT_KEY = "messageCenter_unreadCount";
export const UNREAD_COUNT_CHANGED_EVENT = "messageCenter_unreadCountChanged";

/**
 * Get the initial messages with read status and archive status from localStorage
 */
export const getInitialMessages = (initialMessages: Message[]): Message[] => {
  try {
    const readStatusPersisted = localStorage.getItem(MESSAGE_READ_STATUS_KEY);
    const archiveStatusPersisted = localStorage.getItem(MESSAGE_ARCHIVE_STATUS_KEY);
    
    const readStatusMap = readStatusPersisted ? JSON.parse(readStatusPersisted) : {};
    const archiveStatusMap = archiveStatusPersisted ? JSON.parse(archiveStatusPersisted) : {};
    
    return initialMessages.map((msg) => ({
      ...msg,
      isRead: readStatusMap[msg.id] ?? msg.isRead,
      isArchived: archiveStatusMap[msg.id] ?? (msg.isArchived ?? false),
    }));
  } catch (error) {
    console.error("Failed to load persisted message status:", error);
  }

  return initialMessages.map((msg) => ({
    ...msg,
    isArchived: msg.isArchived ?? false,
  }));
};

/**
 * Calculate unread count from messages array (excluding archived messages)
 */
export const calculateUnreadCount = (messages: Message[]): number => {
  return messages.filter((message) => !message.isRead && !message.isArchived).length;
};

/**
 * Save unread count to localStorage and dispatch event
 */
export const updateUnreadCount = (count: number): void => {
  try {
    localStorage.setItem(UNREAD_COUNT_KEY, count.toString());
    window.dispatchEvent(new CustomEvent(UNREAD_COUNT_CHANGED_EVENT, { detail: count }));
  } catch (error) {
    console.error("Failed to save unread count:", error);
  }
};

/**
 * Get unread count from localStorage
 */
export const getUnreadCount = (): number => {
  try {
    const stored = localStorage.getItem(UNREAD_COUNT_KEY);
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
  } catch (error) {
    console.error("Failed to get unread count:", error);
  }
  return 0;
};

/**
 * Save read status to localStorage
 */
export const saveReadStatus = (id: string, isRead: boolean): void => {
  try {
    const persisted = localStorage.getItem(MESSAGE_READ_STATUS_KEY);
    const readStatusMap = persisted ? JSON.parse(persisted) : {};
    readStatusMap[id] = isRead;
    localStorage.setItem(MESSAGE_READ_STATUS_KEY, JSON.stringify(readStatusMap));
  } catch (error) {
    console.error("Failed to save read status:", error);
  }
};

/**
 * Save archive status to localStorage
 */
export const saveArchiveStatus = (id: string, isArchived: boolean): void => {
  try {
    const persisted = localStorage.getItem(MESSAGE_ARCHIVE_STATUS_KEY);
    const archiveStatusMap = persisted ? JSON.parse(persisted) : {};
    archiveStatusMap[id] = isArchived;
    localStorage.setItem(MESSAGE_ARCHIVE_STATUS_KEY, JSON.stringify(archiveStatusMap));
  } catch (error) {
    console.error("Failed to save archive status:", error);
  }
};


