export class SpaceVisualization {
  constructor(container, options = {}) {
    this.viz = new Spacekit.Simulation(container, {
      basePath: options.basePath || "/assets",
      unitsPerAu: 1,
      camera: {
        initialPosition: [0, -10, 5],
      },
      debug: {
        showAxes: false,
        showGrid: false,
      },
    });

    this.closestObjs = [];
    this.brightestObjs = [];
    this.hotestObjs = [];
    this.biggestObjs = [];

    this.createdStar = [];

    this.shownCategories = [
      "closestObjs",
      "brightestObjs",
      "hotestObjs",
      "biggestObjs",
    ];

    this.categoryMap = {
      closest: "closestObjs",
      brightest: "brightestObjs",
      hotest: "hotestObjs",
      biggest: "biggestObjs",
    };

    this.earthRadius = 0.01;
    this.planetRadii = {
      mercury: 2439.7,
      venus: 6051.8,
      earth: 6371,
      mars: 3389.5,
      jupiter: 69911,
      saturn: 58232,
      uranus: 25362,
      neptune: 24622,
    };

    this.showLabels = true;

    this.initializeSolarSystem();
  }

  scaleRadius(planet) {
    return (
      (this.planetRadii[planet] / this.planetRadii.earth) * this.earthRadius
    );
  }

  initializeSolarSystem() {
    this.createSun();
    this.createPlanets();
    this.createEarth();
  }

  createSun() {
    this.viz.createObject(
      "sun",
      Object.assign(Spacekit.SpaceObjectPresets.SUN, {
        textureUrl: "./assets/sprites/sun.png",
      })
    );
    this.viz.createAmbientLight();
    this.viz.createLight([0, 0, 0]);
  }

  createPlanets() {
    const planets = [
      { name: "mercury", texture: "mercury.jpg" },
      { name: "venus", texture: "venus.jpg" },
      { name: "mars", texture: "mars.jpg" },
      { name: "uranus", texture: "uranus.jpg" },
      { name: "neptune", texture: "neptune.jpg" },
      { name: "jupiter", texture: "jupiter.jpg" },
      { name: "saturn", texture: "saturn.png" },
    ];

    planets.forEach(({ name, texture }) => {
      this.viz.createSphere(
        name,
        Object.assign(Spacekit.SpaceObjectPresets[name.toUpperCase()], {
          radius: this.scaleRadius(name),
          textureUrl: `./assets/sprites/${texture}`,
        })
      );
    });
  }

  createEarth() {
    const earth = this.viz.createSphere("earth", {
      textureUrl: "./assets/sprites/earth.jpg",
      radius: this.earthRadius,
      ephem: Spacekit.EphemPresets.EARTH,
      rotation: {
        enable: true,
        speed: 100,
      },
      debug: {
        showAxes: false,
      },
    });

    this.viz.getViewer().followObject(earth, [100, 100, 100]);
    return earth;
  }

  createStarObject(row, index, category) {
    const x = parseFloat(row.x) * 10;
    const y = parseFloat(row.y) * 10;
    const z = parseFloat(row.z) * 10;

    let name = row.id;
    if (row.bf && row.bf.trim() !== "") {
      name += ` (${row.bf})`;
    }

    name = name.replace(/\s+/g, " ");

    const lum = parseFloat(row.lum) || 1;
    const normalizedLum = Math.min(1, lum / 1000);

    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      let createdObj = null;
      if (!this.createdStar.includes(name)) {
        createdObj = this.viz.createObject(`${category}-object-${index}`, {
          position: [x, y, z],
          scale: [normalizedLum * 50, normalizedLum * 50, normalizedLum * 50],
          labelText: name,
          textureUrl: "./assets/sprites/star.png",
        });
        this.createdStar.push(name);
        return createdObj;
      }
      return this.shownCategories
        .map((category) => this[category])
        .flat()
        .find((star) => star._options.labelText === name);
    }
    return null;
  }

  processStarData(data) {
    const filteredData = data.filter((row) => parseFloat(row.dist) !== 0);

    // Closest 50 stars
    const closestData = [...filteredData]
      .sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist))
      .slice(0, 50);

    this.closestObjs = closestData
      .map((row, index) => this.createStarObject(row, index, "closest"))
      .filter(Boolean);

    // Brightest 50 stars
    const brightestData = [...filteredData]
      .sort((a, b) => parseFloat(a.absmag) - parseFloat(b.absmag))
      .slice(0, 50);

    this.brightestObjs = brightestData
      .map((row, index) => this.createStarObject(row, index, "brightest"))
      .filter(Boolean);

    // Hotest 50 stars
    const spectralOrder = ["O", "B", "A", "F", "G", "K", "M"];
    const hotestData = [...filteredData]
      .filter((row) => spectralOrder.includes(row.spect?.charAt(0)))
      .sort(
        (a, b) =>
          spectralOrder.indexOf(a.spect?.charAt(0)) -
          spectralOrder.indexOf(b.spect?.charAt(0))
      )
      .slice(0, 50);

    this.hotestObjs = hotestData
      .map((row, index) => this.createStarObject(row, index, "hotest"))
      .filter(Boolean);

    // Biggest 50 stars
    const biggestData = [...filteredData]
      .sort((a, b) => parseFloat(b.lum) - parseFloat(a.lum))
      .slice(0, 50);

    this.biggestObjs = biggestData
      .map((row, index) => {
        const test = this.createStarObject(row, index, "biggest", true);
        return test;
      })
      .filter(Boolean);
  }

  toggleLabels() {
    this.showLabels = !this.showLabels;

    this.shownCategories.forEach((category) => {
      this[category].forEach((obj) => {
        obj.setLabelVisibility(this.showLabels);
      });
    });
  }

  toggleStarCategory(category, show) {
    const objs = this[this.categoryMap[category]];
    if (!show) {
      objs.forEach((obj) => {
        this.createdStar = this.removeOneOccurrence(
          this.createdStar,
          obj._options.labelText
        );
        if (!this.createdStar.includes(obj._options.labelText)) {
          this.viz.removeObject(obj);
        }
      });
      this.shownCategories = this.shownCategories.filter(
        (shown) => shown !== this.categoryMap[category]
      );
    } else {
      const newObjs = objs.map((obj) => {
        if (!this.createdStar.includes(obj._options.labelText)) {
          const newStar = this.viz.createObject(obj._id, obj._options);
          newStar.setLabelVisibility(this.showLabels);
          this.createdStar.push(obj._options.labelText);
          return newStar;
        }
        return this.shownCategories
          .map((category) => this[category])
          .flat()
          .find((star) => star._options.labelText === bj._options.labelText);
      });
      this.shownCategories.push(this.categoryMap[category]);
      this[this.categoryMap[category]] = newObjs;
      return newObjs;
    }
    return objs;
  }

  stop() {
    this.viz.stop();
  }

  start() {
    this.viz.start();
  }

  removeOneOccurrence(arr, str) {
    const index = arr.indexOf(str);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
}
