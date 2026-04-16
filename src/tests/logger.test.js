describe("logger", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    jest.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  test("logs error outside test env", () => {
    process.env.NODE_ENV = "development";

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { logger } = require("../utils/logger");

    logger.error("error");

    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test("does NOT log in test env", () => {
    process.env.NODE_ENV = "test";

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { logger } = require("../utils/logger");

    logger.error("error");

    expect(consoleSpy).not.toHaveBeenCalled();
  });
  test("logger works in development", () => {
    process.env.NODE_ENV = "development";

    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { logger } = require("../utils/logger");

    logger.error("test");

    expect(spy).toHaveBeenCalled();
  });
});