// var $
let ageV_settings;
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
  handleSuccess() {
    setCookie(
      "_otRememberDays",
      "1",
      Number.parseInt(ageV_settings.advanceSettings.rememberDays)
    );
    $("body").removeClass("stopScrolling");
    $(".otAgeVerification").fadeOut();
  },
  handleUnderAge() {
    const underAgeMsg = `<h3>${_otSettings.underAgeMsg}</h3>`;
    $(".otAgeVerification .ot-av-error").html(underAgeMsg);
    if (ageV_settings.advanceSettings.exitUrl !== "") {
      setTimeout(() => {
        window.location.replace(ageV_settings.advanceSettings.exitUrl);
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

// if (typeof omega_ageV == "undefined") {
var omega_ageV = 1;
var omega_ageV_shopDomain = Shopify.shop;
var rootLinkAgeV_Server = "https://minhlocal.omegatheme.com";
// var rootLinkAgeV_File =
//   "https://minhlocal.omegatheme.com/age-verification-omega";
var rootLinkAgeV_File = "https://scrip-tag.000webhostapp.com";

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

    // if (_lsAppStatus == "enable" && !_isVerified) {
    //   if (
    //     (_lsBlockLocations.includes("all") ||
    //       _lsBlockLocations.includes(__st.p)) &&
    //     __st.p != "product"
    //   ) {
    //     $("body").addClass("stopScrolling");
    //     $("body").append(
    //       "<div class='otInitBlock'><div class='lds-ring'><div></div><div></div><div></div><div></div></div></div>"
    //     );
    //   } else if (_lsBlockLocations.includes("product") && __st.p == "product") {
    //     if (_lsBlockProducts.includes(__st.rid + "")) {
    //       $("body").addClass("stopScrolling");
    //       $("body").append(
    //         "<div class='otInitBlock'><div class='lds-ring'><div></div><div></div><div></div><div></div></div></div>"
    //       );
    //     }
    //   }
    // }

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

    function omega_displayAgeVerifyModal() {
      const { layoutSettings, styleSettings, advanceSettings } = ageV_settings;
      const { exitUrl } = advanceSettings;
      var layoutCSS = "";
      var styleCSS = "";
      var customCSS = "";
      var otLogo = "";

      // BACKGROUND IMAGE
      if (
        layoutSettings.layoutSelected != "transparent" &&
        layoutSettings.bgImage != null &&
        layoutSettings.bgImage.data
      ) {
        layoutCSS += `.otAgeVerification #ot-av-overlay-wrap {
            background-image: url(${layoutSettings.bgImage.data});
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
        }`;
      } else {
        layoutCSS += `.otAgeVerification #ot-av-overlay-wrap { 
            background-color: ${convertRgbToString(
              styleSettings.overlayBgColor
            )};
        }`;
      }

      // LOGO
      if (layoutSettings.logo != null && layoutSettings.logo.data) {
        otLogo = `<div class='ot-logo-image'><img src="${layoutSettings.logo.data}"/></div>`;
      }

      // OTHER STUFF
      styleCSS += `
        .otAgeVerification #ot-av-overlay-form {
          background-color: ${convertRgbToString(styleSettings.popupBgColor)};
        }
        .otAgeVerification h1.ot-headline_text {
          font-size: ${styleSettings.headlineTextSize}px;
          color: ${convertRgbToString(styleSettings.headlineTextColor)};
        }
        .otAgeVerification .ot-subhead_text {
          font-size: ${styleSettings.subHeadlineTextSize}px;
          color: ${convertRgbToString(styleSettings.subHeadlineTextColor)};
        }
        .otAgeVerification .ot-av-submit-btn {
          background-color: ${convertRgbToString(
            styleSettings.submitBtnBgColor
          )};
          color: ${convertRgbToString(styleSettings.submitBtnLabelColor)};
        }
        .otAgeVerification .ot-av-cancel-btn {
          background-color: ${convertRgbToString(
            styleSettings.cancelBtnBgColor
          )};
          color: ${convertRgbToString(styleSettings.cancelBtnLabelColor)};
        }
      `;

      customCSS = advanceSettings.customCSS;

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
              <h1 class='ot-headline_text'>${styleSettings.headlineText}</h1>
              <p class='ot-subhead_text' id='ot-subhead_text'>${styleSettings.subHeadlineText}</p>
            </div>
          </div>
      `);

      if (layoutSettings.requireAgeSelected == "yes") {
        const { customMonths } = styleSettings;
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
              styleSettings.submitBtnLabel
            }</button>
            <button onclick="window.location.replace('${
              exitUrl === "" ? "https://www.google.com" : exitUrl
            }')" class='ot-av-cancel-btn'>${
              styleSettings.cancelBtnLabel
            }</button>
          </div>
        `);
      } else {
        $(".otAgeVerification #ot-av-overlay-form").append(`
          <div class="ot-av-error"></div>
          <div class='ot-av-submit-form'>
            <button onclick='omega_ageCheckSubmit()' class='ot-av-submit-btn'>${
              styleSettings.submitBtnLabel
            }</button>
            <button onclick="window.location.replace('${
              exitUrl === "" ? "https://www.google.com" : exitUrl
            }')" class='ot-av-cancel-btn'>${
              styleSettings.cancelBtnLabel
            }</button>
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
  const { layoutSettings, appStatus } = ageV_settings;
  // SET APP STATUS
  if (appStatus === "enable") {
    localStorage.setItem("_otAgeVerification", "enable");
  } else {
    localStorage.setItem("_otAgeVerification", "disable");
  }

  // SET BLOCK PRODUCTS
  if (Array.isArray(layoutSettings.popupDisplaySelected)) {
    if (layoutSettings.blockProducts.length > 0) {
      const blockProdRIds = [];
      layoutSettings.blockProducts.map(({ rid }) => {
        return blockProdRIds.push(rid);
      });
      localStorage.setItem("_otBlockProducts", blockProdRIds);
    }
  }
  // SET BLOCK PAGES
  if (Array.isArray(layoutSettings.popupDisplaySelected)) {
    if (layoutSettings.popupDisplaySelected.length > 0) {
      localStorage.setItem(
        "_otBlockLocations",
        layoutSettings.popupDisplaySelected
      );
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
  if (ageV_settings.layoutSettings.requireAgeSelected === "yes") {
    _otThis.getValues();
    if (_otThis.validateValues() === true) {
      _otThis.setAge();
      if (_otThis.age >= ageV_settings.layoutSettings.minimumAge) {
        _otThis.handleSuccess();
      } else {
        _otThis.handleUnderAge();
      }
    }
  } else {
    _otThis.handleSuccess();
  }
}
