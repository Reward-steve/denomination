import { fetcher } from "../../../services";
import { apiRequest } from "../../../services/apiResquest";
import type { Event } from "../types";

// Create a new event
export const createEvent = async (event: Event) => {
  return apiRequest("events/create", "POST", event);
};

// Fetch a single event by ID
export const fetchEvent = async (eventId: number) => {
  return apiRequest(`events/${eventId}/fetch`, "GET", { id: eventId });
};
// Fetch a single event by ID
export const fetchEventAttendance = async (eventId: number) => {
  return apiRequest(`events/${eventId}/attendance/fetch`, "GET", { id: eventId });
};

// Update an existing event by ID
export const updateEvent = async (eventId: number, event: Event) => {
  // Use template literals correctly
  return apiRequest(`events/${eventId}/update`, "PUT", event);
};

// Delete an event by ID
export const deleteEvent = async (eventId: number) => {
  return apiRequest(`events/${eventId}/del`, "DELETE");
};

// Fetch all events
// Correct async function with return type
export const fetchAllEvents = async (): Promise<{
  success: boolean;
  message: string;
  data: Event[];
}> => {
  return fetcher("events/fetch");
};
