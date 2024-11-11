<template>
  <svg id="map" :width="mapWidth" :height="mapHeight" class="map-container">
    <g class="panning-layer">
      <path
        v-for="county of counties"
        :d="pathGenerator(county)"
        fill="#c9f1ff"
        stroke="#84dbfa"
        stroke-width="0.5"
      />
      <path :d="routes" fill="none" stroke="black" stroke-width="2" />
      <circle
        v-for="location of locations"
        :key="location.name"
        :cx="project(location.coords).x"
        :cy="project(location.coords).y"
        @click.stop="
          zoomInLocation(
            location.name,
            project(location.coords).x,
            project(location.coords).y
          )
        "
        fill="#17a6ff"
        r="2"
        class="marker"
      />
    </g>
  </svg>
  <div class="panel">
    <p>Hover on: {{ nowClickOnLoc }}</p>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson-client";

export default {
  computed: {
    routes() {
      const points = this.locations.map((location) => {
        const { x, y } = this.project(location.coords);
        return `${x}, ${y}`;
      });
      return `M${points.join(" L")}`;
    },
  },
  data() {
    return {
      map: undefined,
      mapWidth: window.innerWidth,
      mapHeight: window.innerHeight,
      projection: undefined,
      counties: [],
      locations: [
        { name: "神戶三宮", coords: [135.1955, 34.6958] },
        { name: "京都", coords: [135.7585, 34.9858] },
        { name: "靜岡", coords: [138.38333, 34.98333] },
        { name: "日光", coords: [139.619, 36.7523] },
      ],
      nowClickOnLoc: "",
    };
  },
  created() {
    fetch("/japan.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.counties = topojson.feature(data, data.objects.japan).features;
        console.log(this.counties);
      });

    this.projection = d3
      .geoMercator()
      .center([137.0, 36.0])
      .scale(1500)
      .translate([this.mapWidth / 2, this.mapHeight / 2]);

    // Responsive width
    window.addEventListener("resize", () => {
      this.mapWidth = window.innerWidth;
      this.mapHeight = window.innerHeight;
    });
  },
  mounted() {
    this.map = d3.select("#map");
    this.map.call(this.configZoom);
  },
  methods: {
    pathGenerator(feature) {
      const path = d3.geoPath().projection(this.projection);
      return path(feature);
    },
    project(coords) {
      const position = {
        x: this.projection(coords)[0],
        y: this.projection(coords)[1],
      };
      return position;
    },
    zoomInLocation(name, x, y) {
      this.nowClickOnLoc = name;
      this.map
        .transition()
        .duration(750)
        .call(
          this.configZoom().transform,
          d3.zoomIdentity
            .translate(this.mapWidth / 2, this.mapHeight / 2)
            .scale(20)
            .translate(-x, -y)
        );
    },
    configZoom() {
      return d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent([
          [0, 0],
          [this.mapWidth, this.mapHeight],
        ])
        .on("zoom", this.zoomed);
    },
    zoomed(e) {
      const { transform } = e;
      d3.select(".panning-layer").attr("transform", transform);
    },
  },
};
</script>

<style lang="scss" scoped>
.marker {
  cursor: pointer;
}

.panel {
  position: fixed;
  right: 30px;
  top: 30px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.15);
  background-color: #fff;

  p {
    margin: 0;
  }
}
</style>
