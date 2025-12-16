import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <p className="site-footer__line">
          <strong>Thomas Nordholm</strong>, Malmo, Sweden
        </p>
        <p className="site-footer__line">
          <strong>Phone in Sweden:</strong> 040-229388
        </p>
        <p className="site-footer__line">
          <strong>Mail:</strong> <a href="mailto:thomas.nordholm@protonmail.com">thomas.nordholm@protonmail.com</a>
        </p>
      </div>
    </footer>
  );
}


