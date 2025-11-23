export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|scss|sass|less)$": "identity-obj-proxy",
      "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/__tests__/fileMock.js"
    }
  };
  