"use client";

import { useEffect, useState } from "react";

const navigation = [
  {
    label: "About JJM",
    href: "#about-jjm",
  },
  {
    label: "My Village",
    href: "#village-finder",
  },
  {
    label: "Water at a Glance",
    href: "#water-glance",
  },
  {
    label: "Water Quality",
    href: "#water-quality",
  },
  {
    label: "Water Data",
    href: "#water-data",
  },
  {
    label: "Resources",
    href: "#resources",
  },
];

export function GovernmentBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = navigation
      .map((item) =>
        document.querySelector(item.href)
      )
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visible[0]?.target.id) {
          setActiveSection(
            `#${visible[0].target.id}`
          );
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.3, 0.5],
      }
    );

    sections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="gov-bar">

      {/* =========================================
          GOVERNMENT UTILITY BAR
         ========================================= */}

      <div className="gov-bar__top">
        <div className="gov-bar__top-inner">

          <div className="gov-bar__identity">
            <span className="gov-bar__title">
              GOVERNMENT OF INDIA
            </span>

            <span
              className="gov-bar__divider"
              aria-hidden="true"
            />

            <span className="gov-bar__ministry">
              Ministry of Jal Shakti
            </span>
          </div>

          <div className="gov-bar__utilities">

            <button
              type="button"
              className="gov-bar__utility gov-bar__utility--active"
            >
              English
            </button>

            <span
              className="gov-bar__utility-divider"
              aria-hidden="true"
            />

            <button
              type="button"
              className="gov-bar__utility"
              onClick={() => {
                document.documentElement.classList.toggle(
                  "accessibility-enhanced"
                );
              }}
            >
              Accessibility
            </button>

          </div>

        </div>
      </div>


      {/* =========================================
          MAIN NAVIGATION
         ========================================= */}

      <div className="gov-bar__navigation">

        <div className="gov-bar__navigation-inner">

          {/* Brand */}

          <a
            href="#top"
            className="gov-bar__brand"
            onClick={closeMenu}
          >
            <span className="gov-bar__brand-mark">
              JJM
            </span>

            <span className="gov-bar__brand-copy">
              <strong>
                JAL JEEVAN MISSION
              </strong>

              <small>
                Har Ghar Jal
              </small>
            </span>
          </a>


          {/* Desktop navigation */}

          <nav
            className="gov-bar__nav"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active =
                activeSection === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "gov-bar__nav-link gov-bar__nav-link--active"
                      : "gov-bar__nav-link"
                  }
                >
                  {item.label}
                </a>
              );
            })}
          </nav>


          {/* Primary action */}

          <a
            href="#report-water-problem"
            className="gov-bar__report"
            onClick={closeMenu}
          >
            <span>
              Report a Problem
            </span>

            <strong>
              →
            </strong>
          </a>


          {/* Mobile menu */}

          <button
            type="button"
            className={
              menuOpen
                ? "gov-bar__menu-button gov-bar__menu-button--open"
                : "gov-bar__menu-button"
            }
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((value) => !value)
            }
          >
            <span />
            <span />
            <span />
          </button>

        </div>


        {/* Mobile navigation */}

        <div
          className={
            menuOpen
              ? "gov-bar__mobile-menu gov-bar__mobile-menu--open"
              : "gov-bar__mobile-menu"
          }
        >
          <nav aria-label="Mobile navigation">

            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={
                  activeSection === item.href
                    ? "gov-bar__mobile-link gov-bar__mobile-link--active"
                    : "gov-bar__mobile-link"
                }
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>
                  {item.label}
                </strong>

                <b>
                  →
                </b>
              </a>
            ))}

            <a
              href="#report-water-problem"
              className="gov-bar__mobile-report"
              onClick={closeMenu}
            >
              <span>
                Report a Water Problem
              </span>

              <strong>
                →
              </strong>
            </a>

          </nav>
        </div>

      </div>


      {/* =========================================
          TRICOLOUR
         ========================================= */}

      <div
        className="gov-bar__accent"
        aria-hidden="true"
      >
        <span className="gov-bar__accent--saffron" />
        <span className="gov-bar__accent--white" />
        <span className="gov-bar__accent--green" />
      </div>

    </header>
  );
}