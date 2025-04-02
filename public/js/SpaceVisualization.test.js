const mockCreateObject = jest.fn();
const mockCreateSphere = jest.fn();
const mockCreateAmbientLight = jest.fn();
const mockCreateLight = jest.fn();
const mockFollowObject = jest.fn();
const mockGetViewer = jest.fn(() => ({
  followObject: mockFollowObject,
}));
const mockStop = jest.fn();
const mockStart = jest.fn();
const mockRemoveObject = jest.fn();
const mockSetLabelVisibility = jest.fn();

describe("SpaceVisualization", () => {
  let SpaceVisualization;
  let spaceViz;
  let container;

  beforeAll(() => {
    global.Spacekit = {
      Simulation: jest.fn().mockImplementation(() => ({
        createObject: mockCreateObject,
        createSphere: mockCreateSphere,
        createAmbientLight: mockCreateAmbientLight,
        createLight: mockCreateLight,
        getViewer: mockGetViewer,
        stop: mockStop,
        start: mockStart,
        removeObject: mockRemoveObject,
      })),
      SpaceObjectPresets: {
        SUN: {},
        MERCURY: {},
        VENUS: {},
        MARS: {},
        URANUS: {},
        NEPTUNE: {},
        JUPITER: {},
        SATURN: {},
      },
      EphemPresets: {
        EARTH: {},
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement("div");
    jest.isolateModules(() => {
      ({ SpaceVisualization } = require("./SpaceVisualization.js"));
    });
    spaceViz = new SpaceVisualization(container);
  });

  describe("initialization", () => {
    test("should create simulation with correct parameters", () => {
      expect(Spacekit.Simulation).toHaveBeenCalledWith(
        container,
        expect.objectContaining({
          basePath: "/assets",
        })
      );
    });
  });

  describe("scaleRadius", () => {
    test("should correctly scale planet radius relative to Earth", () => {
      const mercuryRadius = spaceViz.scaleRadius("mercury");
      const expectedRadius = (2439.7 / 6371) * 0.01;
      expect(mercuryRadius).toBeCloseTo(expectedRadius);
    });
  });

  describe("createSun", () => {
    test("should create sun object with correct parameters", () => {
      spaceViz.createSun();
      expect(mockCreateObject).toHaveBeenCalledWith(
        "sun",
        expect.objectContaining({
          textureUrl: "./assets/sprites/sun.png",
        })
      );
      expect(mockCreateAmbientLight).toHaveBeenCalled();
      expect(mockCreateLight).toHaveBeenCalledWith([0, 0, 0]);
    });
  });

  describe("toggleLabels", () => {
    test("should toggle visibility of all star labels", () => {
      spaceViz.closestObjs = [{ setLabelVisibility: mockSetLabelVisibility }];
      spaceViz.brightestObjs = [{ setLabelVisibility: mockSetLabelVisibility }];

      spaceViz.toggleLabels();
      expect(mockSetLabelVisibility).toHaveBeenCalledWith(false);

      spaceViz.toggleLabels();
      expect(mockSetLabelVisibility).toHaveBeenCalledWith(true);
    });
  });

  describe("simulation control", () => {
    test("should stop simulation", () => {
      spaceViz.stop();
      expect(mockStop).toHaveBeenCalled();
    });

    test("should start simulation", () => {
      spaceViz.start();
      expect(mockStart).toHaveBeenCalled();
    });
  });
});
