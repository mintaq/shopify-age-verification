// var $
let ageV_settings;
let ageV_installedShop;
let _otSettings = {
  storage: "sessionStorage",
  storageExpires: null,
  underAgeMsg:
    "Sorry, you are not old enough to view this site! You will be redirected soon...",
  errorMsg: {
    invalidDay: "Day is invalid or empty",
    invalidYear: "Year is invalid or empty",
  },
};
let _otThis = {
  age: "",
  month: "",
  day: "",
  year: "",
  errors: [],
  getValues() {
    _otThis.month = $(".ot-av-datepicker-fields .av-month").val();
    _otThis.day = $(".ot-av-datepicker-fields .av-day")
      .val()
      .replace(/^0+/, "");
    _otThis.year = $(".ot-av-datepicker-fields .av-year").val();
  },
  validateValues() {
    _otThis.errors = [];
    if (/^([0-9]|[12]\d|3[0-1])$/.test(_otThis.day) === false) {
      _otThis.errors.push(_otSettings.errorMsg.invalidDay);
    }
    if (/^(19|20)\d{2}$/.test(_otThis.year) === false) {
      _otThis.errors.push(_otSettings.errorMsg.invalidYear);
    }
    _otThis.clearErrors();
    _otThis.displayErrors();
    return _otThis.errors.length < 1;
  },
  setAge() {
    _otThis.age = "";
    const birthday = new Date(_otThis.year, _otThis.month, _otThis.day);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs);
    _otThis.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  },
  clearErrors() {
    $(".otAgeVerification .ot-av-error").html("");
  },
  displayErrors() {
    let html = "<ul>";
    for (let i = 0; i < _otThis.errors.length; i++) {
      html += `<li><span>*</span>${_otThis.errors[i]}</li>`;
    }
    html += "</ul>";
    $(".otAgeVerification .ot-av-error").html(html);
  },
  getStorage() {
    if (_otSettings.storage === "cookie") {
      return document.cookie
        .split(";")
        .filter((item) => item.trim().startsWith("otAgeVerification=")).length;
    } else {
      return storage.getItem("otAgeVerification") === "true";
    }
  },
  setStorage(key, val, expires) {
    try {
      if (settings.storage === "cookie") {
        if (expires) {
          let date = new Date();
          date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
          expires = date.toGMTString();
        }
        document.cookie = "otAgeVerification=true; expires=" + expires + ";";
      } else {
        storage.setItem(key, val);
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  checkOnTrial() {
    const createdDateMs = new Date(ageV_installedShop.installed_date).getTime();
    const _7daysMs = 7 * 24 * 60 * 60 * 1000;
    const nowDate = new Date().getTime();

    nowDate - createdDateMs < _7daysMs
      ? (_isOnTrial = true)
      : (_isOnTrial = false);
  },
  checkChargeStatus() {
    const { status } = ageV_installedShop;

    if (status == "active") _isActivated = true;
    else _isActivated = false;
  },
  handleSuccess() {
    setCookie(
      "_otRememberDays",
      "1",
      Number.parseInt(ageV_settings.cache_time)
    );
    $("body").removeClass("stopScrolling");
    $(".otAgeVerification").fadeOut();
  },
  handleUnderAge() {
    const underAgeMsg = `<h3>${ageV_settings.validate_error}</h3>`;
    $(".otAgeVerification .ot-av-error").html(underAgeMsg);
    if (ageV_settings.exit_link !== "") {
      setTimeout(() => {
        window.location.replace(ageV_settings.exit_link);
      }, 2000);
    } else {
      setTimeout(() => {
        window.location.replace("https://www.google.com");
      }, 2000);
    }
  },
};
let _lsBlockLocations;
let _lsBlockProducts;
let _lsAppStatus;
let _isVerified = getCookie("_otRememberDays");
let _isActivated;
let _isOnTrial;

// if (typeof omega_ageV == "undefined") {
var omega_ageV = 1;
var omega_ageV_shopDomain = Shopify.shop;
var rootLinkAgeV_Server = "https://f5fd1a9b869f.ngrok.io";
// var rootLinkAgeV_File =
//   "https://minhlocal.omegatheme.com/age-verification-omega";
var rootLinkAgeV_File = "https://minh.omegatheme.com";

// ******* INIT
(function () {
  var loadScript = function (url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    // If the browser is Internet Explorer.
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
      // For any other browser.
    } else {
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  var myAppJavaScript = function ($) {
    $("head").append(`
        <link href='${rootLinkAgeV_File}/age-verification.css?v=${Math.floor(
      Math.random() * 100000
    )}' rel='stylesheet' type='text/css'>
        <link href="https://fonts.googleapis.com/css?family=Oswald:400,700"  rel="stylesheet" />
      `);

    $.ajax({
      url: `${rootLinkAgeV_Server}/api/shops/public/user_settings/${omega_ageV_shopDomain}`,
      type: "GET",
      dataType: "json",
    }).done((result) => {
      ageV_installedShop = result;

      _otThis.checkOnTrial();
      _otThis.checkChargeStatus();

      if (_isOnTrial || _isActivated) {
        $.ajax({
          url: `${rootLinkAgeV_Server}/api/shops/settings/${omega_ageV_shopDomain}`,
          type: "GET",
          dataType: "json",
        }).done((result) => {
          ageV_settings = result;
          setLocalStorage();
          getLocalStorage();
          if (_lsAppStatus == "enable" && !_isVerified) {
            if (
              (_lsBlockLocations.includes("all") ||
                _lsBlockLocations.includes(__st.p)) &&
              __st.p != "product"
            ) {
              $(".otInitBlock").fadeOut();
              $("body").addClass("stopScrolling");
              $("body").append("<div class='otAgeVerification'></div>");
              omega_displayAgeVerifyModal();
            } else if (
              _lsBlockLocations.includes("product") &&
              __st.p == "product"
            ) {
              if (_lsBlockProducts.includes(__st.rid + "")) {
                $(".otInitBlock").fadeOut();
                $("body").addClass("stopScrolling");
                $("body").append("<div class='otAgeVerification'></div>");
                omega_displayAgeVerifyModal();
              }
            }
          }
        });
      } else return;
    });

    function omega_displayAgeVerifyModal() {
      // const { layoutSettings, styleSettings, advanceSettings } = ageV_settings;
      // const { exitUrl } = advanceSettings;
      var layoutCSS = "";
      var styleCSS = "";
      var customCSS = "";
      var otLogo = "";

      // BACKGROUND IMAGE
      if (ageV_settings.av_layout != 2 && ageV_settings.popup_bg != null) {
        layoutCSS += `.otAgeVerification #ot-av-overlay-wrap {
            background-image: url(${ageV_settings.popup_bg});
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }`;
      } else {
        layoutCSS += `.otAgeVerification #ot-av-overlay-wrap { 
            background-color: ${convertRgbToString(
              JSON.parse(ageV_settings.overlayBgColor)
            )};
        }`;
      }

      // LOGO
      if (ageV_settings.logo != null) {
        otLogo = `<div class='ot-logo-image'><img src="${ageV_settings.logo}"/></div>`;
      }

      // OTHER STUFF
      styleCSS += `
        .otAgeVerification #ot-av-overlay-form {
          background-color: ${convertRgbToString(
            JSON.parse(ageV_settings.popupBgColor)
          )};
        }
        .otAgeVerification h1.ot-headline_text {
          font-size: ${ageV_settings.headlineTextSize}px;
          color: ${convertRgbToString(
            JSON.parse(ageV_settings.headlineTextColor)
          )};
        }
        .otAgeVerification .ot-subhead_text {
          font-size: ${ageV_settings.subHeadlineTextSize}px;
          color: ${convertRgbToString(
            JSON.parse(ageV_settings.subHeadlineTextColor)
          )};
        }
        .otAgeVerification .ot-av-submit-btn {
          background-color: ${convertRgbToString(
            JSON.parse(ageV_settings.submitBtnBgColor)
          )};
          color: ${convertRgbToString(
            JSON.parse(ageV_settings.submitBtnLabelColor)
          )};
        }
        .otAgeVerification .ot-av-cancel-btn {
          background-color: ${convertRgbToString(
            JSON.parse(ageV_settings.cancelBtnBgColor)
          )};
          color: ${convertRgbToString(
            JSON.parse(ageV_settings.cancelBtnLabelColor)
          )};
        }
      `;

      customCSS = ageV_settings.customcss;

      // MAIN DIV
      $(".otAgeVerification").append(`
          <style>
            ${layoutCSS}
            ${styleCSS}
            ${customCSS}
          </style>
          <div id='ot-av-overlay-wrap'>
            <div id='ot-av-overlay-form'>
              ${otLogo}
              <h1 class='ot-headline_text'>${ageV_settings.headline_text}</h1>
              <p class='ot-subhead_text' id='ot-subhead_text'>${ageV_settings.subhead_text}</p>
            </div>
          </div>
      `);

      if (ageV_settings.input_age == 1) {
        const customMonths = JSON.parse(ageV_settings.custom_date);
        var months = "";

        const customMonthsKeys = Object.keys(customMonths);
        for (let i = 0; i < customMonthsKeys.length; i++) {
          months += `<option value="${i + 1}">${
            customMonths[customMonthsKeys[i]]
          }</option>`;
        }

        $(".otAgeVerification #ot-av-overlay-form").append(`
          <div class='ot-av-datepicker-fields'>
            <select class='av-month'>
              ${months}
            </select>
            <input type='text' class='av-day' maxlength="2" placeholder="01"/>
            <input type='text' class='av-year' maxlength="4" placeholder="1998"/>
          </div>
          <div class="ot-av-error"></div>
          <div class='ot-av-submit-form'>
            <button onclick='omega_ageCheckSubmit()' class='ot-av-submit-btn'>${
              ageV_settings.submit_label
            }</button>
            <button onclick="window.location.replace('${
              ageV_settings.exit_link === ""
                ? "https://www.google.com"
                : ageV_settings.exit_link
            }')" class='ot-av-cancel-btn'>${ageV_settings.cancel_label}</button>
          </div>
        `);
      } else {
        $(".otAgeVerification #ot-av-overlay-form").append(`
          <div class="ot-av-error"></div>
          <div class='ot-av-submit-form'>
            <button onclick='omega_ageCheckSubmit()' class='ot-av-submit-btn'>${
              ageV_settings.submit_label
            }</button>
            <button onclick="window.location.replace('${
              ageV_settings.exit_link === ""
                ? "https://www.google.com"
                : ageV_settings.exit_link
            }')" class='ot-av-cancel-btn'>${ageV_settings.cancel_label}</button>
          </div>
        `);
      }
      $(".otAgeVerification").fadeIn();
    }
  };

  if (typeof jQuery === "undefined" || parseFloat(jQuery.fn.jquery) < 1.7) {
    loadScript(
      "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
      function () {
        jQuery191 = jQuery.noConflict(true);
        myAppJavaScript(jQuery191);
      }
    );
  } else {
    myAppJavaScript(jQuery);
  }
})();
// ********* DONE

// }

// HELPERS
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function setLocalStorage() {
  const popupDisplaySelected = JSON.parse(ageV_settings.popupDisplaySelected);
  const blockProducts = JSON.parse(ageV_settings.blockProducts);

  // SET APP STATUS
  if (ageV_settings.app_enable == 1) {
    localStorage.setItem("_otAgeVerification", "enable");
  } else {
    localStorage.setItem("_otAgeVerification", "disable");
  }

  // SET BLOCK PRODUCTS
  if (Array.isArray(popupDisplaySelected)) {
    if (blockProducts.length > 0) {
      const blockProdRIds = [];
      blockProducts.map(({ rid }) => {
        return blockProdRIds.push(rid);
      });
      localStorage.setItem("_otBlockProducts", blockProdRIds);
    }
  }
  // SET BLOCK PAGES
  if (Array.isArray(popupDisplaySelected)) {
    if (popupDisplaySelected.length > 0) {
      localStorage.setItem("_otBlockLocations", popupDisplaySelected);
    }
  }
}
function getLocalStorage() {
  _lsBlockLocations = localStorage.getItem("_otBlockLocations").split(",");
  _lsBlockProducts = localStorage.getItem("_otBlockProducts").split(",");
  _lsAppStatus = localStorage.getItem("_otAgeVerification");
}

function convertRgbToString(value) {
  let color = `rgba(${value.r},${value.g},${value.b},${value.a})`;
  return color;
}

function omega_ageCheckSubmit() {
  if (ageV_settings.input_age == 1) {
    _otThis.getValues();
    if (_otThis.validateValues() === true) {
      _otThis.setAge();
      if (_otThis.age >= ageV_settings.min_age) {
        _otThis.handleSuccess();
      } else {
        _otThis.handleUnderAge();
      }
    }
  } else {
    _otThis.handleSuccess();
  }
}
