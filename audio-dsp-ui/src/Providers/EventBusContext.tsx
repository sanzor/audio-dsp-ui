// EventBusContext.tsx
import { EventBus } from '@/EventBus';
import React, { createContext, useContext } from 'react';// Import the singleton instance

const eventBusInstance = new EventBus();
// Define a type for the EventBus instance
type EventBusType = EventBus;

// Create the context with the EventBus instance type
const EventBusContext = createContext<EventBusType | undefined>(undefined);

export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EventBusContext.Provider value={eventBusInstance}>
      {children}
    </EventBusContext.Provider>
  );
};

// Custom hook to access EventBus
// eslint-disable-next-line react-refresh/only-export-components
export const useEventBus = (): EventBusType => {
  const context = useContext(EventBusContext);
  if (!context) {
    throw new Error("useEventBus must be used within an EventBusProvider");
  }
  return context;
};