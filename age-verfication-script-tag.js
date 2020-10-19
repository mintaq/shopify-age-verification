// jQuery(document).ready(function () {
// 	$('body').prepend('<div class="header" id="myHeader"><h2>Omega Theme!</h2></div>');
// 	$('head').prepend(
// 		'<style>.header { padding: 10px 16px; background: #555; color: #f1f1f1; } .content { padding: 16px; } .sticky { position: fixed; top: 0; width: 100%} .sticky + .content { padding-top: 102px; }</style>'
// 	);

// 	var header = document.getElementById('myHeader');
// 	var sticky = header.offsetTop;

// 	window.onscroll = function () {
// 		if (window.pageYOffset > sticky) {
// 			header.classList.add('sticky');
// 		} else {
// 			header.classList.remove('sticky');
// 		}
// 	};
// });

let ageV_settings;

// if (typeof omega_ageV == "undefined") {
var omega_ageV = 1;
var omega_ageV_shopDomain = Shopify.shop;
var rootLinkAgeV = "https://8626c450a65d.ngrok.io";
// var rootLinkAgeV = 'https://minhlocal.omegatheme.com/age-verification-omega'

if (typeof $ == "undefined") {
  // (function (e, s) {
  //   e.src = s;
  //   e.onload = function () {
  //     $ = jQuery.noConflict();
  //     ageV_init();
  //   };
  //   // document.head.appendChild(e);
  // })(
  //   document.createElement("script"),
  //   "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
  // );
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
      <link href='https://minhlocal.omegatheme.com/age-verification-omega/age-verification.css?v=${Math.floor(Math.random()*100000)}' rel='stylesheet' type='text/css'>
      <link rel="stylesheet" href="https://minhlocal.omegatheme.com/age-verification-omega/assets/css/css4.1/bootstrapcustom.min.css" type='text/css'>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js" ></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" ></script>
      <script defer src="https://use.fontawesome.com/releases/v5.12.0/js/all.js" ></script>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
      `
      );
      $("body").append("<div class='otAgeVerify'></div>");
      omega_displayAgeVerifyModal();
    }
  });
}
// }

function omega_displayAgeVerifyModal() {
  $("body").addClass("bootstrapiso");
  $(".otAgeVerify").append(`
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
      Launch demo modal
    </button>
    
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            asd
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
	`);
}
