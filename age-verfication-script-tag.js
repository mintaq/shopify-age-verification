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

// if (typeof omega_ageV == "undefined") {
var omega_ageV = 1;
var omega_ageV_shopDomain = Shopify.shop;
var rootLinkAgeV = " https://985d777ec478.ngrok.io";
var rootHrefLink = "https://scrip-tag.000webhostapp.com";
// var rootLinkAgeV = 'https://minhlocal.omegatheme.com/age-verification-omega'

if (typeof $ == "undefined") {
  javascript: (function (e, s) {
    e.src = s;
    e.onload = function () {
      $ = jQuery.noConflict();
      ageV_init();
    };
    document.head.appendChild(e);
  })(
    document.createElement("script"),
    "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
  );
  ageV_init();
} else {
  ageV_init();
}

async function ageV_init() {
  $ = jQuery.noConflict();
  $.ajax({
    url: `${rootLinkAgeV}/api/shops/${omega_ageV_shopDomain}`,
    type: "GET",
    dataType: "json",
  }).done((result) => {
    // window.ageV_res = result;
    ageV_settings = result;
    if (ageV_settings.appStatus === "enable") {
      $("head").append(`
      <link href='${rootHrefLink}/age-verification.css?v=${Math.floor(
        Math.random() * 100000
      )}' rel='stylesheet' type='text/css'>
      <link href="https://fonts.googleapis.com/css?family=Oswald:400,700"  rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js" ></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" ></script>
      <script defer src="https://use.fontawesome.com/releases/v5.12.0/js/all.js" ></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
      `);
      $("body").addClass("stopScrolling");
      $("body").append("<div class='otAgeVerification'></div>");
      omega_displayAgeVerifyModal();
    }
  });
}
// }

function convertRgbToString(value) {
  let color = `rgba(${value.r},${value.g},${value.b},${value.a})`;
  return color;
}

function omega_displayAgeVerifyModal() {
  // $("body").addClass("bootstrapiso");
  const { layoutSettings, styleSettings, advanceSettings } = ageV_settings;
  var layoutCSS = "";
  var styleCSS = "";
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
        background-color: ${convertRgbToString(styleSettings.overlayBgColor)};
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
      background-color: ${convertRgbToString(styleSettings.submitBtnBgColor)};
      color: ${convertRgbToString(styleSettings.submitBtnLabelColor)};
    }
    .otAgeVerification .ot-av-cancel-btn {
      background-color: ${convertRgbToString(styleSettings.cancelBtnBgColor)};
      color: ${convertRgbToString(styleSettings.cancelBtnLabelColor)};
    }
  `;

  // MAIN DIV
  $(".otAgeVerification").append(`
      <style>
        ${layoutCSS}
        ${styleCSS}
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
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var months = "";

    for (let i = 0; i < MONTHS.length; i++) {
      months += `<option value="${i + 1}">${MONTHS[i]}</option>`;
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
        <button onclick='omega_ageCheckSubmit()' class='ot-av-submit-btn'>${styleSettings.submitBtnLabel}</button>
        <button onclick="location.href = '${advanceSettings.exitUrl}'" class='ot-av-cancel-btn'>${styleSettings.cancelBtnLabel}</button>
      </div>
    `);
  } else {
    $(".otAgeVerification #ot-av-overlay-form").append(`
      <div class="ot-av-error"></div>
      <div class='ot-av-submit-form'>
        <button onclick='omega_ageCheckSubmit()' class='ot-av-submit-btn'>${styleSettings.submitBtnLabel}</button>
        <button onclick="location.href = '${advanceSettings.exitUrl}'" class='ot-av-cancel-btn'>${styleSettings.cancelBtnLabel}</button>
      </div>
    `);
  }
  $(".otAgeVerification").fadeIn();
}

function omega_ageCheckSubmit() {
  _otThis.getValues();
  if (_otThis.validateValues() === true) {
    _otThis.setAge();
    if (_otThis.age >= ageV_settings.layoutSettings.minimumAge) {
      _otThis.handleSuccess();
    } else {
      _otThis.handleUnderAge();
    }
  }
}
