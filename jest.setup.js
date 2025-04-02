global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};

// Mock pour dat.GUI
global.dat = {
  GUI: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockReturnThis(),
    onChange: jest.fn(),
  })),
};
