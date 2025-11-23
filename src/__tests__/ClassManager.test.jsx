import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ClassManager from "../components/ClassManager"; // <-- pastikan path benar!
import ClassService from "../services/ClassService";

jest.mock("../services/ClassService");

describe("ClassManager Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ClassService.getAllClasses.mockResolvedValue({
      data: [
        {
          id: 1,
          class_name: "Math",
          description: "Basic Mathematics",
          instructor: "John Doe",
        },
      ],
    });

    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
  });

  test("loads class list without act warning", async () => {
    await act(async () => {
      render(<ClassManager />);
    });

    const row = await screen.findByText("Math");
    expect(row).toBeInTheDocument();

    expect(ClassService.getAllClasses).toHaveBeenCalledTimes(1);
  });

  test("creates new class", async () => {
    ClassService.createClass.mockResolvedValue({ data: {} });

    await act(async () => {
      render(<ClassManager />);
    });

    fireEvent.change(screen.getByPlaceholderText("Class Name"), {
      target: { value: "Physics" },
    });

    fireEvent.change(screen.getByPlaceholderText("Instructor"), {
      target: { value: "Einstein" },
    });

    fireEvent.change(screen.getByPlaceholderText("Short Description"), {
      target: { value: "Science" },
    });

    fireEvent.click(screen.getByText("Add Class"));

    await waitFor(() => {
      expect(ClassService.createClass).toHaveBeenCalledTimes(1);
    });
  });
});
