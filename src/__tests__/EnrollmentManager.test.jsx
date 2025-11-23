import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import EnrollmentManager from "../components/EnrollmentManager";

import EnrollmentService from "../services/EnrollmentService";
import ParticipantService from "../services/ParticipantService";
import ClassService from "../services/ClassService";

jest.mock("../services/EnrollmentService");
jest.mock("../services/ParticipantService");
jest.mock("../services/ClassService");

describe("EnrollmentManager Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Participants
    ParticipantService.getAllParticipants.mockResolvedValue({
      data: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });

    // Classes
    ClassService.getAllClasses.mockResolvedValue({
      data: [
        { id: 10, class_name: "Math" },
        { id: 20, class_name: "Science" },
      ],
    });

    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
  });

  test("loads participants and classes", async () => {
    await act(async () => {
      render(<EnrollmentManager />);
    });

    const participantOption = await screen.findByText("1. Alice");
    const classOption = await screen.findByText("10. Math");

    expect(participantOption).toBeInTheDocument();
    expect(classOption).toBeInTheDocument();
  });
  test("enrolls participant into class", async () => {
    EnrollmentService.enroll.mockResolvedValue({ data: {} });

    await act(async () => {
      render(<EnrollmentManager />);
    });

    const selects = screen.getAllByRole("combobox");
    const participantSelect = selects[0];
    const classSelect = selects[1];

    fireEvent.change(participantSelect, { target: { value: "1" } });
    fireEvent.change(classSelect, { target: { value: "10" } });

    fireEvent.click(screen.getByText("Enroll (Create)"));

    await waitFor(() => {
      expect(EnrollmentService.enroll).toHaveBeenCalledWith({
        ParticipantId: 1,
        ClassIds: [10],
      });
    });
  });

  test("reads classes by participant", async () => {
    EnrollmentService.getClassesByParticipant.mockResolvedValue({
      data: [
        {
          class_name: "Math",
          Enrollment: { enrollment_date: "2025-01-01" },
        },
      ],
    });

    await act(async () => {
      render(<EnrollmentManager />);
    });

    const selects = screen.getAllByRole("combobox");
    const participantSelect = selects[0];

    fireEvent.change(participantSelect, { target: { value: "1" } });

    fireEvent.click(screen.getByText("Show Classes"));

    expect(await screen.findByText("Math")).toBeInTheDocument();
  });
});
