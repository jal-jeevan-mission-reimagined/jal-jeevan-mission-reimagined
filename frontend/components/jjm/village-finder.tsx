"use client";

import { useState } from "react";

export function VillageFinder() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");

  return (
    <section className="village-finder" id="village-finder">
      <div className="village-finder-card">

        {/* HEADER */}
        <div className="finder-header">
          <div>
            <div className="finder-label">
              <span className="finder-dot" />
              FIND YOUR VILLAGE
            </div>

            <h2>What&apos;s the water situation where you live?</h2>

            <p>
              Select your location to see water supply, quality and
              service information for your village.
            </p>
          </div>

          <div className="finder-count">
            <strong>4</strong>
            <span>steps</span>
          </div>
        </div>

        {/* STEP INDICATOR */}
        <div className="finder-progress">
          <div className="progress-line">
            <div
              className="progress-active"
              style={{
                width:
                  state && district && block && village
                    ? "100%"
                    : state && district && block
                    ? "75%"
                    : state && district
                    ? "50%"
                    : state
                    ? "25%"
                    : "0%",
              }}
            />
          </div>

          <div className="progress-items">
            <span className={state ? "active" : ""}>
              01&nbsp; State
            </span>

            <span className={district ? "active" : ""}>
              02&nbsp; District
            </span>

            <span className={block ? "active" : ""}>
              03&nbsp; Block
            </span>

            <span className={village ? "active" : ""}>
              04&nbsp; Village
            </span>
          </div>
        </div>

        {/* LOCATION BOXES */}
        <div className="finder-fields">

          <LocationField
            number="01"
            label="State"
            placeholder="Select state"
            value={state}
            onChange={(value) => {
              setState(value);
              setDistrict("");
              setBlock("");
              setVillage("");
            }}
          />

          <LocationField
            number="02"
            label="District"
            placeholder="Select district"
            value={district}
            disabled={!state}
            onChange={(value) => {
              setDistrict(value);
              setBlock("");
              setVillage("");
            }}
          />

          <LocationField
            number="03"
            label="Block"
            placeholder="Select block"
            value={block}
            disabled={!district}
            onChange={(value) => {
              setBlock(value);
              setVillage("");
            }}
          />

          <LocationField
            number="04"
            label="Village"
            placeholder="Select village"
            value={village}
            disabled={!block}
            onChange={setVillage}
          />

        </div>

        {/* BOTTOM */}
        <div className="finder-bottom">

          <div className="finder-message">

            <div className="message-icon">
              {state ? "✓" : "01"}
            </div>

            <div>
              <strong>
                {state
                  ? "Location selection in progress"
                  : "Start with your state"}
              </strong>

              <p>
                {state
                  ? "Choose the next level to continue."
                  : "The other options will appear automatically."}
              </p>
            </div>

          </div>

          <button
            type="button"
            disabled={!state || !district || !block || !village}
            className="finder-button"
          >
            View Village
            <span>→</span>
          </button>

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   LOCATION FIELD
   ========================================================= */

function LocationField({
  number,
  label,
  placeholder,
  value,
  disabled = false,
  onChange,
}: {
  number: string;
  label: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className={`finder-field ${
        disabled ? "finder-field-disabled" : ""
      } ${value ? "finder-field-selected" : ""}`}
    >

      <div className="field-heading">

        <span className="field-number">
          {number}
        </span>

        <span className="field-label">
          {label}
        </span>

      </div>

      <div className="field-select">

        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">
            {placeholder}
          </option>
        </select>

        <span className="field-arrow">
          ↓
        </span>

      </div>

    </div>
  );
}