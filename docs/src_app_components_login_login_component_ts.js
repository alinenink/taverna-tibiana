(self["webpackChunktaverna_tibiana"] = self["webpackChunktaverna_tibiana"] || []).push([["src_app_components_login_login_component_ts"],{

/***/ 205:
/*!*****************************************************!*\
  !*** ./src/app/components/login/login.component.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginComponent: () => (/* binding */ LoginComponent)
/* harmony export */ });
/* harmony import */ var C_Users_likka_Documents_Projetos_Pessoais_charlovinho_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 7824);
/* harmony import */ var _login_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.component.html?ngResource */ 4215);
/* harmony import */ var _login_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login.component.scss?ngResource */ 247);
/* harmony import */ var _login_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_login_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/auth.service */ 4796);









let LoginComponent = class LoginComponent {
  constructor(router, authService) {
    this.router = router;
    this.authService = authService;
    this.email = '';
    this.password = '';
    this.carregando = false;
    this.erro = '';
  }
  login() {
    var _this = this;
    return (0,C_Users_likka_Documents_Projetos_Pessoais_charlovinho_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.carregando = true;
      _this.erro = '';
      const credentials = {
        email: _this.email,
        password: _this.password
      };
      try {
        const authObservable = yield _this.authService.authenticate(credentials);
        authObservable.subscribe({
          next: response => {
            if (response.success && response.token) {
              _this.authService.setAuthData(response.token, response.user, response.user_id);
              _this.carregando = false;
              _this.router.navigate(['/home']);
            } else {
              _this.erro = response.message || 'Erro na autenticação. Verifique suas credenciais.';
              _this.carregando = false;
            }
          },
          error: error => {
            _this.carregando = false;
            console.error('Erro na autenticação:', error);
            if (error.status === 401) {
              _this.erro = '<img src="assets/beer-mug.svg" alt="Criatura" class="svg-icon" /> Opa, nobre aventureiro! Tuas credenciais não foram reconhecidas pelo taberneiro. Confere teu email mágico e tua palavra-passe, e tenta novamente!';
            } else {
              _this.erro = 'Erro ao conectar com o servidor. Tente novamente.';
            }
          }
        });
      } catch (error) {
        _this.carregando = false;
        console.error('Erro ao processar autenticação:', error);
        _this.erro = 'Erro interno. Tente novamente.';
      }
    })();
  }
  static {
    this.ctorParameters = () => [{
      type: _angular_router__WEBPACK_IMPORTED_MODULE_4__.Router
    }, {
      type: _services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService
    }];
  }
};
LoginComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
  selector: 'app-login',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
  template: _login_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_login_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
}), (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__metadata)("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router, _services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService])], LoginComponent);


/***/ }),

/***/ 247:
/*!******************************************************************!*\
  !*** ./src/app/components/login/login.component.scss?ngResource ***!
  \******************************************************************/
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
}

.parchment-card {
  max-width: 350px;
  margin: 0 auto;
}

input.input-medieval {
  flex: 1;
  margin-bottom: 1rem;
}

.button-medieval {
  width: 100%;
  margin-top: 1rem;
}

.login-error {
  color: #992e2e;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  font-family: "MedievalSharp", serif;
}

.input-icon-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.login-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  font-family: "MedievalSharp", serif;
}

.medieval-link {
  color: #7b5e3b;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.2s;
}

.medieval-link:hover {
  color: #a88d5a;
}

.medieval-link-sep {
  color: #a67c52;
  font-weight: bold;
  font-size: 1.2em;
  margin: 0 0.2em;
  -webkit-user-select: none;
          user-select: none;
}`, "",{"version":3,"sources":["webpack://./src/app/components/login/login.component.scss","webpack://./../../Projetos%20Pessoais/charlovinho/src/app/components/login/login.component.scss"],"names":[],"mappings":"AAAA;EACE,iBAAA;EACA,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,uBAAA;ACCF;;ADEA;EACE,gBAAA;EACA,cAAA;ACCF;;ADEA;EACE,OAAA;EACA,mBAAA;ACCF;;ADEA;EACE,WAAA;EACA,gBAAA;ACCF;;ADEA;EACE,cAAA;EACA,iBAAA;EACA,mBAAA;EACA,kBAAA;EACA,mCAAA;ACCF;;ADEA;EACE,aAAA;EACA,mBAAA;EACA,WAAA;EACA,mBAAA;ACCF;;ADEA;EACE,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,WAAA;EACA,kBAAA;EACA,mCAAA;ACCF;;ADEA;EACE,cAAA;EACA,0BAAA;EACA,eAAA;EACA,iBAAA;EACA,sBAAA;ACCF;;ADEA;EACE,cAAA;ACCF;;ADEA;EACE,cAAA;EACA,iBAAA;EACA,gBAAA;EACA,eAAA;EACA,yBAAA;UAAA,iBAAA;ACCF","sourcesContent":[".consulta-layout {\r\n  min-height: 100vh;\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n.parchment-card {\r\n  max-width: 350px;\r\n  margin: 0 auto;\r\n}\r\n\r\ninput.input-medieval {\r\n  flex: 1;\r\n  margin-bottom: 1rem;\r\n}\r\n\r\n.button-medieval {\r\n  width: 100%;\r\n  margin-top: 1rem;\r\n}\r\n\r\n.login-error {\r\n  color: #992e2e;\r\n  font-weight: bold;\r\n  margin-bottom: 1rem;\r\n  text-align: center;\r\n  font-family: 'MedievalSharp', serif;\r\n}\r\n\r\n.input-icon-group {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  margin-bottom: 1rem;\r\n}\r\n\r\n.login-links {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  gap: 1.5rem;\r\n  margin-top: 1.5rem;\r\n  font-family: 'MedievalSharp', serif;\r\n}\r\n\r\n.medieval-link {\r\n  color: #7b5e3b;\r\n  text-decoration: underline;\r\n  cursor: pointer;\r\n  font-weight: bold;\r\n  transition: color 0.2s;\r\n}\r\n\r\n.medieval-link:hover {\r\n  color: #a88d5a;\r\n}\r\n\r\n.medieval-link-sep {\r\n  color: #a67c52;\r\n  font-weight: bold;\r\n  font-size: 1.2em;\r\n  margin: 0 0.2em;\r\n  user-select: none;\r\n} ",".consulta-layout {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n\n.parchment-card {\n  max-width: 350px;\n  margin: 0 auto;\n}\n\ninput.input-medieval {\n  flex: 1;\n  margin-bottom: 1rem;\n}\n\n.button-medieval {\n  width: 100%;\n  margin-top: 1rem;\n}\n\n.login-error {\n  color: #992e2e;\n  font-weight: bold;\n  margin-bottom: 1rem;\n  text-align: center;\n  font-family: \"MedievalSharp\", serif;\n}\n\n.input-icon-group {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 1rem;\n}\n\n.login-links {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1.5rem;\n  margin-top: 1.5rem;\n  font-family: \"MedievalSharp\", serif;\n}\n\n.medieval-link {\n  color: #7b5e3b;\n  text-decoration: underline;\n  cursor: pointer;\n  font-weight: bold;\n  transition: color 0.2s;\n}\n\n.medieval-link:hover {\n  color: #a88d5a;\n}\n\n.medieval-link-sep {\n  color: #a67c52;\n  font-weight: bold;\n  font-size: 1.2em;\n  margin: 0 0.2em;\n  user-select: none;\n}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 4215:
/*!******************************************************************!*\
  !*** ./src/app/components/login/login.component.html?ngResource ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<div class=\"parchment-background\">\r\n  <div class=\"consulta-layout\">\r\n    <h1 class=\"tavernatibiana-title\">Bem-vindo à Taverna Tibiana</h1>\r\n    <form class=\"parchment-card\" (ngSubmit)=\"login()\">\r\n      <h2>Juramento de Entrada</h2>\r\n      <hr />\r\n      <div *ngIf=\"erro\" class=\"login-error\">{{ erro }}</div>\r\n      <div class=\"input-icon-group\">\r\n        <img src=\"assets/wizard.svg\" alt=\"Email\" class=\"svg-icon\" />\r\n        <input\r\n          id=\"email\"\r\n          class=\"input-medieval\"\r\n          type=\"email\"\r\n          [(ngModel)]=\"email\"\r\n          name=\"email\"\r\n          placeholder=\"Email mágico\"\r\n          required\r\n        />\r\n      </div>\r\n      <div class=\"input-icon-group\">\r\n        <img src=\"assets/key-skills.svg\" alt=\"Senha\" class=\"svg-icon\" />\r\n        <input\r\n          id=\"password\"\r\n          class=\"input-medieval\"\r\n          type=\"password\"\r\n          [(ngModel)]=\"password\"\r\n          name=\"password\"\r\n          placeholder=\"Palavra-passe da Irmandade\"\r\n          required\r\n        />\r\n      </div>\r\n      <button\r\n        class=\"button-medieval\"\r\n        type=\"submit\"\r\n        [disabled]=\"carregando || !email || !password\"\r\n      >\r\n        Adentrar a Taverna\r\n      </button>\r\n      <div class=\"login-links\">\r\n        <a routerLink=\"/register\" class=\"medieval-link\">Alistar-se na Guilda</a>\r\n        <span class=\"medieval-link-sep\">|</span>\r\n        <a routerLink=\"/forgot-password\" class=\"medieval-link\"\r\n          >Esqueceste teu juramento?</a\r\n        >\r\n      </div>\r\n      <div *ngIf=\"carregando\" class=\"svg-loader-overlay\">\r\n        <div class=\"svg-loader\">\r\n          <!-- Loader SVG permanece igual -->\r\n          <svg\r\n            fill=\"#000000\"\r\n            height=\"80px\"\r\n            width=\"80px\"\r\n            viewBox=\"0 0 452.022 452.022\"\r\n          >\r\n            <g id=\"SVGRepo_iconCarrier\">\r\n              <path d=\"...\" />\r\n            </g>\r\n          </svg>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n";

/***/ })

}]);
//# sourceMappingURL=src_app_components_login_login_component_ts.js.map