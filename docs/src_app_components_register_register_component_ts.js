(self["webpackChunktaverna_tibiana"] = self["webpackChunktaverna_tibiana"] || []).push([["src_app_components_register_register_component_ts"],{

/***/ 2347:
/*!************************************************************************!*\
  !*** ./src/app/components/register/register.component.scss?ngResource ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.consulta-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
}

input.input-medieval {
  flex: 1;
  margin-bottom: 0.5rem;
}

.button-medieval {
  width: 70%;
  margin: 1rem auto 0 auto;
  display: block;
}

.login-error {
  color: #992e2e;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: "MedievalSharp", serif;
  font-size: 0.95rem;
}

.input-icon-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.login-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.2rem;
  font-family: "MedievalSharp", serif;
}

.medieval-link {
  color: #7b5e3b;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.2s;
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
}

.medieval-link:hover {
  color: #a88d5a;
}

.medieval-disclaimer {
  background: linear-gradient(#fdf8e4, #f4e6b3);
  border: 2px solid #a67c52;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
  font-family: "Georgia", serif;
  font-size: 1.08rem;
  color: #3b2a1a;
  box-shadow: inset 0 0 8px rgba(139, 69, 19, 0.15), 2px 2px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}
.medieval-disclaimer p {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
.medieval-disclaimer p:last-child {
  margin-bottom: 0;
}
.medieval-disclaimer strong {
  color: #5b3e1d;
}

.terms-section {
  margin: 1.2rem 0 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.terms-section .terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.3em;
  flex-wrap: wrap;
  justify-content: center;
}
.terms-section .terms-checkbox input[type=checkbox] {
  width: 20px;
  height: 20px;
  accent-color: #8b5e3c;
  margin: 0 8px 0 0;
  flex-shrink: 0;
  margin-top: 0;
  position: relative;
  top: 1px;
}
.terms-section .terms-checkbox p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  color: #3b2a1a;
  font-family: "Georgia", serif;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 0.3em;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
}
.terms-section .terms-checkbox .medieval-link {
  display: inline;
  margin-left: 0.3em;
  white-space: normal;
  word-break: break-word;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-conteudo {
  background: linear-gradient(#fef8e7, #f5e4bc);
  border: 2px solid #8b5e3c;
  border-radius: 10px;
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: "MedievalSharp", cursive;
  position: relative;
}

.modal-titulo {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #5b3e1d;
}

.modal-opcoes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.modal-opcoes h4 {
  color: #5b3e1d;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.1rem;
}
.modal-opcoes p {
  color: #3b2a1a;
  line-height: 1.5;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
.modal-opcoes ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.modal-opcoes ul li {
  color: #3b2a1a;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.modal-opcoes ul li strong {
  color: #5b3e1d;
}
.modal-opcoes .contact-info {
  font-style: italic;
  color: #8b5e3c;
  text-align: center;
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(139, 94, 60, 0.1);
  border-radius: 6px;
}

.modal-botoes {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1em;
}
.modal-botoes .button-medieval {
  width: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .consulta-layout {
    padding: 0.5rem;
    justify-content: flex-start;
    min-height: auto;
  }
  .parchment-card {
    max-width: 100%;
    padding: 1rem;
    margin: 1rem 0;
  }
  .medieval-disclaimer {
    font-size: 0.95rem;
    padding: 1rem 0.8rem;
  }
  .terms-section .terms-checkbox input[type=checkbox] {
    width: 22px;
    height: 22px;
  }
  .terms-section .terms-checkbox p {
    font-size: 0.95rem;
    text-align: center;
  }
  .modal-conteudo {
    font-size: 0.9rem;
    padding: 16px;
    max-width: 98vw;
    max-height: 98vh;
  }
  .modal-opcoes h4 {
    font-size: 1rem;
  }
  .modal-opcoes p, .modal-opcoes ul li {
    font-size: 0.85rem;
  }
  .modal-titulo {
    font-size: 1.3rem;
  }
  .button-medieval {
    width: 85%;
  }
}
@media (max-width: 480px) {
  .consulta-layout {
    padding: 0.5rem;
  }
  .parchment-card {
    max-width: 100%;
    padding: 0.8rem;
  }
  .medieval-disclaimer {
    font-size: 0.9rem;
    padding: 0.8rem 0.6rem;
  }
  .terms-section .terms-checkbox p {
    font-size: 0.9rem;
    line-height: 1.3;
  }
  .modal-conteudo {
    padding: 12px;
    font-size: 0.85rem;
  }
  .modal-opcoes h4 {
    font-size: 0.95rem;
  }
  .modal-opcoes p, .modal-opcoes ul li {
    font-size: 0.8rem;
  }
  .modal-titulo {
    font-size: 1.2rem;
  }
  .modal-botoes {
    flex-direction: column;
    gap: 0.5rem;
  }
  .modal-botoes .button-medieval {
    width: 100%;
  }
  .button-medieval {
    width: 90%;
  }
  .input-icon-group {
    gap: 0.3rem;
  }
  .svg-icon {
    width: 20px;
    height: 20px;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/components/register/register.component.scss","webpack://./../../Projetos%20Pessoais/charlovinho/src/app/components/register/register.component.scss"],"names":[],"mappings":"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","sourcesContent":[".consulta-layout {\r\n  min-height: 100vh;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  padding: 1rem;\r\n  box-sizing: border-box;\r\n}\r\n\r\ninput.input-medieval {\r\n  flex: 1;\r\n  margin-bottom: 0.5rem; // Reduzido para deixar mais compacto\r\n}\r\n\r\n.button-medieval {\r\n  width: 70%;\r\n  margin: 1rem auto 0 auto;\r\n  display: block;\r\n}\r\n\r\n.login-error {\r\n  color: #992e2e;\r\n  font-weight: bold;\r\n  margin-bottom: 0.5rem;\r\n  text-align: center;\r\n  font-family: 'MedievalSharp', serif;\r\n  font-size: 0.95rem;\r\n}\r\n\r\n.input-icon-group {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  margin-bottom: 0.5rem; // Reduzido para deixar mais compacto\r\n}\r\n\r\n.login-links {\r\n  display: flex;\r\n  justify-content: center;\r\n  gap: 0.5rem;\r\n  margin-top: 1.2rem;\r\n  font-family: 'MedievalSharp', serif;\r\n}\r\n\r\n.medieval-link {\r\n  color: #7b5e3b;\r\n  text-decoration: underline;\r\n  cursor: pointer;\r\n  font-weight: bold;\r\n  transition: color 0.2s;\r\n  background: none;\r\n  border: none;\r\n  padding: 0;\r\n  font-size: inherit;\r\n}\r\n\r\n.medieval-link:hover {\r\n  color: #a88d5a;\r\n}\r\n\r\n.medieval-disclaimer {\r\n  background: linear-gradient(#fdf8e4, #f4e6b3);\r\n  border: 2px solid #a67c52;\r\n  border-radius: 8px;\r\n  padding: 1.2rem 1.5rem;\r\n  margin-bottom: 1.2rem;\r\n  font-family: \"Georgia\", serif;\r\n  font-size: 1.08rem; // Aumentado para melhor leitura\r\n  color: #3b2a1a;\r\n  box-shadow: inset 0 0 8px rgba(139, 69, 19, 0.15),\r\n    2px 2px 6px rgba(0, 0, 0, 0.1);\r\n  text-align: left;\r\n\r\n  p {\r\n    margin-bottom: 0.5rem;\r\n    line-height: 1.5;\r\n    &:last-child {\r\n      margin-bottom: 0;\r\n    }\r\n  }\r\n  strong {\r\n    color: #5b3e1d;\r\n  }\r\n}\r\n\r\n.terms-section {\r\n  margin: 1.2rem 0 0.5rem 0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n  text-align: center;\r\n  \r\n  .terms-checkbox {\r\n    display: flex;\r\n    align-items: flex-start;\r\n    gap: 0.3em;\r\n    flex-wrap: wrap;\r\n    justify-content: center;\r\n    \r\n    input[type=\"checkbox\"] {\r\n      width: 20px;\r\n      height: 20px;\r\n      accent-color: #8b5e3c;\r\n      margin: 0 8px 0 0;\r\n      flex-shrink: 0;\r\n      margin-top: 0;\r\n      position: relative;\r\n      top: 1px;\r\n    }\r\n    \r\n    p {\r\n      margin: 0;\r\n      font-size: 1rem;\r\n      line-height: 1.4;\r\n      color: #3b2a1a;\r\n      font-family: \"Georgia\", serif;\r\n      cursor: pointer;\r\n      display: flex;\r\n      align-items: flex-start;\r\n      gap: 0.3em;\r\n      flex-wrap: wrap;\r\n      text-align: center;\r\n      justify-content: center;\r\n    }\r\n    \r\n    .medieval-link {\r\n      display: inline;\r\n      margin-left: 0.3em;\r\n      white-space: normal;\r\n      word-break: break-word;\r\n    }\r\n  }\r\n}\r\n\r\n// Modal styles (usando as classes já definidas no styles.scss global)\r\n.modal-overlay {\r\n  position: fixed;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  background-color: rgba(0, 0, 0, 0.5);\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  z-index: 999;\r\n  padding: 1rem;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.modal-conteudo {\r\n  background: linear-gradient(#fef8e7, #f5e4bc);\r\n  border: 2px solid #8b5e3c;\r\n  border-radius: 10px;\r\n  max-width: 95vw;\r\n  max-height: 95vh;\r\n  width: 100%;\r\n  overflow-y: auto;\r\n  padding: 20px;\r\n  box-sizing: border-box;\r\n  font-family: 'MedievalSharp', cursive;\r\n  position: relative;\r\n}\r\n\r\n.modal-titulo {\r\n  font-size: 1.5rem;\r\n  margin-bottom: 1rem;\r\n  text-align: center;\r\n  color: #5b3e1d;\r\n}\r\n\r\n.modal-opcoes {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1rem;\r\n  margin-bottom: 1.5rem;\r\n  \r\n  h4 {\r\n    color: #5b3e1d;\r\n    margin: 1rem 0 0.5rem 0;\r\n    font-size: 1.1rem;\r\n  }\r\n  \r\n  p {\r\n    color: #3b2a1a;\r\n    line-height: 1.5;\r\n    margin: 0.5rem 0;\r\n    font-size: 0.9rem;\r\n  }\r\n  \r\n  ul {\r\n    margin: 0.5rem 0;\r\n    padding-left: 1.5rem;\r\n    \r\n    li {\r\n      color: #3b2a1a;\r\n      line-height: 1.4;\r\n      margin-bottom: 0.5rem;\r\n      font-size: 0.9rem;\r\n      \r\n      strong {\r\n        color: #5b3e1d;\r\n      }\r\n    }\r\n  }\r\n  \r\n  .contact-info {\r\n    font-style: italic;\r\n    color: #8b5e3c;\r\n    text-align: center;\r\n    margin-top: 1rem;\r\n    padding: 0.8rem;\r\n    background: rgba(139, 94, 60, 0.1);\r\n    border-radius: 6px;\r\n  }\r\n}\r\n\r\n.modal-botoes {\r\n  display: flex;\r\n  justify-content: center;\r\n  gap: 1rem;\r\n  margin-top: 1em;\r\n  \r\n  .button-medieval {\r\n    width: auto;\r\n    margin: 0;\r\n  }\r\n}\r\n\r\n// Responsividade\r\n@media (max-width: 768px) {\r\n  .consulta-layout {\r\n    padding: 0.5rem;\r\n    justify-content: flex-start;\r\n    min-height: auto;\r\n  }\r\n  \r\n  .parchment-card {\r\n    max-width: 100%;\r\n    padding: 1rem;\r\n    margin: 1rem 0;\r\n  }\r\n  \r\n  .medieval-disclaimer {\r\n    font-size: 0.95rem;\r\n    padding: 1rem 0.8rem;\r\n  }\r\n  \r\n  .terms-section .terms-checkbox {\r\n    input[type=\"checkbox\"] {\r\n      width: 22px;\r\n      height: 22px;\r\n    }\r\n    \r\n    p {\r\n      font-size: 0.95rem;\r\n      text-align: center;\r\n    }\r\n  }\r\n  \r\n  .modal-conteudo {\r\n    font-size: 0.9rem;\r\n    padding: 16px;\r\n    max-width: 98vw;\r\n    max-height: 98vh;\r\n  }\r\n  \r\n  .modal-opcoes {\r\n    h4 {\r\n      font-size: 1rem;\r\n    }\r\n    \r\n    p, ul li {\r\n      font-size: 0.85rem;\r\n    }\r\n  }\r\n  \r\n  .modal-titulo {\r\n    font-size: 1.3rem;\r\n  }\r\n  \r\n  .button-medieval {\r\n    width: 85%;\r\n  }\r\n}\r\n\r\n@media (max-width: 480px) {\r\n  .consulta-layout {\r\n    padding: 0.5rem;\r\n  }\r\n  \r\n  .parchment-card {\r\n    max-width: 100%;\r\n    padding: 0.8rem;\r\n  }\r\n  \r\n  .medieval-disclaimer {\r\n    font-size: 0.9rem;\r\n    padding: 0.8rem 0.6rem;\r\n  }\r\n  \r\n  .terms-section .terms-checkbox {\r\n    p {\r\n      font-size: 0.9rem;\r\n      line-height: 1.3;\r\n    }\r\n  }\r\n  \r\n  .modal-conteudo {\r\n    padding: 12px;\r\n    font-size: 0.85rem;\r\n  }\r\n  \r\n  .modal-opcoes {\r\n    h4 {\r\n      font-size: 0.95rem;\r\n    }\r\n    \r\n    p, ul li {\r\n      font-size: 0.8rem;\r\n    }\r\n  }\r\n  \r\n  .modal-titulo {\r\n    font-size: 1.2rem;\r\n  }\r\n  \r\n  .modal-botoes {\r\n    flex-direction: column;\r\n    gap: 0.5rem;\r\n    \r\n    .button-medieval {\r\n      width: 100%;\r\n    }\r\n  }\r\n  \r\n  .button-medieval {\r\n    width: 90%;\r\n  }\r\n  \r\n  .input-icon-group {\r\n    gap: 0.3rem;\r\n  }\r\n  \r\n  .svg-icon {\r\n    width: 20px;\r\n    height: 20px;\r\n  }\r\n} ",".consulta-layout {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem;\n  box-sizing: border-box;\n}\n\ninput.input-medieval {\n  flex: 1;\n  margin-bottom: 0.5rem;\n}\n\n.button-medieval {\n  width: 70%;\n  margin: 1rem auto 0 auto;\n  display: block;\n}\n\n.login-error {\n  color: #992e2e;\n  font-weight: bold;\n  margin-bottom: 0.5rem;\n  text-align: center;\n  font-family: \"MedievalSharp\", serif;\n  font-size: 0.95rem;\n}\n\n.input-icon-group {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.login-links {\n  display: flex;\n  justify-content: center;\n  gap: 0.5rem;\n  margin-top: 1.2rem;\n  font-family: \"MedievalSharp\", serif;\n}\n\n.medieval-link {\n  color: #7b5e3b;\n  text-decoration: underline;\n  cursor: pointer;\n  font-weight: bold;\n  transition: color 0.2s;\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: inherit;\n}\n\n.medieval-link:hover {\n  color: #a88d5a;\n}\n\n.medieval-disclaimer {\n  background: linear-gradient(#fdf8e4, #f4e6b3);\n  border: 2px solid #a67c52;\n  border-radius: 8px;\n  padding: 1.2rem 1.5rem;\n  margin-bottom: 1.2rem;\n  font-family: \"Georgia\", serif;\n  font-size: 1.08rem;\n  color: #3b2a1a;\n  box-shadow: inset 0 0 8px rgba(139, 69, 19, 0.15), 2px 2px 6px rgba(0, 0, 0, 0.1);\n  text-align: left;\n}\n.medieval-disclaimer p {\n  margin-bottom: 0.5rem;\n  line-height: 1.5;\n}\n.medieval-disclaimer p:last-child {\n  margin-bottom: 0;\n}\n.medieval-disclaimer strong {\n  color: #5b3e1d;\n}\n\n.terms-section {\n  margin: 1.2rem 0 0.5rem 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n.terms-section .terms-checkbox {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.3em;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n.terms-section .terms-checkbox input[type=checkbox] {\n  width: 20px;\n  height: 20px;\n  accent-color: #8b5e3c;\n  margin: 0 8px 0 0;\n  flex-shrink: 0;\n  margin-top: 0;\n  position: relative;\n  top: 1px;\n}\n.terms-section .terms-checkbox p {\n  margin: 0;\n  font-size: 1rem;\n  line-height: 1.4;\n  color: #3b2a1a;\n  font-family: \"Georgia\", serif;\n  cursor: pointer;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.3em;\n  flex-wrap: wrap;\n  text-align: center;\n  justify-content: center;\n}\n.terms-section .terms-checkbox .medieval-link {\n  display: inline;\n  margin-left: 0.3em;\n  white-space: normal;\n  word-break: break-word;\n}\n\n.modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.5);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 999;\n  padding: 1rem;\n  box-sizing: border-box;\n}\n\n.modal-conteudo {\n  background: linear-gradient(#fef8e7, #f5e4bc);\n  border: 2px solid #8b5e3c;\n  border-radius: 10px;\n  max-width: 95vw;\n  max-height: 95vh;\n  width: 100%;\n  overflow-y: auto;\n  padding: 20px;\n  box-sizing: border-box;\n  font-family: \"MedievalSharp\", cursive;\n  position: relative;\n}\n\n.modal-titulo {\n  font-size: 1.5rem;\n  margin-bottom: 1rem;\n  text-align: center;\n  color: #5b3e1d;\n}\n\n.modal-opcoes {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.modal-opcoes h4 {\n  color: #5b3e1d;\n  margin: 1rem 0 0.5rem 0;\n  font-size: 1.1rem;\n}\n.modal-opcoes p {\n  color: #3b2a1a;\n  line-height: 1.5;\n  margin: 0.5rem 0;\n  font-size: 0.9rem;\n}\n.modal-opcoes ul {\n  margin: 0.5rem 0;\n  padding-left: 1.5rem;\n}\n.modal-opcoes ul li {\n  color: #3b2a1a;\n  line-height: 1.4;\n  margin-bottom: 0.5rem;\n  font-size: 0.9rem;\n}\n.modal-opcoes ul li strong {\n  color: #5b3e1d;\n}\n.modal-opcoes .contact-info {\n  font-style: italic;\n  color: #8b5e3c;\n  text-align: center;\n  margin-top: 1rem;\n  padding: 0.8rem;\n  background: rgba(139, 94, 60, 0.1);\n  border-radius: 6px;\n}\n\n.modal-botoes {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 1em;\n}\n.modal-botoes .button-medieval {\n  width: auto;\n  margin: 0;\n}\n\n@media (max-width: 768px) {\n  .consulta-layout {\n    padding: 0.5rem;\n    justify-content: flex-start;\n    min-height: auto;\n  }\n  .parchment-card {\n    max-width: 100%;\n    padding: 1rem;\n    margin: 1rem 0;\n  }\n  .medieval-disclaimer {\n    font-size: 0.95rem;\n    padding: 1rem 0.8rem;\n  }\n  .terms-section .terms-checkbox input[type=checkbox] {\n    width: 22px;\n    height: 22px;\n  }\n  .terms-section .terms-checkbox p {\n    font-size: 0.95rem;\n    text-align: center;\n  }\n  .modal-conteudo {\n    font-size: 0.9rem;\n    padding: 16px;\n    max-width: 98vw;\n    max-height: 98vh;\n  }\n  .modal-opcoes h4 {\n    font-size: 1rem;\n  }\n  .modal-opcoes p, .modal-opcoes ul li {\n    font-size: 0.85rem;\n  }\n  .modal-titulo {\n    font-size: 1.3rem;\n  }\n  .button-medieval {\n    width: 85%;\n  }\n}\n@media (max-width: 480px) {\n  .consulta-layout {\n    padding: 0.5rem;\n  }\n  .parchment-card {\n    max-width: 100%;\n    padding: 0.8rem;\n  }\n  .medieval-disclaimer {\n    font-size: 0.9rem;\n    padding: 0.8rem 0.6rem;\n  }\n  .terms-section .terms-checkbox p {\n    font-size: 0.9rem;\n    line-height: 1.3;\n  }\n  .modal-conteudo {\n    padding: 12px;\n    font-size: 0.85rem;\n  }\n  .modal-opcoes h4 {\n    font-size: 0.95rem;\n  }\n  .modal-opcoes p, .modal-opcoes ul li {\n    font-size: 0.8rem;\n  }\n  .modal-titulo {\n    font-size: 1.2rem;\n  }\n  .modal-botoes {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .modal-botoes .button-medieval {\n    width: 100%;\n  }\n  .button-medieval {\n    width: 90%;\n  }\n  .input-icon-group {\n    gap: 0.3rem;\n  }\n  .svg-icon {\n    width: 20px;\n    height: 20px;\n  }\n}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 3997:
/*!***********************************************************!*\
  !*** ./src/app/components/register/register.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegisterComponent: () => (/* binding */ RegisterComponent)
/* harmony export */ });
/* harmony import */ var C_Users_likka_Documents_Projetos_Pessoais_charlovinho_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ 7824);
/* harmony import */ var _register_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./register.component.html?ngResource */ 8047);
/* harmony import */ var _register_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./register.component.scss?ngResource */ 2347);
/* harmony import */ var _register_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_register_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/auth.service */ 4796);









let RegisterComponent = class RegisterComponent {
  constructor(router, fb, authService) {
    this.router = router;
    this.fb = fb;
    this.authService = authService;
    this.carregando = false;
    this.showTermsModal = false;
    this.showVerification = false;
    this.registeredEmail = '';
    this.erro = '';
    this.verificacaoErro = '';
    // Lista de domínios de email válidos
    this.validEmailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'yahoo.com.br', 'uol.com.br', 'bol.com.br', 'ig.com.br', 'terra.com.br', 'globo.com', 'live.com', 'msn.com', 'protonmail.com', 'icloud.com', 'me.com', 'aol.com', 'mail.com', 'yandex.com', 'zoho.com', 'gmx.com'];
    this.registerForm = this.fb.group({
      email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.email, this.emailDomainValidator.bind(this)]],
      char: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(2)]],
      password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(8), _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required]],
      acceptTerms: [false, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
    this.verificationForm = this.fb.group({
      code: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.maxLength(6)]]
    });
  }
  // Validador personalizado para domínio de email
  emailDomainValidator(control) {
    if (!control.value) return null;
    const email = control.value.toLowerCase();
    const domain = email.split('@')[1];
    if (!domain) return {
      invalidDomain: true
    };
    // Verificar se o domínio está na lista de domínios válidos
    if (!this.validEmailDomains.includes(domain)) {
      return {
        invalidDomain: true
      };
    }
    // Verificar domínios inválidos específicos
    const invalidDomains = ['teste.com', 'test.com', 'example.com', 'fake.com', 'invalid.com'];
    if (invalidDomains.includes(domain)) {
      return {
        invalidDomain: true
      };
    }
    return null;
  }
  // Validador para verificar se as senhas coincidem
  passwordMatchValidator(control) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({
        passwordMismatch: true
      });
      return {
        passwordMismatch: true
      };
    } else {
      if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }
  // Abrir modal de termos
  openTermsModal() {
    this.showTermsModal = true;
  }
  // Fechar modal de termos
  closeTermsModal() {
    this.showTermsModal = false;
  }
  // Aceitar termos (marca o checkbox automaticamente)
  acceptTerms() {
    this.registerForm.patchValue({
      acceptTerms: true
    });
    this.closeTermsModal();
  }
  // Submeter formulário
  onSubmit() {
    if (this.registerForm.valid) {
      this.carregando = true;
      this.erro = '';
      const formData = this.registerForm.value;
      this.authService.registerUser({
        email: formData.email,
        password: formData.password,
        char: formData.char
      }).subscribe({
        next: response => {
          if (response?.success) {
            this.registeredEmail = formData.email;
            this.showVerification = true;
          } else {
            this.erro = response.message || 'Erro no registro. Tente novamente.';
          }
          this.carregando = false;
        },
        error: error => {
          this.carregando = false;
          if (error.status === 400 && error.error?.message === 'Email já cadastrado') {
            this.erro = '<img src="assets/beer-mug.svg" alt="Criatura" class="svg-icon" /> Este email mágico já está registrado na taverna. Tente outro ou recupere seu juramento.';
          } else {
            this.erro = 'Erro ao registrar. Tente novamente.';
          }
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  // Validar código de verificação
  onVerifyCode() {
    var _this = this;
    return (0,C_Users_likka_Documents_Projetos_Pessoais_charlovinho_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.verificationForm.valid) {
        _this.carregando = true;
        _this.verificacaoErro = '';
        const formData = _this.verificationForm.value;
        try {
          const response = yield _this.authService.validateVerificationCode({
            email: _this.registeredEmail,
            code: formData.code
          }).toPromise();
          if (response?.success) {
            _this.carregando = false;
            // Redirecionar para login após sucesso
            _this.router.navigate(['/login']);
          } else {
            if (response?.message === 'Código inválido') {
              _this.verificacaoErro = '⚠️ O código mágico informado está incorreto. Confira o pergaminho enviado ao seu email e tente novamente!';
            } else {
              _this.verificacaoErro = response?.message || 'Erro na validação do código.';
            }
            _this.carregando = false;
          }
        } catch (error) {
          if (error?.status === 400 && error?.error?.message === 'Código inválido') {
            _this.verificacaoErro = '⚠️ O código mágico informado está incorreto. Confira o pergaminho enviado ao seu email e tente novamente!';
          } else {
            _this.verificacaoErro = 'Erro ao validar o código. Tente novamente.';
          }
          _this.carregando = false;
        }
      } else {
        // Marcar todos os campos como touched para mostrar erros
        Object.keys(_this.verificationForm.controls).forEach(key => {
          const control = _this.verificationForm.get(key);
          control?.markAsTouched();
        });
      }
    })();
  }
  // Voltar para o formulário de registro
  backToRegister() {
    this.showVerification = false;
    this.verificationForm.reset();
  }
  // Método legado para compatibilidade (pode ser removido se não for mais usado)
  register() {
    this.onSubmit();
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  static {
    this.ctorParameters = () => [{
      type: _angular_router__WEBPACK_IMPORTED_MODULE_5__.Router
    }, {
      type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder
    }, {
      type: _services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService
    }];
  }
};
RegisterComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.Component)({
  selector: 'app-register',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule],
  template: _register_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_register_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
}), (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__metadata)("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder, _services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService])], RegisterComponent);


/***/ }),

/***/ 8047:
/*!************************************************************************!*\
  !*** ./src/app/components/register/register.component.html?ngResource ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<div class=\"svg-loader-overlay\" *ngIf=\"carregando\">\r\n  <div class=\"svg-loader\">\r\n    <svg\r\n      fill=\"#000000\"\r\n      height=\"200px\"\r\n      width=\"200px\"\r\n      version=\"1.1\"\r\n      id=\"Capa_1\"\r\n      xmlns=\"http://www.w3.org/2000/svg\"\r\n      xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n      viewBox=\"0 0 452.022 452.022\"\r\n      xml:space=\"preserve\"\r\n    >\r\n      <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\r\n      <g\r\n        id=\"SVGRepo_tracerCarrier\"\r\n        stroke-linecap=\"round\"\r\n        stroke-linejoin=\"round\"\r\n      ></g>\r\n      <g id=\"SVGRepo_iconCarrier\">\r\n        <path\r\n          d=\"M440.761,380.351l-50.512-50.512l24.481-24.481c3.905-3.905,3.905-10.237,0-14.143c-3.905-3.904-10.237-3.904-14.143,0 l-9.494,9.494l-42.368-42.368c6.562-23.401,9.894-47.59,9.894-72l-0.001-153.69c0-4.777-3.379-8.887-8.065-9.811 c-113.629-22.402-228.859-22.402-342.488,0C3.379,23.764,0,27.875,0,32.652v153.69c0,55.105,16.721,108.08,48.356,153.2 c31.635,45.119,75.739,78.897,127.545,97.681c1.101,0.399,2.255,0.599,3.409,0.599c1.154,0,2.308-0.2,3.41-0.599 c40.392-14.651,76.722-38.923,105.694-70.5l18.334,18.334l-9.494,9.494c-3.905,3.905-3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929l24.481-24.481l50.512,50.512 c7.262,7.261,16.917,11.26,27.187,11.26s19.924-3.999,27.186-11.26c7.262-7.262,11.261-16.917,11.261-27.186 C452.022,397.268,448.023,387.613,440.761,380.351z M359.946,331.858l-3.954,3.954L162.901,142.72l45.434,3.515l168.616,168.617 L359.946,331.858z M303.621,186.342c0,8.507-0.522,16.987-1.523,25.371l-82.234-82.234c-1.687-1.687-3.921-2.715-6.3-2.899 l-76.09-5.886c-2.916-0.229-5.777,0.833-7.842,2.899c-2.065,2.065-3.124,4.93-2.899,7.842l5.886,76.09 c0.184,2.379,1.212,4.613,2.899,6.3L249.48,327.788c-19.637,21.998-43.181,39.294-70.167,51.487 c-34.45-15.596-64.093-40.179-85.924-71.304C68.275,272.143,55,230.084,55,186.342l0-110.473c82.527-15.788,166.093-15.788,248.62,0 V186.342z M179.309,417.156c-46.45-17.606-86.009-48.352-114.577-89.097C35.468,286.322,20,237.317,20,186.342l0-145.43 c105.764-19.83,212.856-19.83,318.62,0v145.43c0,18.764-2.131,37.386-6.331,55.563l-12.648-12.648 c2.637-14.044,3.979-28.452,3.979-42.915l-0.001-118.69c0-4.753-3.346-8.849-8.003-9.798c-90.445-18.438-182.167-18.438-272.614,0 C38.345,58.802,35,62.899,35,67.652v118.69c0,47.872,14.527,93.9,42.013,133.112c24.797,35.354,58.809,62.997,98.359,79.939 c1.257,0.539,2.597,0.808,3.938,0.808c1.34,0,2.68-0.269,3.937-0.808c31.01-13.282,57.997-32.593,80.394-57.444l10.618,10.618 C248.179,381.194,215.58,403.39,179.309,417.156z M152.273,202.297l-3.514-45.434l193.091,193.091l-20.96,20.959L152.273,202.297z M376.107,343.981l6.336,6.336l-15.345,36.829l-17.078-17.078L376.107,343.981z M382.392,402.44l15.345-36.829l11.178,11.178 l-15.345,36.829L382.392,402.44z M426.619,420.58L426.619,420.58c-3.483,3.484-8.116,5.403-13.043,5.403 c-1.141,0-2.262-0.114-3.361-0.315l13.994-33.585l2.41,2.41c3.484,3.484,5.403,8.116,5.403,13.043S430.103,417.096,426.619,420.58z\"\r\n        ></path>\r\n      </g>\r\n    </svg>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"parchment-background\">\r\n  <div class=\"consulta-layout\">\r\n    <h1 class=\"tavernatibiana-title\">Registro do Aventureiro</h1>\r\n\r\n    <!-- Formulário de Registro -->\r\n    <form\r\n      *ngIf=\"!showVerification\"\r\n      class=\"parchment-card\"\r\n      [formGroup]=\"registerForm\"\r\n      (ngSubmit)=\"onSubmit()\"\r\n    >\r\n      <!-- Mensagem do taberneiro -->\r\n      <div class=\"medieval-disclaimer\">\r\n        <p><img src=\"assets/beer-mug.svg\" alt=\"Criatura\" class=\"svg-icon\" />\r\n <strong>Saudações, nobre aventureiro!</strong></p>\r\n        <p>\r\n          Para registrar-se em nossa taverna, preencha o pergaminho abaixo com\r\n          seus dados mágicos.<br />\r\n          <strong>IMPORTANTE:</strong>\r\n          <span style=\"color: #b97a1a\">\r\n            NÃO use a mesma senha da sua conta do Tibia!</span\r\n          ><br />\r\n          A senha do portal deve ter pelo menos 8 caracteres, incluindo letras e\r\n          números.<br />\r\n          E <strong>lembre-se:</strong> aqui, sua privacidade é respeitada como\r\n          a receita do melhor hidromel!\r\n        </p>\r\n      </div>\r\n\r\n      <div *ngIf=\"erro\" class=\"login-error\">{{ erro }}</div>\r\n\r\n      <!-- Email Field -->\r\n      <div class=\"input-icon-group\">\r\n        <img src=\"assets/id-card.svg\" alt=\"Email\" class=\"svg-icon\" />\r\n        <input\r\n          id=\"email\"\r\n          class=\"input-medieval\"\r\n          type=\"email\"\r\n          formControlName=\"email\"\r\n          placeholder=\"Email mágico\"\r\n          required\r\n        />\r\n      </div>\r\n      <div\r\n        *ngIf=\"\r\n          registerForm.get('email')?.invalid &&\r\n          registerForm.get('email')?.touched\r\n        \"\r\n        class=\"login-error\"\r\n      >\r\n        <span *ngIf=\"registerForm.get('email')?.errors?.['required']\"\r\n          >Email é obrigatório</span\r\n        >\r\n        <span *ngIf=\"registerForm.get('email')?.errors?.['email']\"\r\n          >Formato de email inválido</span\r\n        >\r\n        <span *ngIf=\"registerForm.get('email')?.errors?.['invalidDomain']\"\r\n          >Domínio de email não permitido</span\r\n        >\r\n      </div>\r\n\r\n      <!-- Character Name Field -->\r\n      <div class=\"input-icon-group\">\r\n        <img src=\"assets/swordsman.svg\" alt=\"Personagem\" class=\"svg-icon\" />\r\n        <input\r\n          id=\"char\"\r\n          class=\"input-medieval\"\r\n          type=\"text\"\r\n          formControlName=\"char\"\r\n          placeholder=\"Nome do personagem no Tibia\"\r\n          required\r\n        />\r\n      </div>\r\n      <div\r\n        *ngIf=\"\r\n          registerForm.get('char')?.invalid &&\r\n          registerForm.get('char')?.touched\r\n        \"\r\n        class=\"login-error\"\r\n      >\r\n        <span *ngIf=\"registerForm.get('char')?.errors?.['required']\"\r\n          >Nome do personagem é obrigatório</span\r\n        >\r\n      </div>\r\n\r\n      <!-- Password Field -->\r\n      <div class=\"input-icon-group\">\r\n        <img src=\"assets/key-skills.svg\" alt=\"Senha\" class=\"svg-icon\" />\r\n        <input\r\n          id=\"password\"\r\n          class=\"input-medieval\"\r\n          type=\"password\"\r\n          formControlName=\"password\"\r\n          placeholder=\"Senha do portal (mín. 8 caracteres)\"\r\n          required\r\n        />\r\n      </div>\r\n      <div\r\n        *ngIf=\"\r\n          registerForm.get('password')?.invalid &&\r\n          registerForm.get('password')?.touched\r\n        \"\r\n        class=\"login-error\"\r\n      >\r\n        <span *ngIf=\"registerForm.get('password')?.errors?.['required']\"\r\n          >Senha é obrigatória</span\r\n        >\r\n        <span *ngIf=\"registerForm.get('password')?.errors?.['minlength']\"\r\n          >Senha deve ter pelo menos 8 caracteres</span\r\n        >\r\n        <span *ngIf=\"registerForm.get('password')?.errors?.['pattern']\"\r\n          >Senha deve conter letras e números</span\r\n        >\r\n      </div>\r\n\r\n      <!-- Confirm Password Field -->\r\n      <div class=\"input-icon-group\">\r\n        <img\r\n          src=\"assets/key-skills.svg\"\r\n          alt=\"Confirmar Senha\"\r\n          class=\"svg-icon\"\r\n        />\r\n        <input\r\n          id=\"confirmPassword\"\r\n          class=\"input-medieval\"\r\n          type=\"password\"\r\n          formControlName=\"confirmPassword\"\r\n          placeholder=\"Confirmar senha\"\r\n          required\r\n        />\r\n      </div>\r\n      <div\r\n        *ngIf=\"\r\n          registerForm.get('confirmPassword')?.invalid &&\r\n          registerForm.get('confirmPassword')?.touched\r\n        \"\r\n        class=\"login-error\"\r\n      >\r\n        <span *ngIf=\"registerForm.get('confirmPassword')?.errors?.['required']\"\r\n          >Confirmação de senha é obrigatória</span\r\n        >\r\n        <span\r\n          *ngIf=\"registerForm.get('confirmPassword')?.errors?.['passwordMismatch']\"\r\n          >Senhas não coincidem</span\r\n        >\r\n      </div>\r\n\r\n      <!-- Terms and Conditions -->\r\n      <div class=\"terms-section\">\r\n        <div class=\"terms-checkbox\">\r\n    \r\n          <p for=\"acceptTerms\">\r\n            <input\r\n            type=\"checkbox\"\r\n            id=\"acceptTerms\"\r\n            formControlName=\"acceptTerms\"\r\n          />\r\n            Li e aceito os\r\n            <button\r\n              type=\"button\"\r\n              class=\"medieval-link\"\r\n              (click)=\"openTermsModal()\"\r\n            >\r\n              Termos de Uso e Política de Privacidade\r\n            </button>\r\n          </p>\r\n        </div>\r\n        <div\r\n          *ngIf=\"\r\n            registerForm.get('acceptTerms')?.invalid &&\r\n            registerForm.get('acceptTerms')?.touched\r\n          \"\r\n          class=\"login-error\"\r\n        >\r\n          <span *ngIf=\"registerForm.get('acceptTerms')?.errors?.['required']\"\r\n            >Você deve aceitar os termos para continuar</span\r\n          >\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Submit Button -->\r\n      <button\r\n        class=\"button-medieval\"\r\n        type=\"submit\"\r\n        [disabled]=\"registerForm.invalid || carregando\"\r\n      >\r\n        <span *ngIf=\"!carregando\">Alistar-se na Guilda</span>\r\n        <span *ngIf=\"carregando\">Registrando...</span>\r\n      </button>\r\n\r\n    </form>\r\n\r\n    <!-- Login Links -->\r\n    <div class=\"login-links\">\r\n      <button class=\"medieval-link\" (click)=\"goToLogin()\">Já tens uma conta? Entrar na Taverna</button>\r\n    </div>\r\n\r\n    <!-- Formulário de Validação -->\r\n    <form\r\n      *ngIf=\"showVerification\"\r\n      class=\"parchment-card\"\r\n      [formGroup]=\"verificationForm\"\r\n      (ngSubmit)=\"onVerifyCode()\"\r\n    >\r\n      <!-- Mensagem da taberneira -->\r\n      <div class=\"medieval-disclaimer\">\r\n        <p><img src=\"assets/beer-mug.svg\" alt=\"Criatura\" class=\"svg-icon\" />\r\n <strong>Excelente, aventureiro!</strong></p>\r\n        <p>\r\n          Seu registro foi realizado com sucesso! Agora, para completar sua entrada\r\n          em nossa guilda, precisamos que você valide seu email mágico.<br />\r\n          <strong>Verifique sua caixa de entrada</strong> em \r\n          <span style=\"color: #b97a1a\">{{ registeredEmail }}</span><br />\r\n          e insira o código de 6 dígitos que enviamos para você.<br />\r\n          <em>Se não encontrar o email, verifique também a pasta de spam!</em>\r\n        </p>\r\n      </div>\r\n\r\n      <!-- Código de Verificação Field -->\r\n      <div *ngIf=\"verificacaoErro\" class=\"login-error\">{{ verificacaoErro }}</div>\r\n      <div class=\"input-icon-group\">\r\n        <img src=\"assets/key-skills.svg\" alt=\"Código\" class=\"svg-icon\" />\r\n        <input\r\n          id=\"code\"\r\n          class=\"input-medieval\"\r\n          type=\"text\"\r\n          formControlName=\"code\"\r\n          placeholder=\"Código de verificação (6 dígitos)\"\r\n          required\r\n          maxlength=\"6\"\r\n          pattern=\"[0-9]{6}\"\r\n        />\r\n      </div>\r\n      <div\r\n        *ngIf=\"\r\n          verificationForm.get('code')?.invalid &&\r\n          verificationForm.get('code')?.touched\r\n        \"\r\n        class=\"login-error\"\r\n      >\r\n        <span *ngIf=\"verificationForm.get('code')?.errors?.['required']\"\r\n          >Código é obrigatório</span\r\n        >\r\n        <span *ngIf=\"verificationForm.get('code')?.errors?.['minlength'] || verificationForm.get('code')?.errors?.['maxlength']\"\r\n          >Código deve ter exatamente 6 dígitos</span\r\n        >\r\n      </div>\r\n\r\n      <!-- Submit Button -->\r\n      <button\r\n        class=\"button-medieval\"\r\n        type=\"submit\"\r\n        [disabled]=\"verificationForm.invalid || carregando\"\r\n      >\r\n        <span *ngIf=\"!carregando\">Validar Código</span>\r\n        <span *ngIf=\"carregando\">Validando...</span>\r\n      </button>\r\n\r\n      <!-- Back Button -->\r\n      <div class=\"login-links\">\r\n        <button\r\n          type=\"button\"\r\n          class=\"medieval-link\"\r\n          (click)=\"backToRegister()\"\r\n        >\r\n          ← Voltar ao Registro\r\n        </button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n<!-- Terms Modal -->\r\n<div class=\"modal-overlay\" *ngIf=\"showTermsModal\" (click)=\"closeTermsModal()\">\r\n  <div class=\"modal-conteudo\" (click)=\"$event.stopPropagation()\">\r\n    <h3 class=\"modal-titulo\">📋 Termos de Uso e Política de Privacidade</h3>\r\n\r\n    <div class=\"modal-opcoes\">\r\n      <h4>🔒 Política de Privacidade (LGPD)</h4>\r\n      <p>\r\n        Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº\r\n        13.709/2018), informamos que:\r\n      </p>\r\n\r\n      <ul>\r\n        <li>\r\n          <strong>Coleta de Dados:</strong> Coletamos apenas informações\r\n          necessárias para o funcionamento do portal (email, nome do personagem\r\n          e senha do portal).\r\n        </li>\r\n        <li>\r\n          <strong>Uso dos Dados:</strong> Seus dados são utilizados\r\n          exclusivamente para autenticação e funcionalidades do portal Animous\r\n          Mastery.\r\n        </li>\r\n        <li>\r\n          <strong>Segurança:</strong> Implementamos medidas técnicas e\r\n          organizacionais para proteger seus dados pessoais.\r\n        </li>\r\n        <li>\r\n          <strong>Não Compartilhamento:</strong> Não compartilhamos, vendemos ou\r\n          alugamos suas informações pessoais a terceiros.\r\n        </li>\r\n        <li>\r\n          <strong>Seus Direitos:</strong> Você tem direito de acessar, corrigir,\r\n          excluir ou portar seus dados pessoais.\r\n        </li>\r\n      </ul>\r\n\r\n      <h4>⚠️ Declarações Importantes</h4>\r\n      <ul>\r\n        <li>\r\n          <strong>Não Malicioso:</strong> Este portal não possui fins maliciosos\r\n          e não coleta dados para prejudicar usuários.\r\n        </li>\r\n        <li>\r\n          <strong>Sem Acesso ao Tibia:</strong> Não temos e não tentaremos obter\r\n          acesso à sua conta do Tibia ou informações relacionadas ao jogo.\r\n        </li>\r\n        <li>\r\n          <strong>Independência:</strong> Este é um portal independente, não\r\n          afiliado oficialmente ao Tibia ou CipSoft.\r\n        </li>\r\n        <li>\r\n          <strong>Responsabilidade:</strong> O usuário é responsável por manter\r\n          a segurança de suas credenciais.\r\n        </li>\r\n      </ul>\r\n\r\n      <h4>📜 Termos de Uso</h4>\r\n      <ul>\r\n        <li>O uso deste portal é voluntário e gratuito.</li>\r\n        <li>\r\n          É proibido o uso para fins ilegais ou que violem os direitos de\r\n          terceiros.\r\n        </li>\r\n        <li>\r\n          Reservamo-nos o direito de modificar estes termos a qualquer momento.\r\n        </li>\r\n        <li>\r\n          O uso continuado do portal após mudanças nos termos constitui\r\n          aceitação das modificações.\r\n        </li>\r\n      </ul>\r\n\r\n      <p class=\"contact-info\">\r\n        Para dúvidas sobre esta política, entre em contato através do portal.\r\n      </p>\r\n    </div>\r\n\r\n    <div class=\"modal-botoes\">\r\n      <button type=\"button\" class=\"button-medieval\" (click)=\"acceptTerms()\">\r\n        Aceitar Termos\r\n      </button>\r\n      <button type=\"button\" class=\"button-medieval\" (click)=\"closeTermsModal()\">\r\n        Fechar\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>\r\n";

/***/ })

}]);
//# sourceMappingURL=src_app_components_register_register_component_ts.js.map