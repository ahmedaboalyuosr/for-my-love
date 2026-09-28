const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.querySelector(".card");
const success = document.getElementById("success");

let escapeCount = 0;
let yesScale = 1;
let isFloating = false;


/* =========================
   GROW YES
========================= */

function growYesButton() {

  yesScale += 0.12;

  if (yesScale > 2.3) {
    yesScale = 2.3;
  }

  yesBtn.style.setProperty(
    "--yes-scale",
    yesScale
  );
}


/* =========================
   MOVE NO
========================= */

function moveNoButton() {

  escapeCount++;

  growYesButton();


  /*
    أول مرة يهرب:
    نحفظ مكانه الحالي وبعدها
    نخليه Fixed في الشاشة كلها
  */

  if (!isFloating) {

    const currentRect =
      noBtn.getBoundingClientRect();

    noBtn.style.position = "fixed";

    noBtn.style.left =
      currentRect.left + "px";

    noBtn.style.top =
      currentRect.top + "px";

    isFloating = true;
  }


  const rect =
    noBtn.getBoundingClientRect();

  const buttonWidth =
    noBtn.offsetWidth;

  const buttonHeight =
    noBtn.offsetHeight;


  /*
    مساحة أمان من حواف الشاشة
  */

  const padding = 15;


  const minX = padding;

  const maxX =
    window.innerWidth -
    buttonWidth -
    padding;


  const minY = padding;

  const maxY =
    window.innerHeight -
    buttonHeight -
    padding;


  let newX;
  let newY;

  let attempts = 0;


  /*
    نختار مكان عشوائي بعيد
    عن مكانه الحالي
  */

  do {

    newX =
      minX +
      Math.random() *
      (maxX - minX);

    newY =
      minY +
      Math.random() *
      (maxY - minY);

    attempts++;

  } while (

    Math.abs(newX - rect.left) < 100 &&

    Math.abs(newY - rect.top) < 100 &&

    attempts < 100

  );


  noBtn.style.left =
    `${newX}px`;

  noBtn.style.top =
    `${newY}px`;


  /*
    كل مرة يهرب أسرع
  */

  let speed =
    0.18 -
    escapeCount * 0.012;

  if (speed < 0.045) {
    speed = 0.045;
  }

  noBtn.style.transition =
    `left ${speed}s ease, top ${speed}s ease`;
}


/* =========================
   PC
========================= */

noBtn.addEventListener(
  "mouseenter",
  moveNoButton
);


/* =========================
   MOBILE
========================= */

noBtn.addEventListener(
  "pointerdown",
  function (e) {

    e.preventDefault();

    moveNoButton();

  }
);


/* =========================
   EXTRA PROTECTION 😂
========================= */

noBtn.addEventListener(
  "click",
  function (e) {

    e.preventDefault();

    moveNoButton();

  }
);


/* =========================
   YES ❤️
========================= */

yesBtn.addEventListener(
  "click",
  function () {

    noBtn.style.display = "none";

    card.style.display = "none";

    success.style.display = "flex";

  }
);