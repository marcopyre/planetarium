import { SpaceVisualization } from "./SpaceVisualization.js";

document.addEventListener("DOMContentLoaded", () => {
  let spaceViz;

  const container = document.getElementById("main-container");
  if (!container) {
    console.error("Container not found");
    return;
  }

  spaceViz = new SpaceVisualization(container, {
    basePath: "/assets",
  });

  // Load star data
  d3.csv("/assets/hygdata_v3_trie.csv")
    .then((data) => {
      spaceViz.processStarData(data);
      initializeGUI();
    })
    .catch((error) => {
      console.error("Error loading star data:", error);
    });

  function initializeGUI() {
    const gui = new dat.GUI();

    const visualControls = gui.addFolder("Visual Controls");
    const starCategories = gui.addFolder("Star Categories");

    const animationControls = {
      running: true,
      toggleAnimation: function () {
        this.running ? spaceViz.stop() : spaceViz.start();
        this.running = !this.running;
      },
    };

    visualControls
      .add(animationControls, "toggleAnimation")
      .name("Toggle Animation");

    const labelControls = {
      showLabels: true,
      toggleLabels: function () {
        spaceViz.toggleLabels();
      },
    };

    visualControls.add(labelControls, "toggleLabels").name("Toggle Labels");

    const categoryControls = {
      closest: true,
      brightest: true,
      hotest: true,
      biggest: true,
    };

    Object.keys(categoryControls).forEach((category) => {
      starCategories.add(categoryControls, category).onChange((value) => {
        spaceViz.toggleStarCategory(category, value);
      });
    });

    visualControls.open();
    starCategories.open();
  }

  window.addEventListener("resize", () => {
    if (spaceViz && spaceViz.viz) {
      spaceViz.viz.resize();
    }
  });
});
