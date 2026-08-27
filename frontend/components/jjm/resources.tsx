"use client";

import { useState } from "react";

type ResourceCategory =
  | "all"
  | "guidelines"
  | "manuals"
  | "reports"
  | "om";

const resources = [
  {
    category: "guidelines",
    label: "GUIDELINE",
    title: "Operational Guidelines of Jal Jeevan Mission 2.0",
    year: "2026",
    description:
      "Operational guidance for implementation of Jal Jeevan Mission 2.0.",
  },
  {
    category: "guidelines",
    label: "GUIDELINE",
    title: "Guidelines for implementation of Nal Jal Mitra programme",
    year: "2024",
    description:
      "Guidance relating to the Nal Jal Mitra programme.",
  },
  {
    category: "manuals",
    label: "MANUAL",
    title: "Drinking Water Quality Monitoring & Surveillance Framework",
    year: "2022",
    description:
      "Framework for monitoring and surveillance of drinking-water quality.",
  },
  {
    category: "manuals",
    label: "MANUAL",
    title: "Jal Jeevan Mission Booklet",
    year: "2021",
    description:
      "An overview of the Mission, its approach and implementation.",
  },
  {
    category: "reports",
    label: "REPORT",
    title: "Jal Mahotsav Report",
    year: "2026",
    description:
      "Publication documenting Jal Mahotsav activities and initiatives.",
  },
  {
    category: "reports",
    label: "REPORT",
    title: "6 years of Jal Jeevan Mission",
    year: "2025",
    description:
      "Publication documenting six years of the Mission.",
  },
  {
    category: "reports",
    label: "PUBLICATION",
    title: "Transformational Stories: Redefining Lives through Water",
    year: "2025",
    description:
      "Stories highlighting changes associated with access to drinking water.",
  },
  {
    category: "om",
    label: "O&M",
    title: "Operation and Maintenance Policy Documents",
    year: "State-wise",
    description:
      "Operation and maintenance policy resources organised by State and UT.",
  },
];

const tabs: {
  id: ResourceCategory;
  label: string;
}[] = [
  {
    id: "all",
    label: "All resources",
  },
  {
    id: "guidelines",
    label: "Guidelines",
  },
  {
    id: "manuals",
    label: "Manuals",
  },
  {
    id: "reports",
    label: "Publications & reports",
  },
  {
    id: "om",
    label: "O&M documents",
  },
];

export function Resources() {
  const [activeTab, setActiveTab] =
    useState<ResourceCategory>("all");

  const [query, setQuery] = useState("");

  const filteredResources = resources.filter(
    (resource) => {
      const matchesCategory =
        activeTab === "all" ||
        resource.category === activeTab;

      const matchesSearch =
        resource.title
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(query.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  return (
    <section
      id="resources"
      className="jjm-resources-section"
    >
      <div className="jjm-resources-container">

        {/* HEADER */}

        <header className="resources-header">

          <div>
            <p className="resources-eyebrow">
              KNOWLEDGE RESOURCES
            </p>

            <h2>
              Guidance for
              <br />
              the Mission.
            </h2>

            <p className="resources-intro">
              Official guidelines, manuals,
              publications and policy documents
              supporting Jal Jeevan Mission.
            </p>
          </div>

          <div className="resources-header-note">
            <span className="resources-note-line" />

            <p>
              National Jal Jeevan Mission
              <br />
              Government of India
            </p>
          </div>

        </header>


        {/* SEARCH */}

        <div className="resources-search-row">

          <div className="resources-search">

            <span>
              SEARCH
            </span>

            <input
              type="search"
              placeholder="Search documents, guidelines or reports"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />

            <span className="search-arrow">
              →
            </span>

          </div>

        </div>


        {/* TABS */}

        <nav className="resources-tabs">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(tab.id)
              }
            >
              {tab.label}
            </button>
          ))}

        </nav>


        {/* FEATURED */}

        {activeTab === "all" &&
          query === "" && (
            <article className="resources-featured">

              <div className="featured-document-mark">
                <span>PDF</span>
                <strong>
                  01
                </strong>
              </div>

              <div className="featured-content">

                <div className="featured-meta">
                  <span>
                    GUIDELINE
                  </span>

                  <b>
                    2026
                  </b>
                </div>

                <h3>
                  Operational Guidelines
                  of Jal Jeevan Mission 2.0
                </h3>

                <p>
                  The latest operational guidance
                  for implementation of Jal Jeevan
                  Mission 2.0.
                </p>

              </div>

              <button
                type="button"
                className="featured-action"
              >
                <span>
                  VIEW DOCUMENT
                </span>

                <strong>
                  →
                </strong>
              </button>

            </article>
          )}


        {/* LIST */}

        <div className="resources-list-header">

          <div>
            <p>
              {activeTab === "all"
                ? "BROWSE RESOURCES"
                : tabs.find(
                    (tab) =>
                      tab.id === activeTab
                  )?.label.toUpperCase()}
            </p>

            <h3>
              Official documents
            </h3>
          </div>

          <span>
            {filteredResources.length}{" "}
            resources
          </span>

        </div>


        <div className="resources-list">

          {filteredResources.length === 0 ? (
            <div className="resources-empty">
              No matching resources found.
            </div>
          ) : (
            filteredResources.map(
              (resource, index) => (
                <article
                  key={`${resource.title}-${index}`}
                  className="resource-row"
                >

                  <div className="resource-index">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="resource-main">

                    <div className="resource-meta">
                      <span>
                        {resource.label}
                      </span>

                      <b>
                        {resource.year}
                      </b>
                    </div>

                    <h4>
                      {resource.title}
                    </h4>

                    <p>
                      {resource.description}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="resource-action"
                    aria-label={`View ${resource.title}`}
                  >
                    <span>
                      VIEW
                    </span>

                    <strong>
                      →
                    </strong>
                  </button>

                </article>
              )
            )
          )}

        </div>


        {/* SOURCE NOTE */}

        <div className="resources-source">

          <div>
            <span className="source-mark">
              i
            </span>

            <p>
              Resource titles are based on
              official Jal Jeevan Mission
              knowledge resources.
            </p>
          </div>

          <a
            href="https://jaljeevanmission.gov.in/guidelines"
            target="_blank"
            rel="noreferrer"
          >
            Visit official resource library
            <span>↗</span>
          </a>

        </div>

      </div>
    </section>
  );
}