"use client";

import { useEffect, useMemo, useState } from "react";

type Coordinate = [number, number];

type GeoGeometry = {
  type: string;
  coordinates: unknown;
};

type GeoFeature = {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry: GeoGeometry;
};

type GeoJSONData = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

type Point = {
  x: number;
  y: number;
};

const MAP_WIDTH = 820;
const MAP_HEIGHT = 610;
const MAP_PADDING = 42;

function getStateName(
  feature: GeoFeature,
  index: number
) {
  const properties = feature.properties || {};

  const candidates = [
    properties.ST_NM,
    properties.NAME_1,
    properties.NAME,
    properties.name,
    properties.state,
    properties.State,
    properties.st_nm,
    properties.STNAME,
  ];

  const found = candidates.find(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  );

  return typeof found === "string"
    ? found.trim()
    : `State ${index + 1}`;
}

function collectCoordinates(
  coordinates: unknown,
  result: Coordinate[] = []
) {
  if (
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    result.push([
      coordinates[0],
      coordinates[1],
    ]);

    return result;
  }

  if (Array.isArray(coordinates)) {
    coordinates.forEach((item) => {
      collectCoordinates(item, result);
    });
  }

  return result;
}

function createProjection(
  features: GeoFeature[]
) {
  const points: Coordinate[] = [];

  features.forEach((feature) => {
    collectCoordinates(
      feature.geometry.coordinates,
      points
    );
  });

  if (!points.length) {
    return () => ({
      x: MAP_WIDTH / 2,
      y: MAP_HEIGHT / 2,
    });
  }

  const lons = points.map((point) => point[0]);
  const lats = points.map((point) => point[1]);

  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const lonRange = maxLon - minLon || 1;
  const latRange = maxLat - minLat || 1;

  const availableWidth =
    MAP_WIDTH - MAP_PADDING * 2;

  const availableHeight =
    MAP_HEIGHT - MAP_PADDING * 2;

  const scale = Math.min(
    availableWidth / lonRange,
    availableHeight / latRange
  );

  const mapWidth = lonRange * scale;
  const mapHeight = latRange * scale;

  const offsetX =
    (MAP_WIDTH - mapWidth) / 2;

  const offsetY =
    (MAP_HEIGHT - mapHeight) / 2;

  return (
    coordinate: Coordinate
  ): Point => ({
    x:
      offsetX +
      (coordinate[0] - minLon) * scale,

    y:
      MAP_HEIGHT -
      offsetY -
      (coordinate[1] - minLat) * scale,
  });
}

function geometryToPath(
  geometry: GeoGeometry,
  project: (coordinate: Coordinate) => Point
) {
  const paths: string[] = [];

  const buildPolygon = (
    polygon: unknown
  ) => {
    if (!Array.isArray(polygon)) {
      return;
    }

    polygon.forEach((ring) => {
      if (!Array.isArray(ring)) {
        return;
      }

      const commands: string[] = [];

      ring.forEach(
        (coordinate, index) => {
          if (
            !Array.isArray(coordinate) ||
            coordinate.length < 2
          ) {
            return;
          }

          const point = project([
            Number(coordinate[0]),
            Number(coordinate[1]),
          ]);

          commands.push(
            `${index === 0 ? "M" : "L"} ${point.x.toFixed(
              2
            )} ${point.y.toFixed(2)}`
          );
        }
      );

      if (commands.length) {
        commands.push("Z");
        paths.push(commands.join(" "));
      }
    });
  };

  if (geometry.type === "Polygon") {
    buildPolygon(geometry.coordinates);
  }

  if (geometry.type === "MultiPolygon") {
    if (Array.isArray(geometry.coordinates)) {
      geometry.coordinates.forEach(
        (polygon) => {
          buildPolygon(polygon);
        }
      );
    }
  }

  return paths.join(" ");
}

export function WaterData() {
  const [mapData, setMapData] =
    useState<GeoJSONData | null>(null);

  const [selectedState, setSelectedState] =
    useState<string | null>(null);

  const [hoveredState, setHoveredState] =
    useState<string | null>(null);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    fetch("/images/india/india.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load India map"
          );
        }

        return response.json();
      })
      .then((data: GeoJSONData) => {
        setMapData(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  const project = useMemo(() => {
    if (!mapData) {
      return null;
    }

    return createProjection(
      mapData.features
    );
  }, [mapData]);

  const activeState =
    hoveredState || selectedState;

  return (
    <section
      id="water-data"
      className="water-data-section"
    >
      <div className="water-data-container">

        {/* HEADER */}

        <div className="water-data-header">

          <div>
            <p className="water-data-eyebrow">
              WATER DATA
            </p>

            <h2>
              The bigger picture.
            </h2>

            <p className="water-data-intro">
              Explore drinking-water access and
              service information across India.
            </p>
          </div>

          <div className="water-data-national">
            <span />
            INDIA
            <b>/</b>
            NATIONAL VIEW
          </div>

        </div>


        {/* MAP STAGE */}

        <div className="water-map-stage">

          <div className="map-stage-top">

            <div>
              <span className="map-kicker">
                NATIONAL VIEW
              </span>

              <h3>
                Drinking water across India
              </h3>
            </div>

            <p>
              Hover over a state
              <br />
              to explore.
            </p>

          </div>


          <div className="map-canvas">

            <div className="map-grid-line line-horizontal-one" />
            <div className="map-grid-line line-horizontal-two" />
            <div className="map-grid-line line-vertical-one" />
            <div className="map-grid-line line-vertical-two" />


            {/* Animated water paths */}

            <svg
              className="map-flow"
              viewBox="0 0 1000 700"
              aria-hidden="true"
            >
              <path
                className="flow-line flow-one"
                d="M80 520 C250 420 350 520 500 430 S760 300 930 390"
              />

              <path
                className="flow-line flow-two"
                d="M40 330 C210 260 330 330 470 280 S760 190 960 260"
              />

              <path
                className="flow-line flow-three"
                d="M130 620 C300 530 430 590 590 500 S820 420 940 470"
              />
            </svg>


            {!mapData && !error && (
              <div className="map-loading">
                <span className="loading-dot" />
                Loading map
              </div>
            )}

            {error && (
              <div className="map-loading">
                Unable to load map
              </div>
            )}


            {mapData && project && (
              <svg
                className="india-map-svg"
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                role="img"
                aria-label="Interactive map of India"
              >

                <defs>

                  <linearGradient
                    id="state-fill"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#e6f4f5"
                    />

                    <stop
                      offset="100%"
                      stopColor="#c9e8eb"
                    />
                  </linearGradient>

                  <filter
                    id="state-shadow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="5"
                      stdDeviation="5"
                      floodColor="#174c57"
                      floodOpacity="0.10"
                    />
                  </filter>

                </defs>


                <g filter="url(#state-shadow)">

                  {mapData.features.map(
                    (feature, index) => {
                      const name =
                        getStateName(
                          feature,
                          index
                        );

                      const path =
                        geometryToPath(
                          feature.geometry,
                          project
                        );

                      const isActive =
                        activeState === name;

                      const isSelected =
                        selectedState === name;

                      return (
                        <path
                          key={`${name}-${index}`}
                          d={path}
                          className={[
                            "india-state",
                            isActive
                              ? "state-active"
                              : "",
                            isSelected
                              ? "state-selected"
                              : "",
                          ].join(" ")}
                          onMouseEnter={() =>
                            setHoveredState(
                              name
                            )
                          }
                          onMouseLeave={() =>
                            setHoveredState(null)
                          }
                          onClick={() =>
                            setSelectedState(
                              name
                            )
                          }
                          onFocus={() =>
                            setHoveredState(
                              name
                            )
                          }
                          onBlur={() =>
                            setHoveredState(null)
                          }
                          tabIndex={0}
                          role="button"
                          aria-label={`Explore ${name}`}
                          onKeyDown={(event) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key === " "
                            ) {
                              setSelectedState(
                                name
                              );
                            }
                          }}
                        />
                      );
                    }
                  )}

                </g>

              </svg>
            )}


            {/* Floating state information */}

            {activeState && (
              <div className="state-tooltip">

                <div className="tooltip-top">
                  <span>
                    STATE
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedState(
                        activeState
                      );
                      setHoveredState(null);
                    }}
                    aria-label={`Select ${activeState}`}
                  >
                    +
                  </button>
                </div>

                <strong>
                  {activeState}
                </strong>

                <div className="tooltip-divider" />

                <div className="tooltip-data">

                  <div>
                    <span>
                      HOUSEHOLDS
                    </span>
                    <b>—</b>
                  </div>

                  <div>
                    <span>
                      COVERAGE
                    </span>
                    <b>—</b>
                  </div>

                </div>

                <p>
                  Select to explore state data.
                </p>

              </div>
            )}

          </div>


          {/* MAP FOOTER */}

          <div className="map-stage-footer">

            <div className="map-legend">

              <span>
                <i className="legend-normal" />
                State boundary
              </span>

              <span>
                <i className="legend-active" />
                Selected state
              </span>

            </div>

            <span className="map-source">
              JJM DATA VIEW
            </span>

          </div>

        </div>


        {/* NATIONAL INDICATORS */}

        <div className="national-data">

          <div className="national-data-heading">
            <div>
              <p>
                NATIONAL INDICATORS
              </p>

              <h3>
                A clearer view of progress
              </h3>
            </div>

            <span>
              Live values will appear
              when connected to JJM data.
            </span>
          </div>


          <div className="national-indicator-grid">

            <Indicator
              label="Households"
              description="Rural households with tap water"
            />

            <Indicator
              label="Tap connections"
              description="Household tap water connections"
            />

            <Indicator
              label="Villages"
              description="Villages covered by the mission"
            />

            <Indicator
              label="Water quality"
              description="Quality testing and monitoring"
            />

          </div>

        </div>


        {/* SELECTED STATE */}

        {selectedState && (
          <div className="selected-state-section">

            <div>
              <span>
                SELECTED STATE
              </span>

              <h3>
                {selectedState}
              </h3>

              <p>
                State-specific information will
                appear here when the live data
                source is connected.
              </p>
            </div>

            <div className="selected-state-values">

              <div>
                <span>
                  HOUSEHOLDS
                </span>
                <strong>—</strong>
              </div>

              <div>
                <span>
                  CONNECTIONS
                </span>
                <strong>—</strong>
              </div>

              <div>
                <span>
                  COVERAGE
                </span>
                <strong>—</strong>
              </div>

            </div>

            <button type="button">
              Explore state data
              <span>→</span>
            </button>

          </div>
        )}

      </div>
    </section>
  );
}


/* =========================================================
   INDICATOR
   ========================================================= */

function Indicator({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="national-indicator">

      <span>
        {label}
      </span>

      <strong>
        —
      </strong>

      <p>
        {description}
      </p>

    </div>
  );
}