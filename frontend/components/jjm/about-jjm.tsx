"use client";

import { useState } from "react";

const missionPoints = [
  {
    number: "01",
    title: "Household tap water",
    text: "Access to reliable drinking water through household tap connections.",
  },
  {
    number: "02",
    title: "Water quality",
    text: "Monitoring and surveillance to support safe drinking water.",
  },
  {
    number: "03",
    title: "Source sustainability",
    text: "Long-term planning for reliable and sustainable water sources.",
  },
  {
    number: "04",
    title: "Community participation",
    text: "Local communities have an important role in planning, managing and maintaining water services.",
  },
];

const journey = [
  {
    year: "2019",
    title: "Mission begins",
    text: "Jal Jeevan Mission begins with a focus on providing functional household tap connections in rural India.",
  },
  {
    year: "2020",
    title: "Village-led planning",
    text: "Village-level planning and community participation become central to implementation.",
  },
  {
    year: "2022",
    title: "Quality & sustainability",
    text: "Greater emphasis on water quality, source sustainability and long-term service delivery.",
  },
  {
    year: "TODAY",
    title: "A continuing mission",
    text: "The Mission continues to work towards reliable drinking-water services for rural households.",
  },
];

export function AboutJJM() {
  const [activePoint, setActivePoint] =
    useState(0);

  return (
    <section
      id="about-jjm"
      className="about-jjm-section"
    >
      <div className="about-jjm-container">

        {/* =================================================
            INTRO
            ================================================= */}

        <header className="about-jjm-header">

          <div className="about-jjm-heading">

            <p className="about-jjm-eyebrow">
              ABOUT JAL JEEVAN MISSION
            </p>

            <h2>
              Water at the
              <br />
              doorstep.
            </h2>

          </div>

          <div className="about-jjm-lead">

            <p>
              Jal Jeevan Mission is a national
              programme focused on improving
              drinking-water access for rural
              households through household tap
              connections and sustainable water
              services.
            </p>

            <div className="about-jjm-official-mark">
              <span />
              GOVERNMENT OF INDIA
            </div>

          </div>

        </header>


        {/* =================================================
            MISSION INTRODUCTION
            ================================================= */}

        <div className="about-jjm-introduction">

          <div className="intro-label">
            <span>
              THE MISSION
            </span>

            <strong>
              01
            </strong>
          </div>

          <div className="intro-content">

            <h3>
              A public mission built
              around everyday access.
            </h3>

            <p>
              The Jal Jeevan Mission focuses
              on improving access to drinking
              water in rural India. Its approach
              brings together infrastructure,
              water quality, sustainability and
              community participation.
            </p>

          </div>

          <div className="intro-side">

            <span>
              JJM
            </span>

            <p>
              Rural drinking-water
              service delivery
            </p>

          </div>

        </div>


        {/* =================================================
            MISSION AREAS
            ================================================= */}

        <div className="about-jjm-areas">

          <div className="areas-heading">

            <p>
              WHAT JJM WORKS TOWARDS
            </p>

            <h3>
              More than a connection.
            </h3>

          </div>


          <div className="areas-layout">

            <div className="areas-selector">

              {missionPoints.map(
                (point, index) => (
                  <button
                    key={point.number}
                    type="button"
                    className={
                      activePoint === index
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActivePoint(index)
                    }
                  >

                    <span>
                      {point.number}
                    </span>

                    <strong>
                      {point.title}
                    </strong>

                    <i>
                      →
                    </i>

                  </button>
                )
              )}

            </div>


            <div className="area-detail">

              <span className="area-detail-number">
                {missionPoints[
                  activePoint
                ].number}
              </span>

              <h4>
                {
                  missionPoints[
                    activePoint
                  ].title
                }
              </h4>

              <p>
                {
                  missionPoints[
                    activePoint
                  ].text
                }
              </p>

              <div className="area-detail-line" />

              <span className="area-detail-note">
                JAL JEEVAN MISSION
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            JOURNEY
            ================================================= */}

        <div className="about-jjm-journey">

          <div className="journey-heading">

            <div>
              <p>
                THE JOURNEY
              </p>

              <h3>
                A mission in progress.
              </h3>
            </div>

            <span>
              2019 — PRESENT
            </span>

          </div>


          <div className="journey-line">

            {journey.map(
              (item, index) => (
                <div
                  className="journey-item"
                  key={item.year}
                >

                  <div className="journey-marker">
                    <span />
                  </div>

                  <span className="journey-year">
                    {item.year}
                  </span>

                  <h4>
                    {item.title}
                  </h4>

                  <p>
                    {item.text}
                  </p>

                </div>
              )
            )}

          </div>

        </div>


        {/* =================================================
            HOW IT WORKS
            ================================================= */}

        <div className="about-jjm-system">

          <div className="system-heading">

            <p>
              HOW THE MISSION WORKS
            </p>

            <h3>
              From planning to service.
            </h3>

          </div>


          <div className="system-flow">

            <FlowItem
              number="01"
              title="Plan"
              text="Village-level planning identifies local water needs."
            />

            <span className="flow-arrow">
              →
            </span>

            <FlowItem
              number="02"
              title="Build"
              text="Water infrastructure is developed to serve households."
            />

            <span className="flow-arrow">
              →
            </span>

            <FlowItem
              number="03"
              title="Test"
              text="Water quality and service conditions are monitored."
            />

            <span className="flow-arrow">
              →
            </span>

            <FlowItem
              number="04"
              title="Sustain"
              text="Local participation supports long-term service delivery."
            />

          </div>

        </div>


        {/* =================================================
            CLOSING
            ================================================= */}

        <div className="about-jjm-closing">

          <div>
            <span>
              JAL JEEVAN MISSION
            </span>

            <h3>
              Water service is
              <br />
              a shared responsibility.
            </h3>
          </div>

          <p>
            The Mission brings together
            national, state, local and community
            efforts to support sustainable
            drinking-water services.
          </p>

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   FLOW ITEM
   ========================================================= */

function FlowItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="about-flow-item">

      <span>
        {number}
      </span>

      <h4>
        {title}
      </h4>

      <p>
        {text}
      </p>

    </div>
  );
}