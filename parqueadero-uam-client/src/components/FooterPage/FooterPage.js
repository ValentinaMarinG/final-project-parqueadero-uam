import React from "react";
import Logo_UAM from "../../assets/png/Logo_UAM.png";
import "./FooterPage.scss";
import { Row } from "antd";

export const FooterPage = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Row>
          <img src={Logo_UAM} alt="Logo Footer" className="footer__logo" />
        </Row>
      </div>
    </footer>
  );
};
