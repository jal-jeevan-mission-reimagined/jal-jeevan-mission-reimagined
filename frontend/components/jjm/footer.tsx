export function Footer() {
  return (
    <footer className="jjm-footer">
      {/* Decorative water line */}
      <div className="jjm-footer__waterline" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="jjm-footer__main">
        {/* LEFT — JJM identity */}
        <div className="jjm-footer__identity">
          <div className="jjm-footer__eyebrow">
            <span className="jjm-footer__dot" />
            JAL JEEVAN MISSION
          </div>

          <h2>
            Water that reaches
            <br />
            every rural home.
          </h2>

          <p>
            Reliable drinking water services
            for rural households across India.
          </p>

          <a
            href="https://jaljeevanmission.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="jjm-footer__official-link"
          >
            <span>VISIT OFFICIAL JJM WEBSITE</span>
            <strong>↗</strong>
          </a>
        </div>

        {/* RIGHT — Quick navigation */}
        <div className="jjm-footer__navigation">
          <div className="jjm-footer__nav-heading">
            QUICK ACCESS
          </div>

          <a href="#village-finder" className="jjm-footer__nav-item">
            <span>01</span>
            <strong>Find My Village</strong>
            <b>→</b>
          </a>

          <a href="#water-data" className="jjm-footer__nav-item">
            <span>02</span>
            <strong>Water Data</strong>
            <b>→</b>
          </a>

          <a href="#water-quality" className="jjm-footer__nav-item">
            <span>03</span>
            <strong>Water Quality</strong>
            <b>→</b>
          </a>

          <a href="#resources" className="jjm-footer__nav-item">
            <span>04</span>
            <strong>Resources & Documents</strong>
            <b>→</b>
          </a>

          <a
            href="#report-water-problem"
            className="jjm-footer__nav-item"
          >
            <span>05</span>
            <strong>Report a Water Problem</strong>
            <b>→</b>
          </a>
        </div>
      </div>

      {/* Government information */}
      <div className="jjm-footer__government">
        <div className="jjm-footer__government-inner">
          <div className="jjm-footer__government-identity">
            <div
              className="jjm-footer__tricolor"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <div>
              <strong>GOVERNMENT OF INDIA</strong>

              <p>
                Ministry of Jal Shakti
                <br />
                Department of Drinking Water &amp; Sanitation
              </p>
            </div>
          </div>

          <div className="jjm-footer__government-note">
            <span>PUBLIC SERVICE</span>
            <p>
              Information, services and resources
              for rural drinking water.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom legal/navigation strip */}
      <div className="jjm-footer__bottom">
        <div className="jjm-footer__copyright">
          <span className="jjm-footer__mini-mark">
            JJM
          </span>

          <span>
            © Government of India
          </span>
        </div>

        <div className="jjm-footer__bottom-links">
          <a href="#top">Back to top ↑</a>
          <span />
          <a href="#top">Accessibility</a>
          <span />
          <a href="#top">Privacy</a>
        </div>
      </div>
    </footer>
  );
}