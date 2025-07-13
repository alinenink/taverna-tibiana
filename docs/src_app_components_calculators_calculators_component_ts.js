(self["webpackChunktaverna_tibiana"] = self["webpackChunktaverna_tibiana"] || []).push([["src_app_components_calculators_calculators_component_ts"],{

/***/ 2815:
/*!******************************************************************************!*\
  !*** ./src/app/components/calculators/calculators.component.html?ngResource ***!
  \******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<div class=\"svg-loader-overlay\" *ngIf=\"carregando\">\r\n  <div class=\"svg-loader\">\r\n    <svg\r\n      fill=\"#000000\"\r\n      height=\"200px\"\r\n      width=\"200px\"\r\n      version=\"1.1\"\r\n      id=\"Capa_1\"\r\n      xmlns=\"http://www.w3.org/2000/svg\"\r\n      xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n      viewBox=\"0 0 452.022 452.022\"\r\n      xml:space=\"preserve\"\r\n    >\r\n      <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\r\n      <g\r\n        id=\"SVGRepo_tracerCarrier\"\r\n        stroke-linecap=\"round\"\r\n        stroke-linejoin=\"round\"\r\n      ></g>\r\n      <g id=\"SVGRepo_iconCarrier\">\r\n        <path\r\n          d=\"M440.761,380.351l-50.512-50.512l24.481-24.481c3.905-3.905,3.905-10.237,0-14.143c-3.905-3.904-10.237-3.904-14.143,0 l-9.494,9.494l-42.368-42.368c6.562-23.401,9.894-47.59,9.894-72l-0.001-153.69c0-4.777-3.379-8.887-8.065-9.811 c-113.629-22.402-228.859-22.402-342.488,0C3.379,23.764,0,27.875,0,32.652v153.69c0,55.105,16.721,108.08,48.356,153.2 c31.635,45.119,75.739,78.897,127.545,97.681c1.101,0.399,2.255,0.599,3.409,0.599c1.154,0,2.308-0.2,3.41-0.599 c40.392-14.651,76.722-38.923,105.694-70.5l18.334,18.334l-9.494,9.494c-3.905,3.905,3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929l24.481-24.481l50.512,50.512 c7.262,7.261,16.917,11.26,27.187,11.26s19.924-3.999,27.186-11.26c7.262-7.262,11.261-16.917,11.261-27.186 C452.022,397.268,448.023,387.613,440.761,380.351z\"\r\n        ></path>\r\n      </g>\r\n    </svg>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"parchment-background\">\r\n  <div class=\"consulta-layout\">\r\n    <h1 class=\"tavernatibiana-title\">Calculadoras Mágicas</h1>\r\n\r\n    <!-- Disclaimer Medieval -->\r\n    <div class=\"parchment-card medieval-disclaimer\">\r\n      <button class=\"voltar-button-card\" [routerLink]=\"'/home'\">Voltar</button>\r\n      <div\r\n        style=\"\r\n          display: flex;\r\n          align-items: center;\r\n          gap: 0.3rem;\r\n          margin-bottom: 0.5rem;\r\n        \"\r\n      >\r\n        <img\r\n          src=\"assets/budget.svg\"\r\n          alt=\"Calculadora\"\r\n          class=\"svg-icon intro-icon\"\r\n        />\r\n        <strong class=\"medieval-text\"\r\n          >Bem-vindo ao Laboratório de Cálculos, aventureiro!</strong\r\n        >\r\n      </div>\r\n      <p class=\"medieval-intro\">\r\n        Aqui, na taverna, os números também contam histórias! Use nossas\r\n        ferramentas mágicas para planejar suas <strong>armas de treino</strong>,\r\n        recuperar <strong>stamina</strong> e dividir o <strong>loot</strong> do\r\n        seu grupo com justiça.<br />\r\n        Escolha a calculadora desejada, preencha os campos e deixe a magia dos\r\n        cálculos facilitar sua jornada. Que seus resultados sejam sempre\r\n        lendários!\r\n      </p>\r\n\r\n      <!-- Abas de seleção -->\r\n      <div class=\"filtro-topo\">\r\n        <button\r\n          class=\"button-medieval\"\r\n          [class.ordenavel]=\"activeCalculator === 'exercise-weapons'\"\r\n          (click)=\"setCalculator('exercise-weapons')\"\r\n        >\r\n          <img\r\n            src=\"assets/exerciseweapons.svg\"\r\n            alt=\"Exercise Weapons\"\r\n            class=\"svg-icon\"\r\n          />\r\n          Exercise Weapons\r\n        </button>\r\n        <button\r\n          class=\"button-medieval\"\r\n          [class.ordenavel]=\"activeCalculator === 'stamina'\"\r\n          (click)=\"setCalculator('stamina')\"\r\n        >\r\n          <img src=\"assets/stamina.svg\" alt=\"Stamina\" class=\"svg-icon\" />\r\n          Stamina\r\n        </button>\r\n        <!--\r\n        <button class=\"button-medieval\" [class.ordenavel]=\"activeCalculator === 'charm-damage'\" (click)=\"setCalculator('charm-damage')\">\r\n          <img src=\"assets/star.svg\" alt=\"Charm Damage\" class=\"svg-icon\" />\r\n          Charm Damage\r\n        </button>\r\n        -->\r\n        <button\r\n          class=\"button-medieval\"\r\n          [class.ordenavel]=\"activeCalculator === 'loot-split'\"\r\n          (click)=\"setCalculator('loot-split')\"\r\n        >\r\n          <img\r\n            src=\"assets/item-bag-svgrepo-com.svg\"\r\n            alt=\"Loot Split\"\r\n            class=\"svg-icon\"\r\n          />\r\n          Loot Split\r\n        </button>\r\n      </div>\r\n\r\n\r\n\r\n      <!-- Exercise Weapons Calculator -->\r\n      <div\r\n        class=\"parchment-card\"\r\n        *ngIf=\"activeCalculator === 'exercise-weapons'\"\r\n      >\r\n        <h2>Calculadora de Exercise Weapons</h2>\r\n        <hr />\r\n        <form class=\"calculator-form\" (ngSubmit)=\"submitExerciseWeapons()\">\r\n          <div class=\"form-row\">\r\n            <div class=\"form-col\">\r\n              <label>Vocação:</label>\r\n              <select\r\n                class=\"input-medieval select-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.vocation\"\r\n                name=\"vocation\"\r\n                required\r\n              >\r\n                <option value=\"\" disabled selected hidden>Selecione</option>\r\n                <option value=\"knight\">Knight</option>\r\n                <option value=\"paladin\">Paladin</option>\r\n                <option value=\"sorcerer\">Sorcerer</option>\r\n                <option value=\"druid\">Druid</option>\r\n                <option value=\"monk\">Monk</option>\r\n              </select>\r\n            </div>\r\n            <div class=\"form-col\">\r\n              <label>Skill:</label>\r\n              <select\r\n                class=\"input-medieval select-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.skill\"\r\n                name=\"skill\"\r\n                required\r\n              >\r\n                <option value=\"\" disabled selected hidden>Selecione</option>\r\n                <option value=\"melee\">Axe/Club/Sword</option>\r\n                <option value=\"distance\">Distance</option>\r\n                <option value=\"magic\">Magic level</option>\r\n                <option value=\"shield\">Shield</option>\r\n                <option value=\"fist\">Fist</option>\r\n              </select>\r\n            </div>\r\n          </div>\r\n          <div class=\"form-row\">\r\n            <div class=\"form-col\">\r\n              <label>Skill atual:</label>\r\n              <input\r\n                type=\"number\"\r\n                class=\"input-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.currentSkill\"\r\n                name=\"currentSkill\"\r\n                min=\"1\"\r\n                max=\"200\"\r\n                required\r\n              />\r\n            </div>\r\n            <div class=\"form-col\">\r\n              <label>Skill desejado:</label>\r\n              <input\r\n                type=\"number\"\r\n                class=\"input-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.targetSkill\"\r\n                name=\"targetSkill\"\r\n                min=\"1\"\r\n                max=\"200\"\r\n                required\r\n              />\r\n            </div>\r\n          </div>\r\n          <div class=\"form-row\">\r\n            <div class=\"form-col\">\r\n              <label>% Restante:</label>\r\n              <input\r\n                type=\"range\"\r\n                class=\"input-medieval range-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.percentageLeft\"\r\n                name=\"percentageLeft\"\r\n                min=\"0\"\r\n                max=\"100\"\r\n              />\r\n              <span>{{ exerciseWeaponForm.percentageLeft }}%</span>\r\n            </div>\r\n            <div class=\"form-col\">\r\n              <label>Loyalty:</label>\r\n              <input\r\n                type=\"range\"\r\n                class=\"input-medieval range-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.loyaltyBonus\"\r\n                name=\"loyaltyBonus\"\r\n                min=\"0\"\r\n                max=\"50\"\r\n                step=\"5\"\r\n              />\r\n              <span>{{ exerciseWeaponForm.loyaltyBonus }}%</span>\r\n            </div>\r\n          </div>\r\n          <div class=\"form-row\">\r\n            <div class=\"form-col\">\r\n              <label\r\n                ><input\r\n                  type=\"checkbox\"\r\n                  class=\"checkbox-medieval\"\r\n                  [(ngModel)]=\"exerciseWeaponForm.hasDummy\"\r\n                  name=\"hasDummy\"\r\n                />\r\n                Exercise dummy</label\r\n              >\r\n              <label\r\n                ><input\r\n                  type=\"checkbox\"\r\n                  class=\"checkbox-medieval\"\r\n                  [(ngModel)]=\"exerciseWeaponForm.isDouble\"\r\n                  name=\"isDouble\"\r\n                />\r\n                Double event</label\r\n              >\r\n            </div>\r\n            <div class=\"form-col\">\r\n              <label>Tipo de arma:</label>\r\n              <select\r\n                class=\"input-medieval select-medieval\"\r\n                [(ngModel)]=\"exerciseWeaponForm.weaponType\"\r\n                name=\"weaponType\"\r\n                required\r\n              >\r\n                <option value=\"\" disabled selected hidden>Selecione</option>\r\n                <option value=\"auto\">Auto</option>\r\n                <option value=\"regular\">Regular</option>\r\n                <option value=\"durable\">Durable</option>\r\n                <option value=\"lasting\">Lasting</option>\r\n              </select>\r\n            </div>\r\n          </div>\r\n          <div class=\"calculator-actions\">\r\n            <button\r\n              type=\"submit\"\r\n              class=\"button-medieval\"\r\n              [disabled]=\"\r\n                isLoadingExercise ||\r\n                !exerciseWeaponForm.vocation ||\r\n                !exerciseWeaponForm.skill ||\r\n                !exerciseWeaponForm.weaponType\r\n              \"\r\n            >\r\n              Calcular\r\n            </button>\r\n            <button\r\n              type=\"button\"\r\n              class=\"button-medieval\"\r\n              (click)=\"resetExerciseWeapons()\"\r\n            >\r\n              Limpar\r\n            </button>\r\n          </div>\r\n        </form>\r\n        <div *ngIf=\"isLoadingExercise\" class=\"result-display\">\r\n          <div class=\"svg-loader-overlay\" style=\"position: relative; height: 100px;\">\r\n            <div class=\"svg-loader\">\r\n              <svg\r\n                fill=\"#000000\"\r\n                height=\"200px\"\r\n                width=\"200px\"\r\n                version=\"1.1\"\r\n                id=\"Capa_1\"\r\n                xmlns=\"http://www.w3.org/2000/svg\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n                viewBox=\"0 0 452.022 452.022\"\r\n                xml:space=\"preserve\"\r\n              >\r\n                <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\r\n                <g\r\n                  id=\"SVGRepo_tracerCarrier\"\r\n                  stroke-linecap=\"round\"\r\n                  stroke-linejoin=\"round\"\r\n                ></g>\r\n                <g id=\"SVGRepo_iconCarrier\">\r\n                  <path\r\n                    d=\"M440.761,380.351l-50.512-50.512l24.481-24.481c3.905-3.905,3.905-10.237,0-14.143c-3.905-3.904-10.237-3.904-14.143,0 l-9.494,9.494l-42.368-42.368c6.562-23.401,9.894-47.59,9.894-72l-0.001-153.69c0-4.777-3.379-8.887-8.065-9.811 c-113.629-22.402-228.859-22.402-342.488,0C3.379,23.764,0,27.875,0,32.652v153.69c0,55.105,16.721,108.08,48.356,153.2 c31.635,45.119,75.739,78.897,127.545,97.681c1.101,0.399,2.255,0.599,3.409,0.599c1.154,0,2.308-0.2,3.41-0.599 c40.392-14.651,76.722-38.923,105.694-70.5l18.334,18.334l-9.494,9.494c-3.905,3.905-3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929l24.481-24.481l50.512,50.512 c7.262,7.261,16.917,11.26,27.187,11.26s19.924-3.999,27.186-11.26c7.262-7.262,11.261-16.917,11.261-27.186 C452.022,397.268,448.023,387.613,440.761,380.351z\"\r\n                  ></path>\r\n                </g>\r\n              </svg>\r\n            </div>\r\n          </div>\r\n          <p style=\"text-align: center; margin-top: 1rem; font-family: 'MedievalSharp', serif; color: #7a5a2f;\">\r\n            Calculando armas de treino...\r\n          </p>\r\n        </div>\r\n        <div *ngIf=\"exerciseWeaponsError\" class=\"result-display\">\r\n          {{ exerciseWeaponsError }}\r\n        </div>\r\n        <div *ngIf=\"exerciseWeaponsResult\" class=\"exercise-result-medieval\">\r\n          <h3>Resultado:</h3>\r\n          <div class=\"result-row\">\r\n            <img\r\n              src=\"assets/exerciseweapons.svg\"\r\n              alt=\"Armas\"\r\n              class=\"result-icon\"\r\n            />\r\n            <span class=\"result-label\">Armas necessárias:</span>\r\n            <span\r\n              >Lasting:\r\n              <b>{{ exerciseWeaponsResult.weaponsRequired.lasting }}x</b></span\r\n            >\r\n            |\r\n            <span\r\n              >Durable:\r\n              <b>{{ exerciseWeaponsResult.weaponsRequired.durable }}x</b></span\r\n            >\r\n            |\r\n            <span\r\n              >Regular:\r\n              <b>{{ exerciseWeaponsResult.weaponsRequired.regular }}x</b></span\r\n            >\r\n          </div>\r\n          <div class=\"result-row\">\r\n            <img src=\"assets/coin.svg\" alt=\"Gold\" class=\"result-icon\" />\r\n            <span class=\"result-label\">Gold:</span>\r\n            <span\r\n              ><b>{{ exerciseWeaponsResult.cost.gold | number }}</b></span\r\n            >\r\n            |\r\n            <img\r\n              src=\"assets/tibiacoin.svg\"\r\n              alt=\"TC\"\r\n              class=\"result-icon\"\r\n              style=\"margin-left: 1.2em\"\r\n            />\r\n            <span class=\"result-label\">TC:</span>\r\n            <span\r\n              ><b>{{ exerciseWeaponsResult.cost.tc }}</b></span\r\n            >\r\n          </div>\r\n          <div class=\"result-row\">\r\n            <img src=\"assets/tempo.svg\" alt=\"Tempo\" class=\"result-icon\" />\r\n            <span class=\"result-label\">Tempo necessário:</span>\r\n            <span\r\n              ><b>{{ exerciseWeaponsResult.timeRequired }}</b></span\r\n            >\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Stamina Calculator -->\r\n      <div class=\"parchment-card\" *ngIf=\"activeCalculator === 'stamina'\">\r\n        <h2><span style=\"color: #bfa66b; font-size: 1.3em;\">⭐</span> Calculadora de Stamina</h2>\r\n        <hr />\r\n        <form class=\"calculator-form stamina-form-medieval\" (ngSubmit)=\"submitStamina()\" autocomplete=\"off\">\r\n          <div class=\"stamina-fields-row grid-stamina\">\r\n            <div class=\"stamina-field-col\">\r\n              <label for=\"currentStamina\">Stamina atual:</label>\r\n              <div class=\"time-input-group\">\r\n                <input\r\n                  id=\"currentStaminaHours\"\r\n                  type=\"number\"\r\n                  min=\"0\"\r\n                  max=\"42\"\r\n                  [ngModel]=\"staminaCurrent.hours\"\r\n                  (ngModelChange)=\"onStaminaTimeChange('current', $event + ':' + staminaCurrent.minutes)\"\r\n                  name=\"currentStaminaHours\"\r\n                  class=\"input-medieval time-input\"\r\n                  [class.input-error]=\"staminaInvalid\"\r\n                  (keydown.arrowup)=\"incHour('current')\"\r\n                  (keydown.arrowdown)=\"decHour('current')\"\r\n                  autocomplete=\"off\"\r\n                />\r\n                <span class=\"time-sep\">:</span>\r\n                <input\r\n                  id=\"currentStaminaMinutes\"\r\n                  type=\"number\"\r\n                  min=\"0\"\r\n                  max=\"59\"\r\n                  [ngModel]=\"staminaCurrent.minutes\"\r\n                  (ngModelChange)=\"onStaminaTimeChange('current', staminaCurrent.hours + ':' + $event)\"\r\n                  name=\"currentStaminaMinutes\"\r\n                  class=\"input-medieval time-input\"\r\n                  [class.input-error]=\"staminaInvalid\"\r\n                  (keydown.arrowup)=\"incMin('current')\"\r\n                  (keydown.arrowdown)=\"decMin('current')\"\r\n                  autocomplete=\"off\"\r\n                />\r\n              </div>\r\n            </div>\r\n            <div class=\"stamina-chevron\">\r\n              <svg [ngClass]=\"{'chevron-error': staminaInvalid}\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M9 6l6 6-6 6\"/></svg>\r\n            </div>\r\n            <div class=\"stamina-field-col\">\r\n              <label for=\"targetStamina\">Stamina desejada:</label>\r\n              <div class=\"time-input-group\">\r\n                <input\r\n                  id=\"targetStaminaHours\"\r\n                  type=\"number\"\r\n                  min=\"0\"\r\n                  max=\"42\"\r\n                  [ngModel]=\"staminaTarget.hours\"\r\n                  (ngModelChange)=\"onStaminaTimeChange('target', $event + ':' + staminaTarget.minutes)\"\r\n                  name=\"targetStaminaHours\"\r\n                  class=\"input-medieval time-input\"\r\n                  [class.input-error]=\"staminaInvalid\"\r\n                  (keydown.arrowup)=\"incHour('target')\"\r\n                  (keydown.arrowdown)=\"decHour('target')\"\r\n                  autocomplete=\"off\"\r\n                />\r\n                <span class=\"time-sep\">:</span>\r\n                <input\r\n                  id=\"targetStaminaMinutes\"\r\n                  type=\"number\"\r\n                  min=\"0\"\r\n                  max=\"59\"\r\n                  [ngModel]=\"staminaTarget.minutes\"\r\n                  (ngModelChange)=\"onStaminaTimeChange('target', staminaTarget.hours + ':' + $event)\"\r\n                  name=\"targetStaminaMinutes\"\r\n                  class=\"input-medieval time-input\"\r\n                  [class.input-error]=\"staminaInvalid\"\r\n                  (keydown.arrowup)=\"incMin('target')\"\r\n                  (keydown.arrowdown)=\"decMin('target')\"\r\n                  autocomplete=\"off\"\r\n                />\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"stamina-actions-row\">\r\n            <button\r\n              type=\"submit\"\r\n              class=\"button-medieval\"\r\n              [disabled]=\"isLoadingStamina || staminaInvalid\"\r\n            >\r\n              Calcular\r\n            </button>\r\n            <button\r\n              type=\"button\"\r\n              class=\"button-medieval\"\r\n              (click)=\"resetStamina()\"\r\n            >\r\n              Limpar\r\n            </button>\r\n          </div>\r\n        </form>\r\n        <div *ngIf=\"isLoadingStamina\" class=\"result-display\">\r\n          <div class=\"svg-loader-overlay\" style=\"position: relative; height: 100px;\">\r\n            <div class=\"svg-loader\">\r\n              <svg\r\n                fill=\"#000000\"\r\n                height=\"200px\"\r\n                width=\"200px\"\r\n                version=\"1.1\"\r\n                id=\"Capa_1\"\r\n                xmlns=\"http://www.w3.org/2000/svg\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n                viewBox=\"0 0 452.022 452.022\"\r\n                xml:space=\"preserve\"\r\n              >\r\n                <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\r\n                <g\r\n                  id=\"SVGRepo_tracerCarrier\"\r\n                  stroke-linecap=\"round\"\r\n                  stroke-linejoin=\"round\"\r\n                ></g>\r\n                <g id=\"SVGRepo_iconCarrier\">\r\n                  <path\r\n                    d=\"M440.761,380.351l-50.512-50.512l24.481-24.481c3.905-3.905,3.905-10.237,0-14.143c-3.905-3.904-10.237-3.904-14.143,0 l-9.494,9.494l-42.368-42.368c6.562-23.401,9.894-47.59,9.894-72l-0.001-153.69c0-4.777-3.379-8.887-8.065-9.811 c-113.629-22.402-228.859-22.402-342.488,0C3.379,23.764,0,27.875,0,32.652v153.69c0,55.105,16.721,108.08,48.356,153.2 c31.635,45.119,75.739,78.897,127.545,97.681c1.101,0.399,2.255,0.599,3.409,0.599c1.154,0,2.308-0.2,3.41-0.599 c40.392-14.651,76.722-38.923,105.694-70.5l18.334,18.334l-9.494,9.494c-3.905,3.905-3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929l24.481-24.481l50.512,50.512 c7.262,7.261,16.917,11.26,27.187,11.26s19.924-3.999,27.186-11.26c7.262-7.262,11.261-16.917,11.261-27.186 C452.022,397.268,448.023,387.613,440.761,380.351z\"\r\n                  ></path>\r\n                </g>\r\n              </svg>\r\n            </div>\r\n          </div>\r\n          <p style=\"text-align: center; margin-top: 1rem; font-family: 'MedievalSharp', serif; color: #7a5a2f;\">\r\n            Calculando stamina...\r\n          </p>\r\n        </div>\r\n        <div *ngIf=\"staminaError\" class=\"result-display\">\r\n          {{ staminaError }}\r\n        </div>\r\n        <div *ngIf=\"staminaResult\" class=\"stamina-result-medieval\">\r\n          <h3>Resultado:</h3>\r\n          <div class=\"stamina-result-row\">\r\n            <span class=\"stamina-result-label\">Segundos para regenerar:</span>\r\n            <span class=\"stamina-result-value\">{{ staminaResult.secondsToRegenerate | number }}</span>\r\n          </div>\r\n          <div class=\"stamina-result-row\">\r\n            <span class=\"stamina-result-label\">Tempo estimado:</span>\r\n            <span class=\"stamina-result-value\">\r\n              {{ staminaResult.estimatedTime.day }}/{{ staminaResult.estimatedTime.month }}\r\n              - {{ staminaResult.estimatedTime.hours }}h{{ staminaResult.estimatedTime.minutes }}m\r\n              ({{ staminaResult.estimatedTime.weekday }})\r\n            </span>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Charm Damage Calculator -->\r\n      <div class=\"parchment-card\" *ngIf=\"activeCalculator === 'charm-damage'\">\r\n        <h2>✨ Calculadora de Dano de Charm</h2>\r\n        <hr />\r\n        <form class=\"calculator-form\" (ngSubmit)=\"submitCharmDamage()\">\r\n          <div class=\"input-icon-group\">\r\n            <label>Dano médio:</label>\r\n            <input\r\n              type=\"number\"\r\n              class=\"input-medieval\"\r\n              [(ngModel)]=\"charmDamageForm.averageDamage\"\r\n              name=\"averageDamage\"\r\n              min=\"1\"\r\n            />\r\n          </div>\r\n          <div class=\"input-icon-group\">\r\n            <label>HP da criatura:</label>\r\n            <input\r\n              type=\"number\"\r\n              class=\"input-medieval\"\r\n              [(ngModel)]=\"charmDamageForm.creatureHp\"\r\n              name=\"creatureHp\"\r\n              min=\"1\"\r\n            />\r\n          </div>\r\n          <div class=\"input-icon-group\">\r\n            <label>Resistência bônus (%):</label>\r\n            <input\r\n              type=\"number\"\r\n              class=\"input-medieval\"\r\n              [(ngModel)]=\"charmDamageForm.bonusResistance\"\r\n              name=\"bonusResistance\"\r\n              min=\"0\"\r\n              max=\"100\"\r\n            />\r\n          </div>\r\n          <div class=\"input-icon-group\">\r\n            <label\r\n              ><input\r\n                type=\"checkbox\"\r\n                [(ngModel)]=\"charmDamageForm.powerful\"\r\n                name=\"powerful\"\r\n              />\r\n              Powerful</label\r\n            >\r\n          </div>\r\n          <div class=\"calculator-actions\">\r\n            <button\r\n              type=\"submit\"\r\n              class=\"button-medieval\"\r\n              [disabled]=\"isLoadingCharm\"\r\n            >\r\n              Calcular\r\n            </button>\r\n            <button\r\n              type=\"button\"\r\n              class=\"button-medieval\"\r\n              (click)=\"resetCharmDamage()\"\r\n            >\r\n              Limpar\r\n            </button>\r\n          </div>\r\n        </form>\r\n        <div *ngIf=\"isLoadingCharm\" class=\"result-display\">\r\n          <div class=\"svg-loader-overlay\" style=\"position: relative; height: 100px;\">\r\n            <div class=\"svg-loader\">\r\n              <svg\r\n                fill=\"#000000\"\r\n                height=\"200px\"\r\n                width=\"200px\"\r\n                version=\"1.1\"\r\n                id=\"Capa_1\"\r\n                xmlns=\"http://www.w3.org/2000/svg\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n                viewBox=\"0 0 452.022 452.022\"\r\n                xml:space=\"preserve\"\r\n              >\r\n                <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\r\n                <g\r\n                  id=\"SVGRepo_tracerCarrier\"\r\n                  stroke-linecap=\"round\"\r\n                  stroke-linejoin=\"round\"\r\n                ></g>\r\n                <g id=\"SVGRepo_iconCarrier\">\r\n                  <path\r\n                    d=\"M440.761,380.351l-50.512-50.512l24.481-24.481c3.905-3.905,3.905-10.237,0-14.143c-3.905-3.904-10.237-3.904-14.143,0 l-9.494,9.494l-42.368-42.368c6.562-23.401,9.894-47.59,9.894-72l-0.001-153.69c0-4.777-3.379-8.887-8.065-9.811 c-113.629-22.402-228.859-22.402-342.488,0C3.379,23.764,0,27.875,0,32.652v153.69c0,55.105,16.721,108.08,48.356,153.2 c31.635,45.119,75.739,78.897,127.545,97.681c1.101,0.399,2.255,0.599,3.409,0.599c1.154,0,2.308-0.2,3.41-0.599 c40.392-14.651,76.722-38.923,105.694-70.5l18.334,18.334l-9.494,9.494c-3.905,3.905,3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929l24.481-24.481l50.512,50.512 c7.262,7.261,16.917,11.26,27.187,11.26s19.924-3.999,27.186-11.26c7.262-7.262,11.261-16.917,11.261-27.186 C452.022,397.268,448.023,387.613,440.761,380.351z\"\r\n                  ></path>\r\n                </g>\r\n              </svg>\r\n            </div>\r\n          </div>\r\n          <p style=\"text-align: center; margin-top: 1rem; font-family: 'MedievalSharp', serif; color: #7a5a2f;\">\r\n            Calculando dano de charm...\r\n          </p>\r\n        </div>\r\n        <div *ngIf=\"charmDamageError\" class=\"result-display\">\r\n          {{ charmDamageError }}\r\n        </div>\r\n        <div *ngIf=\"charmDamageResult\" class=\"result-display\">\r\n          <h3>Resultado:</h3>\r\n          <div>\r\n            <strong>Dano médio final (Low Blow):</strong>\r\n            <span>{{ charmDamageResult.lowBlowAverage }}</span>\r\n          </div>\r\n          <div>\r\n            <strong>Dano médio final (Elemental):</strong>\r\n            <span>{{ charmDamageResult.elementalAverage }}</span>\r\n          </div>\r\n          <div *ngIf=\"charmDamageResult.constants\">\r\n            <strong>Constantes:</strong>\r\n            <ul>\r\n              <li>\r\n                LOW_BLOW_MULTIPLIER:\r\n                {{ charmDamageResult.constants.LOW_BLOW_MULTIPLIER }}\r\n              </li>\r\n              <li>\r\n                ELEMENTAL_DAMAGE:\r\n                {{ charmDamageResult.constants.ELEMENTAL_DAMAGE }}\r\n              </li>\r\n              <li>\r\n                ELEMENTAL_PROC_CHANCE:\r\n                {{ charmDamageResult.constants.ELEMENTAL_PROC_CHANCE }}\r\n              </li>\r\n              <li>\r\n                POWERFUL_MULTIPLIER:\r\n                {{ charmDamageResult.constants.POWERFUL_MULTIPLIER }}\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Loot Split Calculator -->\r\n      <div class=\"parchment-card\" *ngIf=\"activeCalculator === 'loot-split'\">\r\n        <h2>Calculadora de Divisão de Loot</h2>\r\n        <hr />\r\n        <form class=\"calculator-form\" (ngSubmit)=\"submitLootSplit()\">\r\n          <div class=\"input-icon-group\">\r\n            <label>Log da sessão:</label>\r\n            <textarea\r\n              class=\"input-medieval\"\r\n              [(ngModel)]=\"lootSplitForm.session\"\r\n              name=\"session\"\r\n              rows=\"8\"\r\n              style=\"width: 100%\"\r\n            ></textarea>\r\n          </div>\r\n          <div class=\"calculator-actions\">\r\n            <button\r\n              type=\"submit\"\r\n              class=\"button-medieval\"\r\n              [disabled]=\"isLoadingLootSplit\"\r\n            >\r\n              Calcular\r\n            </button>\r\n            <button\r\n              type=\"button\"\r\n              class=\"button-medieval\"\r\n              (click)=\"resetLootSplit()\"\r\n            >\r\n              Limpar\r\n            </button>\r\n          </div>\r\n        </form>\r\n        <div *ngIf=\"isLoadingLootSplit\" class=\"result-display\">\r\n          <div class=\"svg-loader-overlay\" style=\"position: relative; height: 100px;\">\r\n            <div class=\"svg-loader\">\r\n              <svg\r\n                fill=\"#000000\"\r\n                height=\"200px\"\r\n                width=\"200px\"\r\n                version=\"1.1\"\r\n                id=\"Capa_1\"\r\n                xmlns=\"http://www.w3.org/2000/svg\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\"\r\n                viewBox=\"0 0 452.022 452.022\"\r\n                xml:space=\"preserve\"\r\n              >\r\n                <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\r\n                <g\r\n                  id=\"SVGRepo_tracerCarrier\"\r\n                  stroke-linecap=\"round\"\r\n                  stroke-linejoin=\"round\"\r\n                ></g>\r\n                <g id=\"SVGRepo_iconCarrier\">\r\n                  <path\r\n                    d=\"M440.761,380.351l-50.512-50.512l24.481-24.481c3.905-3.905,3.905-10.237,0-14.143c-3.905-3.904-10.237-3.904-14.143,0 l-9.494,9.494l-42.368-42.368c6.562-23.401,9.894-47.59,9.894-72l-0.001-153.69c0-4.777-3.379-8.887-8.065-9.811 c-113.629-22.402-228.859-22.402-342.488,0C3.379,23.764,0,27.875,0,32.652v153.69c0,55.105,16.721,108.08,48.356,153.2 c31.635,45.119,75.739,78.897,127.545,97.681c1.101,0.399,2.255,0.599,3.409,0.599c1.154,0,2.308-0.2,3.41-0.599 c40.392-14.651,76.722-38.923,105.694-70.5l18.334,18.334l-9.494,9.494c-3.905,3.905,3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929l24.481-24.481l50.512,50.512 c7.262,7.261,16.917,11.26,27.187,11.26s19.924-3.999,27.186-11.26c7.262-7.262,11.261-16.917,11.261-27.186 C452.022,397.268,448.023,387.613,440.761,380.351z\"\r\n                  ></path>\r\n                </g>\r\n              </svg>\r\n            </div>\r\n          </div>\r\n          <p style=\"text-align: center; margin-top: 1rem; font-family: 'MedievalSharp', serif; color: #7a5a2f;\">\r\n            Processando log da sessão...\r\n          </p>\r\n        </div>\r\n        <div *ngIf=\"lootSplitError\" class=\"result-display\">\r\n          {{ lootSplitError }}\r\n        </div>\r\n        <div *ngIf=\"lootSplitResult\" class=\"loot-result-medieval\">\r\n          <div class=\"result-label\" style=\"margin-bottom: 1em\">\r\n           Sessão do time:\r\n          </div>\r\n          <div class=\"loot-totals-row\">\r\n            <span class=\"loot-total loot-total-loot\">\r\n              <img src=\"assets/coin.svg\" class=\"loot-icon-big\" alt=\"Loot\" />\r\n              Loot: <b>{{ lootSplitResult.teamReceipt.loot | number }}</b>\r\n            </span>\r\n            <span class=\"loot-total loot-total-supplies\">\r\n              <img\r\n                src=\"assets/supplies.svg\"\r\n                class=\"loot-icon-big\"\r\n                alt=\"Supplies\"\r\n              />\r\n              Supplies:\r\n              <b>{{ lootSplitResult.teamReceipt.supplies | number }}</b>\r\n            </span>\r\n            <span class=\"loot-total loot-total-balance\">\r\n              <img\r\n                src=\"assets/budget.svg\"\r\n                class=\"loot-icon-big\"\r\n                alt=\"Balance\"\r\n              />\r\n              Balance: <b>{{ lootSplitResult.teamReceipt.balance | number }}</b>\r\n            </span>\r\n          </div>\r\n          <br />\r\n          <div class=\"result-label\" style=\"margin-top: 1em\">\r\n            Transferências:\r\n          </div>\r\n          <div\r\n            *ngFor=\"let t of sortedTransfers; let i = index\"\r\n            class=\"loot-transfer-row\"\r\n          >\r\n            <span class=\"loot-transfer-names\"\r\n              >{{ t.from }} <span class=\"arrow\">→</span> {{ t.to }}:</span\r\n            >\r\n            <span class=\"loot-gold-group\">\r\n              <img src=\"assets/coin.svg\" class=\"result-icon\" alt=\"Gold\" />\r\n              <span class=\"loot-gold\">{{ t.amount | number }}</span>\r\n              <button\r\n                class=\"copy-btn\"\r\n                (click)=\"copyTransfer(t)\"\r\n                title=\"Copiar transferência\"\r\n              >\r\n                <img src=\"assets/copy.svg\" alt=\"Copiar\" />\r\n              </button>\r\n              <img\r\n                *ngIf=\"copiedTransferIndex === i\"\r\n                src=\"assets/success.svg\"\r\n                class=\"copy-check\"\r\n                alt=\"Copiado\"\r\n              />\r\n            </span>\r\n          </div>\r\n          <div style=\"margin-top: 1.2em; text-align: right\">\r\n            <button\r\n              class=\"copy-btn copy-all-btn\"\r\n              (click)=\"copyAllLootResult()\"\r\n              title=\"Copiar todos os resultados\"\r\n            >\r\n              <img src=\"assets/copy.svg\" alt=\"Copiar tudo\" /> Copiar tudo\r\n            </button>\r\n            <img\r\n              *ngIf=\"copiedAll\"\r\n              src=\"assets/success.svg\"\r\n              class=\"copy-check\"\r\n              alt=\"Copiado\"\r\n            />\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n";

/***/ }),

/***/ 3671:
/*!*************************************************!*\
  !*** ./src/app/services/calculators.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalculatorsService: () => (/* binding */ CalculatorsService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 7824);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _environments_environments__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../environments/environments */ 5875);




let CalculatorsService = class CalculatorsService {
  constructor(http) {
    this.http = http;
    this.baseUrl = _environments_environments__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl + '/calculators';
  }
  exerciseWeapons(data) {
    return this.http.post(`${this.baseUrl}?calculator=exercise-weapons`, data);
  }
  stamina(data) {
    return this.http.post(`${this.baseUrl}?calculator=stamina`, data);
  }
  charmDamage(data) {
    return this.http.post(`${this.baseUrl}?calculator=charm-damage`, data);
  }
  lootSplit(data) {
    return this.http.post(`${this.baseUrl}?calculator=loot-split`, data);
  }
  static {
    this.ctorParameters = () => [{
      type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient
    }];
  }
};
CalculatorsService = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Injectable)({
  providedIn: 'root'
}), (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__metadata)("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient])], CalculatorsService);


/***/ }),

/***/ 8557:
/*!*****************************************************************!*\
  !*** ./src/app/components/calculators/calculators.component.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalculatorsComponent: () => (/* binding */ CalculatorsComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 7824);
/* harmony import */ var _calculators_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./calculators.component.html?ngResource */ 2815);
/* harmony import */ var _calculators_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calculators.component.scss?ngResource */ 9183);
/* harmony import */ var _calculators_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_calculators_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _services_calculators_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/calculators.service */ 3671);








function time2Seconds(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return (isNaN(hours) ? 0 : hours) * 3600 + (isNaN(minutes) ? 0 : minutes) * 60;
}
function toTimeValue(time) {
  const [h, m] = time.split(':');
  const hours = Math.max(0, Math.min(42, Number(h) || 0));
  let minutes = Math.max(0, Math.min(59, Number(m) || 0));
  if (hours === 42) minutes = 0; // regra especial
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return {
    hours,
    minutes,
    time: timeStr,
    seconds: hours * 3600 + minutes * 60
  };
}
let CalculatorsComponent = class CalculatorsComponent {
  // Utilitário para converter hh:mm para segundos
  parseStaminaStr(str) {
    if (!str) return 0;
    const match = str.match(/^([0-3]?\d|4[0-2]):([0-5][0-9])$/);
    if (!match) return NaN;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 * 60 + minutes * 60;
  }
  // Formata e valida o input de stamina
  formatStaminaInput(type) {
    let value = type === 'current' ? this.staminaForm.currentStaminaStr : this.staminaForm.targetStaminaStr;
    // Se vazio, não faz nada
    if (!value) {
      if (type === 'current') this.staminaForm.currentStaminaStr = '';else this.staminaForm.targetStaminaStr = '';
      return;
    }
    // Completa com zeros à direita se necessário
    if (value.length < 4) value = value.padEnd(4, '0');
    // Aplica a máscara
    if (value.length >= 3) {
      value = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    if (type === 'current') this.staminaForm.currentStaminaStr = value;else this.staminaForm.targetStaminaStr = value;
    // Validação
    const seconds = this.parseStaminaStr(value);
    const maxSeconds = 42 * 60 * 60;
    const minSeconds = 0;
    if (isNaN(seconds) || seconds < minSeconds || seconds > maxSeconds) {
      if (type === 'current') this.staminaErrorCurrent = true;else this.staminaErrorTarget = true;
    } else {
      if (type === 'current') this.staminaErrorCurrent = false;else this.staminaErrorTarget = false;
    }
    // Validação cruzada: desejado >= atual
    const currentSeconds = this.parseStaminaStr(this.staminaForm.currentStaminaStr);
    const targetSeconds = this.parseStaminaStr(this.staminaForm.targetStaminaStr);
    if (!isNaN(currentSeconds) && !isNaN(targetSeconds)) {
      if (targetSeconds < currentSeconds) {
        this.staminaErrorTarget = true;
      }
    }
  }
  get sortedTransfers() {
    if (!this.lootSplitResult?.transactions) return [];
    return [...this.lootSplitResult.transactions].sort((a, b) => b.amount - a.amount);
  }
  get totalTransfers() {
    if (!this.lootSplitResult?.transactions) return 0;
    return this.lootSplitResult.transactions.reduce((sum, t) => sum + t.amount, 0);
  }
  constructor(calculatorsService) {
    this.calculatorsService = calculatorsService;
    this.carregando = false;
    this.activeCalculator = null;
    // Exercise Weapons Calculator
    this.exerciseWeaponForm = {
      vocation: 'knight',
      skill: 'melee',
      currentSkill: 100,
      targetSkill: 110,
      percentageLeft: 50,
      loyaltyBonus: 0,
      hasDummy: false,
      isDouble: false,
      weaponType: 'auto'
    };
    this.exerciseWeaponsResult = null;
    this.exerciseWeaponsError = null;
    this.isLoadingExercise = false;
    // Stamina Calculator
    this.staminaForm = {
      currentStaminaStr: '',
      targetStaminaStr: ''
    };
    this.staminaErrorCurrent = false;
    this.staminaErrorTarget = false;
    this.staminaResult = null;
    this.staminaError = null;
    this.isLoadingStamina = false;
    this.staminaCurrent = toTimeValue('');
    this.staminaTarget = toTimeValue('');
    this.staminaCurrentRaw = '';
    this.staminaTargetRaw = '';
    this.staminaInvalid = false;
    // Charm Damage Calculator
    this.charmDamageForm = {
      averageDamage: 0,
      creatureHp: 0,
      bonusResistance: 0,
      powerful: false
    };
    this.charmDamageResult = null;
    this.charmDamageError = null;
    this.isLoadingCharm = false;
    // Loot Split Calculator
    this.lootSplitForm = {
      session: ''
    };
    this.lootSplitResult = null;
    this.lootSplitError = null;
    this.isLoadingLootSplit = false;
    // --- Funções de copiar para loot split ---
    this.copiedTransferIndex = null;
    this.copiedProfit = false;
    this.copiedAll = false;
    this.copiedSession = false;
  }
  ngOnInit() {
    this.carregando = true;
    // Simular carregamento
    setTimeout(() => {
      this.carregando = false;
    }, 1000);
  }
  setCalculator(type) {
    this.activeCalculator = type;
  }
  submitExerciseWeapons() {
    this.isLoadingExercise = true;
    this.exerciseWeaponsResult = null;
    this.exerciseWeaponsError = null;
    // Converter skill para 'melee' se for físico
    let skill = this.exerciseWeaponForm.skill;
    if (["axe", "club", "sword", "fist"].includes(skill)) {
      skill = "melee";
    }
    // Montar o payload conforme especificação
    const payload = {
      vocation: this.exerciseWeaponForm.vocation,
      skill: skill,
      currentSkill: this.exerciseWeaponForm.currentSkill,
      targetSkill: this.exerciseWeaponForm.targetSkill,
      percentageLeft: this.exerciseWeaponForm.percentageLeft,
      loyaltyBonus: this.exerciseWeaponForm.loyaltyBonus,
      hasDummy: this.exerciseWeaponForm.hasDummy,
      isDouble: this.exerciseWeaponForm.isDouble,
      weaponType: this.exerciseWeaponForm.weaponType
    };
    this.calculatorsService.exerciseWeapons(payload).subscribe({
      next: res => {
        this.exerciseWeaponsResult = res;
        this.isLoadingExercise = false;
      },
      error: err => {
        this.exerciseWeaponsError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingExercise = false;
      }
    });
  }
  resetExerciseWeapons() {
    this.exerciseWeaponForm = {
      vocation: 'knight',
      skill: 'melee',
      currentSkill: 100,
      targetSkill: 110,
      percentageLeft: 50,
      loyaltyBonus: 0,
      hasDummy: false,
      isDouble: false,
      weaponType: 'auto'
    };
    this.exerciseWeaponsResult = null;
    this.exerciseWeaponsError = null;
  }
  submitStamina() {
    this.staminaError = null;
    this.staminaResult = null;
    // Validar e converter
    const currentSeconds = this.parseStaminaStr(this.staminaForm.currentStaminaStr);
    const targetSeconds = this.parseStaminaStr(this.staminaForm.targetStaminaStr);
    if (isNaN(currentSeconds) || isNaN(targetSeconds) || currentSeconds < 0 || targetSeconds < 0 || targetSeconds > 42 * 60 * 60 || currentSeconds > 42 * 60 * 60 || targetSeconds < currentSeconds) {
      this.staminaError = 'Preencha os campos corretamente.';
      return;
    }
    this.isLoadingStamina = true;
    this.calculatorsService.stamina({
      currentStamina: currentSeconds,
      targetStamina: targetSeconds
    }).subscribe({
      next: res => {
        this.staminaResult = res;
        this.isLoadingStamina = false;
      },
      error: err => {
        this.staminaError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingStamina = false;
      }
    });
  }
  resetStamina() {
    this.staminaForm = {
      currentStaminaStr: '',
      targetStaminaStr: ''
    };
    this.staminaErrorCurrent = false;
    this.staminaErrorTarget = false;
    this.staminaResult = null;
    this.staminaError = null;
  }
  submitCharmDamage() {
    this.isLoadingCharm = true;
    this.charmDamageResult = null;
    this.charmDamageError = null;
    this.calculatorsService.charmDamage(this.charmDamageForm).subscribe({
      next: res => {
        this.charmDamageResult = res;
        this.isLoadingCharm = false;
      },
      error: err => {
        this.charmDamageError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingCharm = false;
      }
    });
  }
  resetCharmDamage() {
    this.charmDamageForm = {
      averageDamage: 0,
      creatureHp: 0,
      bonusResistance: 0,
      powerful: false
    };
    this.charmDamageResult = null;
    this.charmDamageError = null;
  }
  submitLootSplit() {
    this.isLoadingLootSplit = true;
    this.lootSplitResult = null;
    this.lootSplitError = null;
    // Montar o payload apenas com a sessão
    const payload = {
      session: this.lootSplitForm.session
    };
    this.calculatorsService.lootSplit(payload).subscribe({
      next: res => {
        this.lootSplitResult = res;
        this.isLoadingLootSplit = false;
      },
      error: err => {
        this.lootSplitError = 'Erro ao calcular. Tente novamente.';
        this.isLoadingLootSplit = false;
      }
    });
  }
  resetLootSplit() {
    this.lootSplitForm = {
      session: ''
    };
    this.lootSplitResult = null;
    this.lootSplitError = null;
  }
  copyLootSession() {
    if (!this.lootSplitResult) return;
    const session = this.lootSplitResult.sessionDate || '';
    navigator.clipboard.writeText(session);
    this.copiedSession = true;
    setTimeout(() => this.copiedSession = false, 1200);
  }
  copyTransfer(t) {
    // Novo formato: transfer {amount} to {to}
    const text = `transfer ${t.amount} to ${t.to}`;
    navigator.clipboard.writeText(text);
    const idx = this.lootSplitResult.transactions.indexOf(t);
    this.copiedTransferIndex = idx;
    setTimeout(() => this.copiedTransferIndex = null, 1200);
  }
  copyProfit() {
    if (!this.lootSplitResult) return;
    const text = `${this.lootSplitResult.profitTotal} cada`;
    navigator.clipboard.writeText(text);
    this.copiedProfit = true;
    setTimeout(() => this.copiedProfit = false, 1200);
  }
  copyAllLootResult() {
    if (!this.lootSplitResult) return;
    let text = '';
    text += `Sessão do time: ${this.lootSplitResult.sessionDate || ''}\n`;
    text += `Loot: ${this.lootSplitResult.teamReceipt.loot}\n`;
    text += `Supplies: ${this.lootSplitResult.teamReceipt.supplies}\n`;
    text += `Balance: ${this.lootSplitResult.teamReceipt.balance}\n`;
    if (this.lootSplitResult.transactions && this.lootSplitResult.transactions.length > 0) {
      text += `Transferências:\n`;
      for (const t of this.lootSplitResult.transactions) {
        text += `  ${t.from} → ${t.to}: ${t.amount}\n`;
      }
    }
    text += `Jogadores considerados: ${this.lootSplitResult.players.join(', ')}\n`;
    navigator.clipboard.writeText(text);
    this.copiedAll = true;
    setTimeout(() => this.copiedAll = false, 1200);
  }
  // Máscara só ao sair do campo (blur)
  onStaminaInput(type, event) {
    let value = event.target.value.replace(/[^0-9]/g, ''); // só números
    if (value.length > 4) value = value.slice(0, 4);
    // Não aplica máscara durante digitação
    if (type === 'current') this.staminaForm.currentStaminaStr = value;else this.staminaForm.targetStaminaStr = value;
    // Validação ao digitar
    this.formatStaminaInput(type);
  }
  onStaminaTimeChange(type, value) {
    if (type === 'current') {
      this.staminaCurrentRaw = value;
      this.staminaCurrent = toTimeValue(value);
    } else {
      this.staminaTargetRaw = value;
      this.staminaTarget = toTimeValue(value);
    }
    this.validateStaminaTimes();
  }
  validateStaminaTimes() {
    this.staminaInvalid = this.staminaCurrent.seconds > this.staminaTarget.seconds || isNaN(this.staminaCurrent.seconds + this.staminaTarget.seconds);
  }
  // Métodos auxiliares para incrementar/decrementar
  incHour(type) {
    if (type === 'current') {
      this.staminaCurrent.hours = Math.min(42, this.staminaCurrent.hours + 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.hours = Math.min(42, this.staminaTarget.hours + 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  decHour(type) {
    if (type === 'current') {
      this.staminaCurrent.hours = Math.max(0, this.staminaCurrent.hours - 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.hours = Math.max(0, this.staminaTarget.hours - 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  incMin(type) {
    if (type === 'current') {
      this.staminaCurrent.minutes = Math.min(59, this.staminaCurrent.minutes + 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.minutes = Math.min(59, this.staminaTarget.minutes + 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  decMin(type) {
    if (type === 'current') {
      this.staminaCurrent.minutes = Math.max(0, this.staminaCurrent.minutes - 1);
      this.onStaminaTimeChange('current', this.staminaCurrent.hours + ':' + this.staminaCurrent.minutes);
    } else {
      this.staminaTarget.minutes = Math.max(0, this.staminaTarget.minutes - 1);
      this.onStaminaTimeChange('target', this.staminaTarget.hours + ':' + this.staminaTarget.minutes);
    }
  }
  static {
    this.ctorParameters = () => [{
      type: _services_calculators_service__WEBPACK_IMPORTED_MODULE_2__.CalculatorsService
    }];
  }
};
CalculatorsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
  selector: 'app-calculators',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule],
  template: _calculators_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  styles: [(_calculators_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default())]
}), (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__metadata)("design:paramtypes", [_services_calculators_service__WEBPACK_IMPORTED_MODULE_2__.CalculatorsService])], CalculatorsComponent);


/***/ }),

/***/ 9183:
/*!******************************************************************************!*\
  !*** ./src/app/components/calculators/calculators.component.scss?ngResource ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 3142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 5950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.parchment-card {
  width: 100% !important;
  max-width: none !important;
  box-sizing: border-box;
}

.consulta-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3em;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.filtro-topo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

.filtro-topo .button-medieval {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  min-width: 160px;
}
.filtro-topo .button-medieval .svg-icon {
  width: 20px;
  height: 20px;
}

.ordenavel {
  background-color: #c1a176 !important;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(60, 40, 20, 0.13);
}

.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.input-icon-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.input-medieval {
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #bfa76a;
  border-radius: 8px;
  font-family: "MedievalSharp", serif;
  font-size: 1rem;
  background: #f8f3e6;
  color: #5d4037;
  transition: border-color 0.3s ease;
}
.input-medieval:focus {
  outline: none;
  border-color: #8b5e3c;
  box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);
}
.input-medieval::placeholder {
  color: #a67c52;
  opacity: 0.7;
}

.calculator-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.calculator-actions .button-medieval {
  min-width: 120px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
}

.result-display {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fdf8e4, #e8d9a5);
  border: 2px solid #a07947;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 6px rgba(0, 0, 0, 0.15);
}
.result-display h3 {
  font-family: "MedievalSharp", serif;
  font-size: 1.3rem;
  color: #5b3e1d;
  margin-bottom: 1rem;
}
.result-display .result-text {
  font-family: "Georgia", serif;
  font-size: 1.2rem;
  color: #3b2a1a;
  margin-bottom: 0.5rem;
}
.result-display .result-text strong {
  color: #8b5e3c;
  font-size: 1.4rem;
}
.result-display .result-subtext {
  font-family: "Georgia", serif;
  font-size: 1rem;
  color: #a67c52;
  font-style: italic;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
}

.form-col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.input-medieval,
.select-medieval {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.select-medieval {
  min-width: 180px;
  margin: 0 0.5rem 0 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1.5px solid #bfa76a;
  font-family: "MedievalSharp", serif;
  font-size: 1rem;
  background: #f8f3e6;
  color: #5d4037;
  box-shadow: none;
  transition: border-color 0.3s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-medieval:focus {
  outline: none;
  border-color: #8b5e3c;
  box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);
}

.select-medieval option {
  font-family: "MedievalSharp", serif;
  color: #5d4037;
  background: #f8f3e6;
}

.checkbox-medieval {
  accent-color: #bfa76a;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid #bfa76a;
  background: #f8f3e6;
  box-shadow: 0 1px 2px rgba(60, 40, 20, 0.07);
  margin-right: 0.5rem;
}

.checkbox-medieval:checked {
  background: #bfa76a;
  border-color: #8b5e3c;
}

.checkbox-medieval:focus {
  outline: 2px solid #8b5e3c;
}

.form-col label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: "MedievalSharp", serif;
  color: #5d4037;
  font-size: 1rem;
}

.range-medieval {
  accent-color: #bfa76a;
  background: transparent;
  height: 2px;
  margin-top: 0.5rem;
}

.range-medieval::-webkit-slider-thumb {
  background: #bfa76a;
  border: 2px solid #8b5e3c;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.range-medieval::-moz-range-thumb {
  background: #bfa76a;
  border: 2px solid #8b5e3c;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.range-medieval::-ms-thumb {
  background: #bfa76a;
  border: 2px solid #8b5e3c;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.range-medieval::-webkit-slider-runnable-track {
  background: #e6caa1;
  height: 4px;
  border-radius: 2px;
}

.range-medieval::-ms-fill-lower,
.range-medieval::-ms-fill-upper {
  background: #e6caa1;
}

.range-medieval::-moz-range-track {
  background: #e6caa1;
  height: 4px;
  border-radius: 2px;
}

.range-medieval:focus {
  outline: none;
}

@media (max-width: 900px) {
  .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  .form-col {
    min-width: 0;
  }
}
@media (max-width: 768px) {
  .filtro-topo {
    flex-direction: column;
  }
  .filtro-topo .button-medieval {
    width: 100%;
    max-width: 300px;
    min-width: auto;
  }
  .calculator-actions {
    flex-direction: column;
  }
  .calculator-actions .button-medieval {
    width: 100%;
    max-width: 200px;
  }
  .result-display {
    padding: 1rem;
  }
  .result-display h3 {
    font-size: 1.1rem;
  }
  .result-display .result-text {
    font-size: 1rem;
  }
  .result-display .result-text strong {
    font-size: 1.2rem;
  }
}
@media (max-width: 480px) {
  .filtro-topo {
    margin-bottom: 1.5rem;
  }
  .input-medieval {
    font-size: 0.95rem;
    padding: 0.7rem;
  }
  .calculator-form {
    gap: 1rem;
  }
  .result-display {
    margin-top: 1.5rem;
    padding: 0.8rem;
  }
  .result-display h3 {
    font-size: 1rem;
  }
  .result-display .result-text {
    font-size: 0.95rem;
  }
  .result-display .result-text strong {
    font-size: 1.1rem;
  }
  .result-display .result-subtext {
    font-size: 0.9rem;
  }
}
.exercise-result-medieval {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: flex-start;
  margin-top: 1.2rem;
  background: none;
  border: none;
  box-shadow: none;
}

.exercise-result-medieval h3 {
  align-self: center;
  font-family: "MedievalSharp", serif;
  color: #5b3e1d;
  font-size: 1.3rem;
  margin-bottom: 0.7rem;
  letter-spacing: 0.5px;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 1.1em;
  font-size: 1.13rem;
  margin-bottom: 0.35em;
  flex-wrap: wrap;
  line-height: 1.7;
}

.result-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.3em;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px #e8d9a5);
}

.result-label {
  font-weight: bold;
  color: #7a5a2f;
  margin-right: 0.4em;
  font-family: "MedievalSharp", serif;
  font-size: 1.8rem;
  letter-spacing: 0.2px;
}

.exercise-result-medieval span, .exercise-result-medieval b {
  font-family: "Georgia", serif;
  color: #3b2a1a;
  font-size: 1.13rem;
  line-height: 1.7;
}

.exercise-result-medieval b {
  font-weight: bold;
  color: #8b5e3c;
  font-size: 1.13rem;
}

.loot-result-medieval {
  margin-top: 2.2rem;
  padding: 1.2rem 1.5rem 1.5rem 1.5rem;
  border-radius: 14px;
  border: none;
  box-shadow: none;
  font-family: "Georgia", serif;
  color: #3b2a1a;
  font-size: 1.08rem;
}

.loot-totals-row {
  display: flex;
  gap: 2.5em;
  align-items: flex-end;
  margin-bottom: 0.2em;
  flex-wrap: wrap;
}

.loot-total {
  display: flex;
  align-items: center;
  font-size: 1.18rem;
  font-family: "MedievalSharp", serif;
  font-weight: bold;
  gap: 0.3em;
}

.loot-total-loot {
  color: #bfa66b;
}

.loot-total-supplies {
  color: #4e9a51;
}

.loot-total-balance {
  color: #7a5a2f;
}

.loot-icon-big {
  width: 20px;
  height: 20px;
  margin-right: 0.2em;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px #e8d9a5);
}

.loot-balance-explanation {
  font-size: 0.98rem;
  color: #8c7a5b;
  margin-bottom: 0.7em;
  margin-left: 0.2em;
  font-style: italic;
}

.loot-transfer-total-row {
  display: flex;
  align-items: center;
  gap: 1.1em;
  margin-top: 0.7em;
  font-size: 1rem;
}

.loot-header-row {
  display: flex;
  align-items: center;
  gap: 1.1em;
  margin-bottom: 0.35em;
}

.loot-session-date {
  font-family: "Georgia", serif;
  color: #3b2a1a;
  font-size: 1em;
  margin-right: 0.7em;
}

.loot-team-row {
  display: flex;
  gap: 2.2em;
  margin-bottom: 0.7em;
  align-items: center;
  flex-wrap: wrap;
}

.loot-transfer-row {
  display: flex;
  align-items: center;
  gap: 1.1em;
  margin-bottom: 0.35em;
  font-size: 1rem;
  flex-wrap: nowrap;
  line-height: 1.7;
}

.loot-transfer-names {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-family: "Georgia", serif;
  color: #3b2a1a;
  font-size: 1rem;
  line-height: 1.7;
}

.loot-gold-group {
  display: flex;
  align-items: center;
  gap: 0.3em;
  font-size: 1rem;
}

.loot-gold {
  color: #8b5e3c;
  font-weight: bold;
  font-family: "Georgia", serif;
  margin-right: 0.2em;
}

.arrow {
  font-size: 1.1em;
  margin: 0 0.2em;
}

.loot-profit-row {
  display: flex;
  align-items: center;
  gap: 1.1em;
  margin-bottom: 0.3em;
  font-size: 1rem;
}

.loot-players-row {
  margin-top: 0.2em;
  font-size: 1rem;
  color: #5b3e1d;
}

.copy-btn {
  background: #fdf8e4;
  border: 1.5px solid #a67c52;
  border-radius: 7px;
  padding: 0.18em 0.7em 0.18em 0.5em;
  margin-left: 0.3em;
  font-family: "MedievalSharp", serif;
  font-size: 1rem;
  color: #7a5a2f;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  height: 2.1em;
  vertical-align: middle;
}

.copy-btn img {
  width: 20px;
  height: 20px;
  margin: 0;
  display: block;
}

.copy-btn:hover {
  background: #f4e6b3;
  box-shadow: 0 2px 8px rgba(60, 40, 20, 0.08);
}

.copy-all-btn {
  font-weight: bold;
  font-size: 1rem;
  padding: 0.22em 1.1em 0.22em 0.7em;
}

.copy-check {
  width: 20px;
  height: 20px;
  margin-left: 0.2em;
  vertical-align: middle;
  opacity: 1;
  transition: opacity 0.3s;
  animation: fadeInOut 1.2s;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.stamina-form-medieval {
  width: 100%;
  margin-top: 1.5rem;
}

.stamina-fields-row {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.stamina-field-col {
  display: flex;
  flex-direction: column;
  min-width: 220px;
  flex: 1 1 220px;
}

.stamina-field-col label {
  font-family: "MedievalSharp", serif;
  color: #7a5a2f;
  font-size: 1.08rem;
  margin-bottom: 0.5em;
  text-align: left;
}

.stamina-field-col input {
  width: 100%;
  font-size: 1.15rem;
  padding: 0.7em 1em;
  border-radius: 8px;
  border: 2px solid #bfa76a;
  background: #f8f3e6;
  color: #5d4037;
  font-family: "Georgia", serif;
}

.stamina-actions-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.stamina-actions-row .button-medieval {
  min-width: 120px;
  font-size: 1.08rem;
  padding: 0.7em 1.5em;
}

.stamina-result-medieval {
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #fdf8e4 80%, #e8d9a5 100%);
  border: 2px solid #bfa76a;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60, 40, 20, 0.07);
  font-family: "Georgia", serif;
  color: #3b2a1a;
  font-size: 1.15rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.stamina-result-medieval h3 {
  font-family: "MedievalSharp", serif;
  color: #7a5a2f;
  font-size: 1.25rem;
  margin-bottom: 1.2rem;
  text-align: center;
}

.stamina-result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7em;
  font-size: 1.13rem;
}

.stamina-result-label {
  font-family: "MedievalSharp", serif;
  color: #7a5a2f;
  font-weight: bold;
  font-size: 1.08rem;
}

.stamina-result-value {
  font-family: "Georgia", serif;
  color: #8b5e3c;
  font-size: 1.13rem;
  font-weight: bold;
  margin-left: 1em;
}

@media (max-width: 700px) {
  .stamina-fields-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  .stamina-result-medieval {
    padding: 1rem 0.5rem;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/components/calculators/calculators.component.scss","webpack://./../../Projetos%20Pessoais/charlovinho/src/app/components/calculators/calculators.component.scss"],"names":[],"mappings":"AACA;EACE,sBAAA;EACA,0BAAA;EACA,sBAAA;ACAF;;ADGA;EACE,iBAAA;EACA,cAAA;EACA,YAAA;EACA,aAAA;EACA,sBAAA;EACA,sBAAA;ACAF;;ADGA;EACE,aAAA;EACA,eAAA;EACA,SAAA;EACA,mBAAA;EACA,WAAA;ACAF;;ADGA;EACE,aAAA;EACA,mBAAA;EACA,WAAA;EACA,sBAAA;EACA,eAAA;EACA,gBAAA;ACAF;ADEE;EACE,WAAA;EACA,YAAA;ACAJ;;ADIA;EACE,oCAAA;EACA,sBAAA;EACA,6CAAA;ACDF;;ADIA;EACE,aAAA;EACA,sBAAA;EACA,WAAA;EACA,kBAAA;ACDF;;ADIA;EACE,aAAA;EACA,mBAAA;EACA,WAAA;EACA,qBAAA;ACDF;;ADIA;EACE,OAAA;EACA,eAAA;EACA,yBAAA;EACA,kBAAA;EACA,mCAAA;EACA,eAAA;EACA,mBAAA;EACA,cAAA;EACA,kCAAA;ACDF;ADGE;EACE,aAAA;EACA,qBAAA;EACA,4CAAA;ACDJ;ADIE;EACE,cAAA;EACA,YAAA;ACFJ;;ADMA;EACE,aAAA;EACA,SAAA;EACA,gBAAA;ACHF;ADKE;EACE,gBAAA;EACA,sBAAA;EACA,eAAA;ACHJ;;ADOA;EACE,gBAAA;EACA,eAAA;EACA,qDAAA;EACA,yBAAA;EACA,kBAAA;EACA,4EAAA;ACJF;ADME;EACE,mCAAA;EACA,iBAAA;EACA,cAAA;EACA,mBAAA;ACJJ;ADOE;EACE,6BAAA;EACA,iBAAA;EACA,cAAA;EACA,qBAAA;ACLJ;ADOI;EACE,cAAA;EACA,iBAAA;ACLN;ADSE;EACE,6BAAA;EACA,eAAA;EACA,cAAA;EACA,kBAAA;ACPJ;;ADWA;EACE,aAAA;EACA,WAAA;EACA,qBAAA;ACRF;;ADWA;EACE,WAAA;EACA,aAAA;EACA,sBAAA;EACA,gBAAA;ACRF;;ADWA;;EAEE,WAAA;EACA,YAAA;EACA,sBAAA;ACRF;;ADWA;EACE,gBAAA;EACA,yBAAA;EACA,eAAA;EACA,kBAAA;EACA,2BAAA;EACA,mCAAA;EACA,eAAA;EACA,mBAAA;EACA,cAAA;EACA,gBAAA;EACA,6BAAA;EACA,gBAAA;EACA,wBAAA;EACA,qBAAA;ACRF;;ADWA;EACE,aAAA;EACA,qBAAA;EACA,4CAAA;ACRF;;ADWA;EACE,mCAAA;EACA,cAAA;EACA,mBAAA;ACRF;;ADYA;EACE,qBAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,2BAAA;EACA,mBAAA;EACA,4CAAA;EACA,oBAAA;ACTF;;ADYA;EACE,mBAAA;EACA,qBAAA;ACTF;;ADYA;EACE,0BAAA;ACTF;;ADaA;EACE,aAAA;EACA,mBAAA;EACA,WAAA;EACA,mCAAA;EACA,cAAA;EACA,eAAA;ACVF;;ADaA;EACE,qBAAA;EACA,uBAAA;EACA,WAAA;EACA,kBAAA;ACVF;;ADaA;EACE,mBAAA;EACA,yBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,eAAA;ACVF;;ADaA;EACE,mBAAA;EACA,yBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,eAAA;ACVF;;ADaA;EACE,mBAAA;EACA,yBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,eAAA;ACVF;;ADaA;EACE,mBAAA;EACA,WAAA;EACA,kBAAA;ACVF;;ADaA;;EAEE,mBAAA;ACVF;;ADaA;EACE,mBAAA;EACA,WAAA;EACA,kBAAA;ACVF;;ADaA;EACE,aAAA;ACVF;;ADcA;EACE;IACE,sBAAA;IACA,WAAA;ECXF;EDaA;IACE,YAAA;ECXF;AACF;ADcA;EAEE;IACE,sBAAA;ECbF;EDeE;IACE,WAAA;IACA,gBAAA;IACA,eAAA;ECbJ;EDiBA;IACE,sBAAA;ECfF;EDiBE;IACE,WAAA;IACA,gBAAA;ECfJ;EDmBA;IACE,aAAA;ECjBF;EDmBE;IACE,iBAAA;ECjBJ;EDoBE;IACE,eAAA;EClBJ;EDoBI;IACE,iBAAA;EClBN;AACF;ADuBA;EACE;IACE,qBAAA;ECrBF;EDwBA;IACE,kBAAA;IACA,eAAA;ECtBF;EDyBA;IACE,SAAA;ECvBF;ED0BA;IACE,kBAAA;IACA,eAAA;ECxBF;ED0BE;IACE,eAAA;ECxBJ;ED2BE;IACE,kBAAA;ECzBJ;ED2BI;IACE,iBAAA;ECzBN;ED6BE;IACE,iBAAA;EC3BJ;AACF;AD+BA;EACE,aAAA;EACA,sBAAA;EACA,WAAA;EACA,uBAAA;EACA,kBAAA;EACA,gBAAA;EACA,YAAA;EACA,gBAAA;AC7BF;;ADgCA;EACE,kBAAA;EACA,mCAAA;EACA,cAAA;EACA,iBAAA;EACA,qBAAA;EACA,qBAAA;AC7BF;;ADgCA;EACE,aAAA;EACA,mBAAA;EACA,UAAA;EACA,kBAAA;EACA,qBAAA;EACA,eAAA;EACA,gBAAA;AC7BF;;ADgCA;EACE,WAAA;EACA,YAAA;EACA,mBAAA;EACA,sBAAA;EACA,sCAAA;AC7BF;;ADgCA;EACE,iBAAA;EACA,cAAA;EACA,mBAAA;EACA,mCAAA;EACA,iBAAA;EACA,qBAAA;AC7BF;;ADgCA;EACE,6BAAA;EACA,cAAA;EACA,kBAAA;EACA,gBAAA;AC7BF;;ADgCA;EACE,iBAAA;EACA,cAAA;EACA,kBAAA;AC7BF;;ADgCA;EACE,kBAAA;EACA,oCAAA;EACA,mBAAA;EACA,YAAA;EACA,gBAAA;EACA,6BAAA;EACA,cAAA;EACA,kBAAA;AC7BF;;ADgCA;EACE,aAAA;EACA,UAAA;EACA,qBAAA;EACA,oBAAA;EACA,eAAA;AC7BF;;ADgCA;EACE,aAAA;EACA,mBAAA;EACA,kBAAA;EACA,mCAAA;EACA,iBAAA;EACA,UAAA;AC7BF;;AD+BA;EACE,cAAA;AC5BF;;AD8BA;EACE,cAAA;AC3BF;;AD6BA;EACE,cAAA;AC1BF;;AD6BA;EACE,WAAA;EACA,YAAA;EACA,mBAAA;EACA,sBAAA;EACA,sCAAA;AC1BF;;AD6BA;EACE,kBAAA;EACA,cAAA;EACA,oBAAA;EACA,kBAAA;EACA,kBAAA;AC1BF;;AD6BA;EACE,aAAA;EACA,mBAAA;EACA,UAAA;EACA,iBAAA;EACA,eAAA;AC1BF;;AD6BA;EACE,aAAA;EACA,mBAAA;EACA,UAAA;EACA,qBAAA;AC1BF;;AD+BA;EACE,6BAAA;EACA,cAAA;EACA,cAAA;EACA,mBAAA;AC5BF;;ADiCA;EACE,aAAA;EACA,UAAA;EACA,oBAAA;EACA,mBAAA;EACA,eAAA;AC9BF;;ADiCA;EACE,aAAA;EACA,mBAAA;EACA,UAAA;EACA,qBAAA;EACA,eAAA;EACA,iBAAA;EACA,gBAAA;AC9BF;;ADiCA;EACE,aAAA;EACA,mBAAA;EACA,mBAAA;EACA,6BAAA;EACA,cAAA;EACA,eAAA;EACA,gBAAA;AC9BF;;ADiCA;EACE,aAAA;EACA,mBAAA;EACA,UAAA;EACA,eAAA;AC9BF;;ADiCA;EACE,cAAA;EACA,iBAAA;EACA,6BAAA;EACA,mBAAA;AC9BF;;ADiCA;EACE,gBAAA;EACA,eAAA;AC9BF;;ADiCA;EACE,aAAA;EACA,mBAAA;EACA,UAAA;EACA,oBAAA;EACA,eAAA;AC9BF;;ADiCA;EACE,iBAAA;EACA,eAAA;EACA,cAAA;AC9BF;;ADiCA;EACE,mBAAA;EACA,2BAAA;EACA,kBAAA;EACA,kCAAA;EACA,kBAAA;EACA,mCAAA;EACA,eAAA;EACA,cAAA;EACA,eAAA;EACA,4CAAA;EACA,oBAAA;EACA,mBAAA;EACA,UAAA;EACA,aAAA;EACA,sBAAA;AC9BF;;ADgCA;EACE,WAAA;EACA,YAAA;EACA,SAAA;EACA,cAAA;AC7BF;;AD+BA;EACE,mBAAA;EACA,4CAAA;AC5BF;;AD8BA;EACE,iBAAA;EACA,eAAA;EACA,kCAAA;AC3BF;;AD8BA;EACE,WAAA;EACA,YAAA;EACA,kBAAA;EACA,sBAAA;EACA,UAAA;EACA,wBAAA;EACA,yBAAA;AC3BF;;AD8BA;EACE;IAAK,UAAA;EC1BL;ED2BA;IAAM,UAAA;ECxBN;EDyBA;IAAM,UAAA;ECtBN;EDuBA;IAAO,UAAA;ECpBP;AACF;ADuBA;EACE,WAAA;EACA,kBAAA;ACrBF;;ADuBA;EACE,aAAA;EACA,SAAA;EACA,uBAAA;EACA,qBAAA;EACA,qBAAA;EACA,eAAA;ACpBF;;ADsBA;EACE,aAAA;EACA,sBAAA;EACA,gBAAA;EACA,eAAA;ACnBF;;ADqBA;EACE,mCAAA;EACA,cAAA;EACA,kBAAA;EACA,oBAAA;EACA,gBAAA;AClBF;;ADoBA;EACE,WAAA;EACA,kBAAA;EACA,kBAAA;EACA,kBAAA;EACA,yBAAA;EACA,mBAAA;EACA,cAAA;EACA,6BAAA;ACjBF;;ADmBA;EACE,aAAA;EACA,uBAAA;EACA,WAAA;EACA,kBAAA;AChBF;;ADkBA;EACE,gBAAA;EACA,kBAAA;EACA,oBAAA;ACfF;;ADmBA;EACE,gBAAA;EACA,oBAAA;EACA,8DAAA;EACA,yBAAA;EACA,mBAAA;EACA,4CAAA;EACA,6BAAA;EACA,cAAA;EACA,kBAAA;EACA,gBAAA;EACA,iBAAA;EACA,kBAAA;AChBF;;ADkBA;EACE,mCAAA;EACA,cAAA;EACA,kBAAA;EACA,qBAAA;EACA,kBAAA;ACfF;;ADiBA;EACE,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,oBAAA;EACA,kBAAA;ACdF;;ADgBA;EACE,mCAAA;EACA,cAAA;EACA,iBAAA;EACA,kBAAA;ACbF;;ADeA;EACE,6BAAA;EACA,cAAA;EACA,kBAAA;EACA,iBAAA;EACA,gBAAA;ACZF;;ADgBA;EACE;IACE,sBAAA;IACA,SAAA;IACA,oBAAA;ECbF;EDeA;IACE,oBAAA;ECbF;AACF","sourcesContent":["\r\n.parchment-card {\r\n  width: 100% !important;\r\n  max-width: none !important;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.consulta-layout {\r\n  max-width: 1100px;\r\n  margin: 0 auto;\r\n  padding: 3em;\r\n  display: flex;\r\n  flex-direction: column;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.filtro-topo {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 1rem;\r\n  margin-bottom: 2rem;\r\n  width: 100%;\r\n}\r\n\r\n.filtro-topo .button-medieval {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  padding: 0.8rem 1.2rem;\r\n  font-size: 1rem;\r\n  min-width: 160px;\r\n  \r\n  .svg-icon {\r\n    width: 20px;\r\n    height: 20px;\r\n  }\r\n}\r\n\r\n.ordenavel {\r\n  background-color: #c1a176 !important;\r\n  transform: scale(1.05);\r\n  box-shadow: 0 4px 16px rgba(60,40,20,0.13);\r\n}\r\n\r\n.calculator-form {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1.5rem;\r\n  margin-top: 1.5rem;\r\n}\r\n\r\n.input-icon-group {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n  margin-bottom: 0.5rem;\r\n}\r\n\r\n.input-medieval {\r\n  flex: 1;\r\n  padding: 0.8rem;\r\n  border: 2px solid #bfa76a;\r\n  border-radius: 8px;\r\n  font-family: 'MedievalSharp', serif;\r\n  font-size: 1rem;\r\n  background: #f8f3e6;\r\n  color: #5d4037;\r\n  transition: border-color 0.3s ease;\r\n  \r\n  &:focus {\r\n    outline: none;\r\n    border-color: #8b5e3c;\r\n    box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);\r\n  }\r\n  \r\n  &::placeholder {\r\n    color: #a67c52;\r\n    opacity: 0.7;\r\n  }\r\n}\r\n\r\n.calculator-actions {\r\n  display: flex;\r\n  gap: 1rem;\r\n  margin-top: 1rem;\r\n  \r\n  .button-medieval {\r\n    min-width: 120px;\r\n    padding: 0.8rem 1.5rem;\r\n    font-size: 1rem;\r\n  }\r\n}\r\n\r\n.result-display {\r\n  margin-top: 2rem;\r\n  padding: 1.5rem;\r\n  background: linear-gradient(135deg, #fdf8e4, #e8d9a5);\r\n  border: 2px solid #a07947;\r\n  border-radius: 8px;\r\n  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 6px rgba(0, 0, 0, 0.15);\r\n  \r\n  h3 {\r\n    font-family: 'MedievalSharp', serif;\r\n    font-size: 1.3rem;\r\n    color: #5b3e1d;\r\n    margin-bottom: 1rem;\r\n  }\r\n  \r\n  .result-text {\r\n    font-family: 'Georgia', serif;\r\n    font-size: 1.2rem;\r\n    color: #3b2a1a;\r\n    margin-bottom: 0.5rem;\r\n    \r\n    strong {\r\n      color: #8b5e3c;\r\n      font-size: 1.4rem;\r\n    }\r\n  }\r\n  \r\n  .result-subtext {\r\n    font-family: 'Georgia', serif;\r\n    font-size: 1rem;\r\n    color: #a67c52;\r\n    font-style: italic;\r\n  }\r\n}\r\n\r\n.form-row {\r\n  display: flex;\r\n  gap: 1.5rem;\r\n  margin-bottom: 1.2rem;\r\n}\r\n\r\n.form-col {\r\n  flex: 1 1 0;\r\n  display: flex;\r\n  flex-direction: column;\r\n  min-width: 180px;\r\n}\r\n\r\n.input-medieval,\r\n.select-medieval {\r\n  width: 100%;\r\n  min-width: 0;\r\n  box-sizing: border-box;\r\n}\r\n\r\n.select-medieval {\r\n  min-width: 180px;\r\n  margin: 0 0.5rem 0 0.5rem;\r\n  padding: 0.5rem;\r\n  border-radius: 8px;\r\n  border: 1.5px solid #bfa76a;\r\n  font-family: 'MedievalSharp', serif;\r\n  font-size: 1rem;\r\n  background: #f8f3e6;\r\n  color: #5d4037;\r\n  box-shadow: none;\r\n  transition: border-color 0.3s;\r\n  appearance: none;\r\n  -webkit-appearance: none;\r\n  -moz-appearance: none;\r\n}\r\n\r\n.select-medieval:focus {\r\n  outline: none;\r\n  border-color: #8b5e3c;\r\n  box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);\r\n}\r\n\r\n.select-medieval option {\r\n  font-family: 'MedievalSharp', serif;\r\n  color: #5d4037;\r\n  background: #f8f3e6;\r\n}\r\n\r\n// Checkbox medieval\r\n.checkbox-medieval {\r\n  accent-color: #bfa76a;\r\n  width: 18px;\r\n  height: 18px;\r\n  border-radius: 5px;\r\n  border: 1.5px solid #bfa76a;\r\n  background: #f8f3e6;\r\n  box-shadow: 0 1px 2px rgba(60,40,20,0.07);\r\n  margin-right: 0.5rem;\r\n}\r\n\r\n.checkbox-medieval:checked {\r\n  background: #bfa76a;\r\n  border-color: #8b5e3c;\r\n}\r\n\r\n.checkbox-medieval:focus {\r\n  outline: 2px solid #8b5e3c;\r\n}\r\n\r\n// Ajuste para label dos checkboxes\r\n.form-col label {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.3rem;\r\n  font-family: 'MedievalSharp', serif;\r\n  color: #5d4037;\r\n  font-size: 1rem;\r\n}\r\n\r\n.range-medieval {\r\n  accent-color: #bfa76a;\r\n  background: transparent;\r\n  height: 2px;\r\n  margin-top: 0.5rem;\r\n}\r\n\r\n.range-medieval::-webkit-slider-thumb {\r\n  background: #bfa76a;\r\n  border: 2px solid #8b5e3c;\r\n  border-radius: 50%;\r\n  width: 18px;\r\n  height: 18px;\r\n  cursor: pointer;\r\n}\r\n\r\n.range-medieval::-moz-range-thumb {\r\n  background: #bfa76a;\r\n  border: 2px solid #8b5e3c;\r\n  border-radius: 50%;\r\n  width: 18px;\r\n  height: 18px;\r\n  cursor: pointer;\r\n}\r\n\r\n.range-medieval::-ms-thumb {\r\n  background: #bfa76a;\r\n  border: 2px solid #8b5e3c;\r\n  border-radius: 50%;\r\n  width: 18px;\r\n  height: 18px;\r\n  cursor: pointer;\r\n}\r\n\r\n.range-medieval::-webkit-slider-runnable-track {\r\n  background: #e6caa1;\r\n  height: 4px;\r\n  border-radius: 2px;\r\n}\r\n\r\n.range-medieval::-ms-fill-lower,\r\n.range-medieval::-ms-fill-upper {\r\n  background: #e6caa1;\r\n}\r\n\r\n.range-medieval::-moz-range-track {\r\n  background: #e6caa1;\r\n  height: 4px;\r\n  border-radius: 2px;\r\n}\r\n\r\n.range-medieval:focus {\r\n  outline: none;\r\n}\r\n\r\n// Responsividade\r\n@media (max-width: 900px) {\r\n  .form-row {\r\n    flex-direction: column;\r\n    gap: 0.5rem;\r\n  }\r\n  .form-col {\r\n    min-width: 0;\r\n  }\r\n}\r\n\r\n@media (max-width: 768px) {\r\n  \r\n  .filtro-topo {\r\n    flex-direction: column;\r\n    \r\n    .button-medieval {\r\n      width: 100%;\r\n      max-width: 300px;\r\n      min-width: auto;\r\n    }\r\n  }\r\n  \r\n  .calculator-actions {\r\n    flex-direction: column;\r\n    \r\n    .button-medieval {\r\n      width: 100%;\r\n      max-width: 200px;\r\n    }\r\n  }\r\n  \r\n  .result-display {\r\n    padding: 1rem;\r\n    \r\n    h3 {\r\n      font-size: 1.1rem;\r\n    }\r\n    \r\n    .result-text {\r\n      font-size: 1rem;\r\n      \r\n      strong {\r\n        font-size: 1.2rem;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n@media (max-width: 480px) {\r\n  .filtro-topo {\r\n    margin-bottom: 1.5rem;\r\n  }\r\n  \r\n  .input-medieval {\r\n    font-size: 0.95rem;\r\n    padding: 0.7rem;\r\n  }\r\n  \r\n  .calculator-form {\r\n    gap: 1rem;\r\n  }\r\n  \r\n  .result-display {\r\n    margin-top: 1.5rem;\r\n    padding: 0.8rem;\r\n    \r\n    h3 {\r\n      font-size: 1rem;\r\n    }\r\n    \r\n    .result-text {\r\n      font-size: 0.95rem;\r\n      \r\n      strong {\r\n        font-size: 1.1rem;\r\n      }\r\n    }\r\n    \r\n    .result-subtext {\r\n      font-size: 0.9rem;\r\n    }\r\n  }\r\n} \r\n\r\n.exercise-result-medieval {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 1.2rem;\r\n  align-items: flex-start;\r\n  margin-top: 1.2rem;\r\n  background: none;\r\n  border: none;\r\n  box-shadow: none;\r\n}\r\n\r\n.exercise-result-medieval h3 {\r\n  align-self: center;\r\n  font-family: 'MedievalSharp', serif;\r\n  color: #5b3e1d;\r\n  font-size: 1.3rem;\r\n  margin-bottom: 0.7rem;\r\n  letter-spacing: 0.5px;\r\n}\r\n\r\n.result-row {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 1.1em;\r\n  font-size: 1.13rem;\r\n  margin-bottom: 0.35em;\r\n  flex-wrap: wrap;\r\n  line-height: 1.7;\r\n}\r\n\r\n.result-icon {\r\n  width: 20px;\r\n  height: 20px;\r\n  margin-right: 0.3em;\r\n  vertical-align: middle;\r\n  filter: drop-shadow(0 1px 2px #e8d9a5);\r\n}\r\n\r\n.result-label {\r\n  font-weight: bold;\r\n  color: #7a5a2f;\r\n  margin-right: 0.4em;\r\n  font-family: 'MedievalSharp', serif;\r\n  font-size: 1.8rem;\r\n  letter-spacing: 0.2px;\r\n}\r\n\r\n.exercise-result-medieval span, .exercise-result-medieval b {\r\n  font-family: 'Georgia', serif;\r\n  color: #3b2a1a;\r\n  font-size: 1.13rem;\r\n  line-height: 1.7;\r\n}\r\n\r\n.exercise-result-medieval b {\r\n  font-weight: bold;\r\n  color: #8b5e3c;\r\n  font-size: 1.13rem;\r\n} \r\n\r\n.loot-result-medieval {\r\n  margin-top: 2.2rem;\r\n  padding: 1.2rem 1.5rem 1.5rem 1.5rem;\r\n  border-radius: 14px;\r\n  border: none;\r\n  box-shadow: none;\r\n  font-family: 'Georgia', serif;\r\n  color: #3b2a1a;\r\n  font-size: 1.08rem;\r\n}\r\n\r\n.loot-totals-row {\r\n  display: flex;\r\n  gap: 2.5em;\r\n  align-items: flex-end;\r\n  margin-bottom: 0.2em;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.loot-total {\r\n  display: flex;\r\n  align-items: center;\r\n  font-size: 1.18rem;\r\n  font-family: 'MedievalSharp', serif;\r\n  font-weight: bold;\r\n  gap: 0.3em;\r\n}\r\n.loot-total-loot {\r\n  color: #bfa66b;\r\n}\r\n.loot-total-supplies {\r\n  color: #4e9a51;\r\n}\r\n.loot-total-balance {\r\n  color: #7a5a2f;\r\n}\r\n\r\n.loot-icon-big {\r\n  width: 20px;\r\n  height: 20px;\r\n  margin-right: 0.2em;\r\n  vertical-align: middle;\r\n  filter: drop-shadow(0 1px 2px #e8d9a5);\r\n}\r\n\r\n.loot-balance-explanation {\r\n  font-size: 0.98rem;\r\n  color: #8c7a5b;\r\n  margin-bottom: 0.7em;\r\n  margin-left: 0.2em;\r\n  font-style: italic;\r\n}\r\n\r\n.loot-transfer-total-row {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 1.1em;\r\n  margin-top: 0.7em;\r\n  font-size: 1rem;\r\n}\r\n\r\n.loot-header-row {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 1.1em;\r\n  margin-bottom: 0.35em;\r\n}\r\n\r\n\r\n\r\n.loot-session-date {\r\n  font-family: 'Georgia', serif;\r\n  color: #3b2a1a;\r\n  font-size: 1em;\r\n  margin-right: 0.7em;\r\n}\r\n\r\n\r\n\r\n.loot-team-row {\r\n  display: flex;\r\n  gap: 2.2em;\r\n  margin-bottom: 0.7em;\r\n  align-items: center;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.loot-transfer-row {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 1.1em;\r\n  margin-bottom: 0.35em;\r\n  font-size: 1rem;\r\n  flex-wrap: nowrap;\r\n  line-height: 1.7;\r\n}\r\n\r\n.loot-transfer-names {\r\n  display: flex;\r\n  align-items: center;\r\n  white-space: nowrap;\r\n  font-family: 'Georgia', serif;\r\n  color: #3b2a1a;\r\n  font-size: 1rem;\r\n  line-height: 1.7;\r\n}\r\n\r\n.loot-gold-group {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.3em;\r\n  font-size: 1rem;\r\n}\r\n\r\n.loot-gold {\r\n  color: #8b5e3c;\r\n  font-weight: bold;\r\n  font-family: 'Georgia', serif;\r\n  margin-right: 0.2em;\r\n}\r\n\r\n.arrow {\r\n  font-size: 1.1em;\r\n  margin: 0 0.2em;\r\n}\r\n\r\n.loot-profit-row {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 1.1em;\r\n  margin-bottom: 0.3em;\r\n  font-size: 1rem;\r\n}\r\n\r\n.loot-players-row {\r\n  margin-top: 0.2em;\r\n  font-size: 1rem;\r\n  color: #5b3e1d;\r\n}\r\n\r\n.copy-btn {\r\n  background: #fdf8e4;\r\n  border: 1.5px solid #a67c52;\r\n  border-radius: 7px;\r\n  padding: 0.18em 0.7em 0.18em 0.5em;\r\n  margin-left: 0.3em;\r\n  font-family: 'MedievalSharp', serif;\r\n  font-size: 1rem;\r\n  color: #7a5a2f;\r\n  cursor: pointer;\r\n  transition: background 0.2s, box-shadow 0.2s;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 0.3em;\r\n  height: 2.1em;\r\n  vertical-align: middle;\r\n}\r\n.copy-btn img {\r\n  width: 20px;\r\n  height: 20px;\r\n  margin: 0;\r\n  display: block;\r\n}\r\n.copy-btn:hover {\r\n  background: #f4e6b3;\r\n  box-shadow: 0 2px 8px rgba(60,40,20,0.08);\r\n}\r\n.copy-all-btn {\r\n  font-weight: bold;\r\n  font-size: 1rem;\r\n  padding: 0.22em 1.1em 0.22em 0.7em;\r\n} \r\n\r\n.copy-check {\r\n  width: 20px;\r\n  height: 20px;\r\n  margin-left: 0.2em;\r\n  vertical-align: middle;\r\n  opacity: 1;\r\n  transition: opacity 0.3s;\r\n  animation: fadeInOut 1.2s;\r\n}\r\n\r\n@keyframes fadeInOut {\r\n  0% { opacity: 0; }\r\n  10% { opacity: 1; }\r\n  90% { opacity: 1; }\r\n  100% { opacity: 0; }\r\n} \r\n\r\n// Stamina Calculator Layout\r\n.stamina-form-medieval {\r\n  width: 100%;\r\n  margin-top: 1.5rem;\r\n}\r\n.stamina-fields-row {\r\n  display: flex;\r\n  gap: 2rem;\r\n  justify-content: center;\r\n  align-items: flex-end;\r\n  margin-bottom: 1.5rem;\r\n  flex-wrap: wrap;\r\n}\r\n.stamina-field-col {\r\n  display: flex;\r\n  flex-direction: column;\r\n  min-width: 220px;\r\n  flex: 1 1 220px;\r\n}\r\n.stamina-field-col label {\r\n  font-family: 'MedievalSharp', serif;\r\n  color: #7a5a2f;\r\n  font-size: 1.08rem;\r\n  margin-bottom: 0.5em;\r\n  text-align: left;\r\n}\r\n.stamina-field-col input {\r\n  width: 100%;\r\n  font-size: 1.15rem;\r\n  padding: 0.7em 1em;\r\n  border-radius: 8px;\r\n  border: 2px solid #bfa76a;\r\n  background: #f8f3e6;\r\n  color: #5d4037;\r\n  font-family: 'Georgia', serif;\r\n}\r\n.stamina-actions-row {\r\n  display: flex;\r\n  justify-content: center;\r\n  gap: 1.5rem;\r\n  margin-top: 0.5rem;\r\n}\r\n.stamina-actions-row .button-medieval {\r\n  min-width: 120px;\r\n  font-size: 1.08rem;\r\n  padding: 0.7em 1.5em;\r\n}\r\n\r\n// Resultado destacado\r\n.stamina-result-medieval {\r\n  margin-top: 2rem;\r\n  padding: 1.5rem 2rem;\r\n  background: linear-gradient(135deg, #fdf8e4 80%, #e8d9a5 100%);\r\n  border: 2px solid #bfa76a;\r\n  border-radius: 12px;\r\n  box-shadow: 0 2px 8px rgba(60,40,20,0.07);\r\n  font-family: 'Georgia', serif;\r\n  color: #3b2a1a;\r\n  font-size: 1.15rem;\r\n  max-width: 500px;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n.stamina-result-medieval h3 {\r\n  font-family: 'MedievalSharp', serif;\r\n  color: #7a5a2f;\r\n  font-size: 1.25rem;\r\n  margin-bottom: 1.2rem;\r\n  text-align: center;\r\n}\r\n.stamina-result-row {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 0.7em;\r\n  font-size: 1.13rem;\r\n}\r\n.stamina-result-label {\r\n  font-family: 'MedievalSharp', serif;\r\n  color: #7a5a2f;\r\n  font-weight: bold;\r\n  font-size: 1.08rem;\r\n}\r\n.stamina-result-value {\r\n  font-family: 'Georgia', serif;\r\n  color: #8b5e3c;\r\n  font-size: 1.13rem;\r\n  font-weight: bold;\r\n  margin-left: 1em;\r\n}\r\n\r\n// Responsividade\r\n@media (max-width: 700px) {\r\n  .stamina-fields-row {\r\n    flex-direction: column;\r\n    gap: 1rem;\r\n    align-items: stretch;\r\n  }\r\n  .stamina-result-medieval {\r\n    padding: 1rem 0.5rem;\r\n  }\r\n} \r\n\r\n ",".parchment-card {\n  width: 100% !important;\n  max-width: none !important;\n  box-sizing: border-box;\n}\n\n.consulta-layout {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 3em;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n}\n\n.filtro-topo {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  margin-bottom: 2rem;\n  width: 100%;\n}\n\n.filtro-topo .button-medieval {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.8rem 1.2rem;\n  font-size: 1rem;\n  min-width: 160px;\n}\n.filtro-topo .button-medieval .svg-icon {\n  width: 20px;\n  height: 20px;\n}\n\n.ordenavel {\n  background-color: #c1a176 !important;\n  transform: scale(1.05);\n  box-shadow: 0 4px 16px rgba(60, 40, 20, 0.13);\n}\n\n.calculator-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  margin-top: 1.5rem;\n}\n\n.input-icon-group {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-bottom: 0.5rem;\n}\n\n.input-medieval {\n  flex: 1;\n  padding: 0.8rem;\n  border: 2px solid #bfa76a;\n  border-radius: 8px;\n  font-family: \"MedievalSharp\", serif;\n  font-size: 1rem;\n  background: #f8f3e6;\n  color: #5d4037;\n  transition: border-color 0.3s ease;\n}\n.input-medieval:focus {\n  outline: none;\n  border-color: #8b5e3c;\n  box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);\n}\n.input-medieval::placeholder {\n  color: #a67c52;\n  opacity: 0.7;\n}\n\n.calculator-actions {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.calculator-actions .button-medieval {\n  min-width: 120px;\n  padding: 0.8rem 1.5rem;\n  font-size: 1rem;\n}\n\n.result-display {\n  margin-top: 2rem;\n  padding: 1.5rem;\n  background: linear-gradient(135deg, #fdf8e4, #e8d9a5);\n  border: 2px solid #a07947;\n  border-radius: 8px;\n  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 6px rgba(0, 0, 0, 0.15);\n}\n.result-display h3 {\n  font-family: \"MedievalSharp\", serif;\n  font-size: 1.3rem;\n  color: #5b3e1d;\n  margin-bottom: 1rem;\n}\n.result-display .result-text {\n  font-family: \"Georgia\", serif;\n  font-size: 1.2rem;\n  color: #3b2a1a;\n  margin-bottom: 0.5rem;\n}\n.result-display .result-text strong {\n  color: #8b5e3c;\n  font-size: 1.4rem;\n}\n.result-display .result-subtext {\n  font-family: \"Georgia\", serif;\n  font-size: 1rem;\n  color: #a67c52;\n  font-style: italic;\n}\n\n.form-row {\n  display: flex;\n  gap: 1.5rem;\n  margin-bottom: 1.2rem;\n}\n\n.form-col {\n  flex: 1 1 0;\n  display: flex;\n  flex-direction: column;\n  min-width: 180px;\n}\n\n.input-medieval,\n.select-medieval {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n\n.select-medieval {\n  min-width: 180px;\n  margin: 0 0.5rem 0 0.5rem;\n  padding: 0.5rem;\n  border-radius: 8px;\n  border: 1.5px solid #bfa76a;\n  font-family: \"MedievalSharp\", serif;\n  font-size: 1rem;\n  background: #f8f3e6;\n  color: #5d4037;\n  box-shadow: none;\n  transition: border-color 0.3s;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\n\n.select-medieval:focus {\n  outline: none;\n  border-color: #8b5e3c;\n  box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);\n}\n\n.select-medieval option {\n  font-family: \"MedievalSharp\", serif;\n  color: #5d4037;\n  background: #f8f3e6;\n}\n\n.checkbox-medieval {\n  accent-color: #bfa76a;\n  width: 18px;\n  height: 18px;\n  border-radius: 5px;\n  border: 1.5px solid #bfa76a;\n  background: #f8f3e6;\n  box-shadow: 0 1px 2px rgba(60, 40, 20, 0.07);\n  margin-right: 0.5rem;\n}\n\n.checkbox-medieval:checked {\n  background: #bfa76a;\n  border-color: #8b5e3c;\n}\n\n.checkbox-medieval:focus {\n  outline: 2px solid #8b5e3c;\n}\n\n.form-col label {\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  font-family: \"MedievalSharp\", serif;\n  color: #5d4037;\n  font-size: 1rem;\n}\n\n.range-medieval {\n  accent-color: #bfa76a;\n  background: transparent;\n  height: 2px;\n  margin-top: 0.5rem;\n}\n\n.range-medieval::-webkit-slider-thumb {\n  background: #bfa76a;\n  border: 2px solid #8b5e3c;\n  border-radius: 50%;\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n}\n\n.range-medieval::-moz-range-thumb {\n  background: #bfa76a;\n  border: 2px solid #8b5e3c;\n  border-radius: 50%;\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n}\n\n.range-medieval::-ms-thumb {\n  background: #bfa76a;\n  border: 2px solid #8b5e3c;\n  border-radius: 50%;\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n}\n\n.range-medieval::-webkit-slider-runnable-track {\n  background: #e6caa1;\n  height: 4px;\n  border-radius: 2px;\n}\n\n.range-medieval::-ms-fill-lower,\n.range-medieval::-ms-fill-upper {\n  background: #e6caa1;\n}\n\n.range-medieval::-moz-range-track {\n  background: #e6caa1;\n  height: 4px;\n  border-radius: 2px;\n}\n\n.range-medieval:focus {\n  outline: none;\n}\n\n@media (max-width: 900px) {\n  .form-row {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .form-col {\n    min-width: 0;\n  }\n}\n@media (max-width: 768px) {\n  .filtro-topo {\n    flex-direction: column;\n  }\n  .filtro-topo .button-medieval {\n    width: 100%;\n    max-width: 300px;\n    min-width: auto;\n  }\n  .calculator-actions {\n    flex-direction: column;\n  }\n  .calculator-actions .button-medieval {\n    width: 100%;\n    max-width: 200px;\n  }\n  .result-display {\n    padding: 1rem;\n  }\n  .result-display h3 {\n    font-size: 1.1rem;\n  }\n  .result-display .result-text {\n    font-size: 1rem;\n  }\n  .result-display .result-text strong {\n    font-size: 1.2rem;\n  }\n}\n@media (max-width: 480px) {\n  .filtro-topo {\n    margin-bottom: 1.5rem;\n  }\n  .input-medieval {\n    font-size: 0.95rem;\n    padding: 0.7rem;\n  }\n  .calculator-form {\n    gap: 1rem;\n  }\n  .result-display {\n    margin-top: 1.5rem;\n    padding: 0.8rem;\n  }\n  .result-display h3 {\n    font-size: 1rem;\n  }\n  .result-display .result-text {\n    font-size: 0.95rem;\n  }\n  .result-display .result-text strong {\n    font-size: 1.1rem;\n  }\n  .result-display .result-subtext {\n    font-size: 0.9rem;\n  }\n}\n.exercise-result-medieval {\n  display: flex;\n  flex-direction: column;\n  gap: 1.2rem;\n  align-items: flex-start;\n  margin-top: 1.2rem;\n  background: none;\n  border: none;\n  box-shadow: none;\n}\n\n.exercise-result-medieval h3 {\n  align-self: center;\n  font-family: \"MedievalSharp\", serif;\n  color: #5b3e1d;\n  font-size: 1.3rem;\n  margin-bottom: 0.7rem;\n  letter-spacing: 0.5px;\n}\n\n.result-row {\n  display: flex;\n  align-items: center;\n  gap: 1.1em;\n  font-size: 1.13rem;\n  margin-bottom: 0.35em;\n  flex-wrap: wrap;\n  line-height: 1.7;\n}\n\n.result-icon {\n  width: 20px;\n  height: 20px;\n  margin-right: 0.3em;\n  vertical-align: middle;\n  filter: drop-shadow(0 1px 2px #e8d9a5);\n}\n\n.result-label {\n  font-weight: bold;\n  color: #7a5a2f;\n  margin-right: 0.4em;\n  font-family: \"MedievalSharp\", serif;\n  font-size: 1.8rem;\n  letter-spacing: 0.2px;\n}\n\n.exercise-result-medieval span, .exercise-result-medieval b {\n  font-family: \"Georgia\", serif;\n  color: #3b2a1a;\n  font-size: 1.13rem;\n  line-height: 1.7;\n}\n\n.exercise-result-medieval b {\n  font-weight: bold;\n  color: #8b5e3c;\n  font-size: 1.13rem;\n}\n\n.loot-result-medieval {\n  margin-top: 2.2rem;\n  padding: 1.2rem 1.5rem 1.5rem 1.5rem;\n  border-radius: 14px;\n  border: none;\n  box-shadow: none;\n  font-family: \"Georgia\", serif;\n  color: #3b2a1a;\n  font-size: 1.08rem;\n}\n\n.loot-totals-row {\n  display: flex;\n  gap: 2.5em;\n  align-items: flex-end;\n  margin-bottom: 0.2em;\n  flex-wrap: wrap;\n}\n\n.loot-total {\n  display: flex;\n  align-items: center;\n  font-size: 1.18rem;\n  font-family: \"MedievalSharp\", serif;\n  font-weight: bold;\n  gap: 0.3em;\n}\n\n.loot-total-loot {\n  color: #bfa66b;\n}\n\n.loot-total-supplies {\n  color: #4e9a51;\n}\n\n.loot-total-balance {\n  color: #7a5a2f;\n}\n\n.loot-icon-big {\n  width: 20px;\n  height: 20px;\n  margin-right: 0.2em;\n  vertical-align: middle;\n  filter: drop-shadow(0 1px 2px #e8d9a5);\n}\n\n.loot-balance-explanation {\n  font-size: 0.98rem;\n  color: #8c7a5b;\n  margin-bottom: 0.7em;\n  margin-left: 0.2em;\n  font-style: italic;\n}\n\n.loot-transfer-total-row {\n  display: flex;\n  align-items: center;\n  gap: 1.1em;\n  margin-top: 0.7em;\n  font-size: 1rem;\n}\n\n.loot-header-row {\n  display: flex;\n  align-items: center;\n  gap: 1.1em;\n  margin-bottom: 0.35em;\n}\n\n.loot-session-date {\n  font-family: \"Georgia\", serif;\n  color: #3b2a1a;\n  font-size: 1em;\n  margin-right: 0.7em;\n}\n\n.loot-team-row {\n  display: flex;\n  gap: 2.2em;\n  margin-bottom: 0.7em;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n.loot-transfer-row {\n  display: flex;\n  align-items: center;\n  gap: 1.1em;\n  margin-bottom: 0.35em;\n  font-size: 1rem;\n  flex-wrap: nowrap;\n  line-height: 1.7;\n}\n\n.loot-transfer-names {\n  display: flex;\n  align-items: center;\n  white-space: nowrap;\n  font-family: \"Georgia\", serif;\n  color: #3b2a1a;\n  font-size: 1rem;\n  line-height: 1.7;\n}\n\n.loot-gold-group {\n  display: flex;\n  align-items: center;\n  gap: 0.3em;\n  font-size: 1rem;\n}\n\n.loot-gold {\n  color: #8b5e3c;\n  font-weight: bold;\n  font-family: \"Georgia\", serif;\n  margin-right: 0.2em;\n}\n\n.arrow {\n  font-size: 1.1em;\n  margin: 0 0.2em;\n}\n\n.loot-profit-row {\n  display: flex;\n  align-items: center;\n  gap: 1.1em;\n  margin-bottom: 0.3em;\n  font-size: 1rem;\n}\n\n.loot-players-row {\n  margin-top: 0.2em;\n  font-size: 1rem;\n  color: #5b3e1d;\n}\n\n.copy-btn {\n  background: #fdf8e4;\n  border: 1.5px solid #a67c52;\n  border-radius: 7px;\n  padding: 0.18em 0.7em 0.18em 0.5em;\n  margin-left: 0.3em;\n  font-family: \"MedievalSharp\", serif;\n  font-size: 1rem;\n  color: #7a5a2f;\n  cursor: pointer;\n  transition: background 0.2s, box-shadow 0.2s;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3em;\n  height: 2.1em;\n  vertical-align: middle;\n}\n\n.copy-btn img {\n  width: 20px;\n  height: 20px;\n  margin: 0;\n  display: block;\n}\n\n.copy-btn:hover {\n  background: #f4e6b3;\n  box-shadow: 0 2px 8px rgba(60, 40, 20, 0.08);\n}\n\n.copy-all-btn {\n  font-weight: bold;\n  font-size: 1rem;\n  padding: 0.22em 1.1em 0.22em 0.7em;\n}\n\n.copy-check {\n  width: 20px;\n  height: 20px;\n  margin-left: 0.2em;\n  vertical-align: middle;\n  opacity: 1;\n  transition: opacity 0.3s;\n  animation: fadeInOut 1.2s;\n}\n\n@keyframes fadeInOut {\n  0% {\n    opacity: 0;\n  }\n  10% {\n    opacity: 1;\n  }\n  90% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.stamina-form-medieval {\n  width: 100%;\n  margin-top: 1.5rem;\n}\n\n.stamina-fields-row {\n  display: flex;\n  gap: 2rem;\n  justify-content: center;\n  align-items: flex-end;\n  margin-bottom: 1.5rem;\n  flex-wrap: wrap;\n}\n\n.stamina-field-col {\n  display: flex;\n  flex-direction: column;\n  min-width: 220px;\n  flex: 1 1 220px;\n}\n\n.stamina-field-col label {\n  font-family: \"MedievalSharp\", serif;\n  color: #7a5a2f;\n  font-size: 1.08rem;\n  margin-bottom: 0.5em;\n  text-align: left;\n}\n\n.stamina-field-col input {\n  width: 100%;\n  font-size: 1.15rem;\n  padding: 0.7em 1em;\n  border-radius: 8px;\n  border: 2px solid #bfa76a;\n  background: #f8f3e6;\n  color: #5d4037;\n  font-family: \"Georgia\", serif;\n}\n\n.stamina-actions-row {\n  display: flex;\n  justify-content: center;\n  gap: 1.5rem;\n  margin-top: 0.5rem;\n}\n\n.stamina-actions-row .button-medieval {\n  min-width: 120px;\n  font-size: 1.08rem;\n  padding: 0.7em 1.5em;\n}\n\n.stamina-result-medieval {\n  margin-top: 2rem;\n  padding: 1.5rem 2rem;\n  background: linear-gradient(135deg, #fdf8e4 80%, #e8d9a5 100%);\n  border: 2px solid #bfa76a;\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(60, 40, 20, 0.07);\n  font-family: \"Georgia\", serif;\n  color: #3b2a1a;\n  font-size: 1.15rem;\n  max-width: 500px;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.stamina-result-medieval h3 {\n  font-family: \"MedievalSharp\", serif;\n  color: #7a5a2f;\n  font-size: 1.25rem;\n  margin-bottom: 1.2rem;\n  text-align: center;\n}\n\n.stamina-result-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 0.7em;\n  font-size: 1.13rem;\n}\n\n.stamina-result-label {\n  font-family: \"MedievalSharp\", serif;\n  color: #7a5a2f;\n  font-weight: bold;\n  font-size: 1.08rem;\n}\n\n.stamina-result-value {\n  font-family: \"Georgia\", serif;\n  color: #8b5e3c;\n  font-size: 1.13rem;\n  font-weight: bold;\n  margin-left: 1em;\n}\n\n@media (max-width: 700px) {\n  .stamina-fields-row {\n    flex-direction: column;\n    gap: 1rem;\n    align-items: stretch;\n  }\n  .stamina-result-medieval {\n    padding: 1rem 0.5rem;\n  }\n}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ })

}]);
//# sourceMappingURL=src_app_components_calculators_calculators_component_ts.js.map