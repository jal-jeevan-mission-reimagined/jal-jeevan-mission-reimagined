"use client";

import { FormEvent, useState } from "react";

type ProblemType =
  | "no-water"
  | "quality"
  | "leakage"
  | "irregular"
  | "other";

const problemTypes: {
  value: ProblemType;
  label: string;
}[] = [
  {
    value: "no-water",
    label: "No water supply",
  },
  {
    value: "quality",
    label: "Poor water quality",
  },
  {
    value: "leakage",
    label: "Pipeline / leakage",
  },
  {
    value: "irregular",
    label: "Irregular supply",
  },
  {
    value: "other",
    label: "Other",
  },
];

export function ReportWaterProblem() {
  const [problemType, setProblemType] =
    useState<ProblemType | "">("");

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [description, setDescription] =
    useState("");
  const [mobile, setMobile] = useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !state ||
      !district ||
      !village ||
      !problemType ||
      !description.trim()
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setError("");
    setState("");
    setDistrict("");
    setVillage("");
    setProblemType("");
    setDescription("");
    setMobile("");
  }

  return (
    <section
      id="report-water-problem"
      className="report-water-section"
    >
      <div className="report-water-container">

        {/* ============================================
            HEADER
           ============================================ */}

        <div className="report-water-heading">

          <div className="report-water-title">

            <span className="report-water-kicker">
              CITIZEN SERVICE
            </span>

            <h2>
              Report a
              <br />
              water problem.
            </h2>

          </div>

          <div className="report-water-intro">

            <p>
              Something not right with your
              water supply? Tell us what is
              happening in your area.
            </p>

            <span>
              Your location helps identify
              the affected service area.
            </span>

          </div>

        </div>


        {/* ============================================
            FORM / SUCCESS
           ============================================ */}

        {!submitted ? (
          <form
            className="report-water-form"
            onSubmit={handleSubmit}
          >

            {/* LOCATION */}

            <div className="report-form-section">

              <div className="report-section-label">

                <span>
                  01
                </span>

                <div>
                  <small>
                    LOCATION
                  </small>

                  <h3>
                    Where is the problem?
                  </h3>
                </div>

              </div>


              <div className="report-fields">

                <Field
                  label="State"
                  required
                >
                  <select
                    value={state}
                    onChange={(event) =>
                      setState(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select state
                    </option>

                    <option>
                      Andhra Pradesh
                    </option>

                    <option>
                      Assam
                    </option>

                    <option>
                      Bihar
                    </option>

                    <option>
                      Chhattisgarh
                    </option>

                    <option>
                      Gujarat
                    </option>

                    <option>
                      Haryana
                    </option>

                    <option>
                      Karnataka
                    </option>

                    <option>
                      Kerala
                    </option>

                    <option>
                      Madhya Pradesh
                    </option>

                    <option>
                      Maharashtra
                    </option>

                    <option>
                      Odisha
                    </option>

                    <option>
                      Punjab
                    </option>

                    <option>
                      Rajasthan
                    </option>

                    <option>
                      Tamil Nadu
                    </option>

                    <option>
                      Telangana
                    </option>

                    <option>
                      Uttar Pradesh
                    </option>

                    <option>
                      Uttarakhand
                    </option>

                    <option>
                      West Bengal
                    </option>
                  </select>
                </Field>


                <Field
                  label="District"
                  required
                >
                  <input
                    type="text"
                    value={district}
                    onChange={(event) =>
                      setDistrict(
                        event.target.value
                      )
                    }
                    placeholder="Enter district"
                  />
                </Field>


                <Field
                  label="Village"
                  required
                >
                  <input
                    type="text"
                    value={village}
                    onChange={(event) =>
                      setVillage(
                        event.target.value
                      )
                    }
                    placeholder="Enter village"
                  />
                </Field>

              </div>

            </div>


            {/* PROBLEM */}

            <div className="report-form-section">

              <div className="report-section-label">

                <span>
                  02
                </span>

                <div>
                  <small>
                    ISSUE
                  </small>

                  <h3>
                    What is happening?
                  </h3>
                </div>

              </div>


              <div className="problem-options">

                {problemTypes.map(
                  (problem) => (
                    <label
                      key={problem.value}
                      className={
                        problemType ===
                        problem.value
                          ? "problem-option active"
                          : "problem-option"
                      }
                    >

                      <input
                        type="radio"
                        name="problem"
                        value={problem.value}
                        checked={
                          problemType ===
                          problem.value
                        }
                        onChange={() =>
                          setProblemType(
                            problem.value
                          )
                        }
                      />

                      <span className="problem-radio">
                        <span />
                      </span>

                      <span className="problem-label">
                        {problem.label}
                      </span>

                      <span className="problem-arrow">
                        →
                      </span>

                    </label>
                  )
                )}

              </div>

            </div>


            {/* DETAILS */}

            <div className="report-form-section">

              <div className="report-section-label">

                <span>
                  03
                </span>

                <div>
                  <small>
                    DETAILS
                  </small>

                  <h3>
                    Tell us a little more.
                  </h3>
                </div>

              </div>


              <div className="report-details">

                <Field
                  label="Describe the problem"
                  required
                >
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Describe what you are experiencing..."
                    rows={5}
                    maxLength={500}
                  />

                  <span className="character-count">
                    {description.length}/500
                  </span>
                </Field>


                <Field
                  label="Mobile number"
                  optional
                >
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                    maxLength={10}
                  />
                </Field>

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="report-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}


            {/* SUBMIT */}

            <div className="report-submit">

              <div>
                <span className="submit-mark">
                  ✓
                </span>

                <p>
                  Required fields are marked
                  automatically.
                </p>
              </div>

              <button
                type="submit"
                className="report-submit-button"
              >
                <span>
                  SUBMIT REPORT
                </span>

                <strong>
                  →
                </strong>
              </button>

            </div>

          </form>
        ) : (
          <div className="report-success">

            <div className="success-symbol">
              ✓
            </div>

            <div>

              <span>
                REPORT RECEIVED
              </span>

              <h3>
                Thank you for reporting
                the issue.
              </h3>

              <p>
                Your information has been
                recorded for this session.
                Once the reporting service is
                connected to the backend,
                submissions can be routed to
                the appropriate authority.
              </p>

              <button
                type="button"
                onClick={resetForm}
              >
                REPORT ANOTHER PROBLEM
                <span>
                  →
                </span>
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}


/* =========================================================
   FORM FIELD
   ========================================================= */

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="report-field">

      <span className="report-field-label">
        {label}

        {required && (
          <b>*</b>
        )}

        {optional && (
          <small>
            OPTIONAL
          </small>
        )}
      </span>

      <div className="report-field-control">
        {children}
      </div>

    </label>
  );
}