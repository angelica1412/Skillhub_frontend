import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ParticipantManager from "../components/ParticipantManager";
import ParticipantService from "../services/ParticipantService";

jest.mock("../services/ParticipantService");

describe("ParticipantManager Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // default mock API response
    ParticipantService.getAllParticipants.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Alice",
          email: "alice@example.com",
          phone_number: "0812345678",
        },
      ],
    });

    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
  });

  test("loads participant list", async () => {
    await act(async () => {
      render(<ParticipantManager />);
    });

    const nameElement = await screen.findByText("Alice");
    expect(nameElement).toBeInTheDocument();
    expect(ParticipantService.getAllParticipants).toHaveBeenCalledTimes(1);
  });

  test("adds a new participant", async () => {
    ParticipantService.createParticipant.mockResolvedValue({ data: {} });

    await act(async () => {
      render(<ParticipantManager />);
    });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "0822334455" },
    });

    fireEvent.click(screen.getByText("Add Participant"));

    await waitFor(() => {
      expect(ParticipantService.createParticipant).toHaveBeenCalledTimes(1);
    });
  });

  test("edits a participant", async () => {
    ParticipantService.updateParticipant.mockResolvedValue({ data: {} });

    await act(async () => {
      render(<ParticipantManager />);
    });

    // Click Edit
    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Alice Updated" },
    });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(ParticipantService.updateParticipant).toHaveBeenCalledTimes(1);
    });
  });

  test("deletes a participant", async () => {
    ParticipantService.deleteParticipant.mockResolvedValue({ data: {} });

    await act(async () => {
      render(<ParticipantManager />);
    });

    await screen.findByText("Alice");

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(ParticipantService.deleteParticipant).toHaveBeenCalledWith(1);
    });
  });
});
