import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getAppointments = createServerFn().handler(async () => {
  try {
    const response = await fetch("https://api.example.com/appointments");
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: "Failed to fetch appointments" };
  }
});

export const addAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; email: string; date: string; time: string }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await fetch("https://api.example.com/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: "Failed to create appointment" };
    }
  });
