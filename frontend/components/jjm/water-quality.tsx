"use client";

import { useRef, useState } from "react";

export function WaterQuality() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section
      id="water-quality"
      className="water-quality-section"
    >
      <div className="water-quality-container">

        {/* HEADER */}
        <div className="water-quality-header">

          <div>
            <p className="water-quality-eyebrow">
              WATER QUALITY
            </p>

            <h2>
              Understanding the water
              <br />
              you receive.
            </h2>

            <p className="water-quality-intro">
              Information about drinking water testing,
              monitoring and quality at the source.
            </p>
          </div>

          <div className="water-quality-side-note">
            <span className="quality-line" />
            <p>
              Safe drinking water
              <br />
              starts with quality.
            </p>
          </div>

        </div>


        {/* VIDEO */}
        <div className="water-quality-video">

          <video
            ref={videoRef}
            src="/videos/water-quality.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />

          <div className="water-quality-video-overlay" />

          <div className="water-quality-video-caption">
            <span>FIELD MONITORING</span>

            <p>
              Water quality is checked
              through testing and surveillance.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="water-quality-mute"
            aria-label={
              muted ? "Unmute video" : "Mute video"
            }
          >
            {muted ? "Sound off" : "Sound on"}
          </button>

        </div>


        {/* QUALITY INFORMATION */}
        <div className="water-quality-information">

          <div className="quality-heading">
            <div>
              <p className="quality-small-label">
                WATER QUALITY
              </p>

              <h3>
                At your location
              </h3>
            </div>

            <span className="quality-status">
              Data pending
            </span>
          </div>


          <div className="quality-values">

            <div className="quality-value">
              <span>pH</span>
              <strong>—</strong>
              <small>
                Acidity / alkalinity
              </small>
            </div>

            <div className="quality-value">
              <span>Turbidity</span>
              <strong>—</strong>
              <small>
                Water clarity
              </small>
            </div>

            <div className="quality-value">
              <span>TDS</span>
              <strong>—</strong>
              <small>
                Dissolved solids
              </small>
            </div>

          </div>


          <div className="quality-location">

            <div>
              <span className="location-marker">
                +
              </span>

              <div>
                <strong>
                  Check your area
                </strong>

                <p>
                  Select a village to view available
                  water quality information.
                </p>
              </div>
            </div>

            <button type="button">
              Select location
              <span>→</span>
            </button>

          </div>

        </div>


        {/* PROCESS */}
        <div className="water-quality-process">

          <div className="process-header">
            <p>
              HOW WATER IS CHECKED
            </p>

            <span>
              From sample to monitoring
            </span>
          </div>


          <div className="process-grid">

            <div className="process-item">
              <span className="process-number">
                01
              </span>

              <div>
                <h4>
                  Sample collection
                </h4>

                <p>
                  Water is collected from
                  identified sources for testing.
                </p>
              </div>
            </div>


            <div className="process-item">
              <span className="process-number">
                02
              </span>

              <div>
                <h4>
                  Testing
                </h4>

                <p>
                  Samples are checked for
                  relevant quality parameters.
                </p>
              </div>
            </div>


            <div className="process-item">
              <span className="process-number">
                03
              </span>

              <div>
                <h4>
                  Monitoring
                </h4>

                <p>
                  Results are recorded and
                  monitored over time.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}