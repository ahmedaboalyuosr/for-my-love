const introScreen = document.getElementById("introScreen");
const storyScreen = document.getElementById("storyScreen");
const proposalScreen = document.getElementById("proposalScreen");
const successScreen = document.getElementById("successScreen");

const openBtn = document.getElementById("openBtn");
const nextStoryBtn = document.getElementById("nextStoryBtn");

const storyContent = document.getElementById("storyContent");
const storyIcon = document.getElementById("storyIcon");
const storyKicker = document.getElementById("storyKicker");
const storyText = document.getElementById("storyText");
const dots = [...document.querySelectorAll(".dot")];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const teaseText = document.getElementById("teaseText");

const confettiLayer = document.getElementById("confettiLayer");
const yesDate = document.getElementById("yesDate");


const storySteps = [
  {
    icon: "✨",
    kicker: "FIRST THING",
    text: "Out of everyone I could have met..."
  },
  {
    icon: "🤍",
    kicker: "SOMEHOW",
    text: "I found the person who makes ordinary days feel special."
  },
  {
    icon: "∞",
    kicker: "THE BEST PART",
    text: "Every version of my future looks better with you in it."
  },
  {
    icon: "💌",
    kicker: "SO...",
    text: "I have one tiny question left to ask you."
  }
];


const noMessages = [
  "No 😏",
  "Are you sure?",
  "Think again 😌",
  "Nice try 😂",
  "Still no?",
  "Be serious 😭",
  "Wrong button 👀",
  "Just press Yes ❤️"
];


const teaseMessages = [
  "",
  "That button seems a little shy.",
  "You’re making the Yes button confident 😂",
  "There is only one correct answer here.",
  "Nice try. Really nice try.",
  "At this point, we both know how this ends ❤️"
];


let storyIndex = 0;

let escapeCount = 0;
let yesScale = 1;
let isFloating = false;

let moveLocked = false;


/* =========================
   SCREEN TRANSITIONS
========================= */

function showScreen(currentScreen, nextScreen) {

  currentScreen.classList.remove("active");

  window.setTimeout(() => {

    nextScreen.classList.add("active");

  }, 170);
}


openBtn.addEventListener("click", () => {

  showScreen(
    introScreen,
    storyScreen
  );
});


/* =========================
   STORY
========================= */

function updateStory() {

  storyContent.classList.add("changing");

  window.setTimeout(() => {

    const step =
      storySteps[storyIndex];

    storyIcon.textContent =
      step.icon;

    storyKicker.textContent =
      step.kicker;

    storyText.textContent =
      step.text;


    dots.forEach(
      (dot, index) => {

        dot.classList.toggle(
          "active",
          index === storyIndex
        );

      }
    );


    nextStoryBtn.innerHTML =
      storyIndex ===
      storySteps.length - 1

        ? 'Ask me <span aria-hidden="true">→</span>'

        : 'Next <span aria-hidden="true">→</span>';


    storyContent.classList.remove(
      "changing"
    );

  }, 180);
}


nextStoryBtn.addEventListener(
  "click",
  () => {

    if (
      storyIndex <
      storySteps.length - 1
    ) {

      storyIndex++;

      updateStory();

      return;
    }


    showScreen(
      storyScreen,
      proposalScreen
    );

  }
);


/* =========================
   YES GROWTH
========================= */

function growYesButton() {

  yesScale += 0.13;

  const maxScale =
    window.innerWidth < 520
      ? 1.95
      : 2.15;

  yesScale =
    Math.min(
      yesScale,
      maxScale
    );


  yesBtn.style.setProperty(
    "--yes-scale",
    yesScale
  );
}


/* =========================
   SMALL HEART AT OLD
   NO POSITION
========================= */

function createEscapeHeart(rect) {

  const heart =
    document.createElement("span");

  heart.className =
    "escape-heart";

  heart.textContent =
    ["♡", "♥", "💗"][
      Math.floor(
        Math.random() * 3
      )
    ];


  heart.style.left =
    rect.left +
    rect.width / 2 +
    "px";

  heart.style.top =
    rect.top +
    rect.height / 2 +
    "px";


  document.body.appendChild(
    heart
  );


  window.setTimeout(
    () => heart.remove(),
    850
  );
}


/* =========================
   COLLISION CHECK
========================= */

function overlapsRect(
  x,
  y,
  width,
  height,
  rect,
  gap = 20
) {

  return !(
    x + width <
      rect.left - gap ||

    x >
      rect.right + gap ||

    y + height <
      rect.top - gap ||

    y >
      rect.bottom + gap
  );
}


/* =========================
   MOVE NO
========================= */

function moveNoButton(event) {

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (moveLocked) {
    return;
  }


  moveLocked = true;

  window.setTimeout(
    () => {
      moveLocked = false;
    },
    110
  );


  escapeCount++;

  growYesButton();


  const oldRect =
    noBtn.getBoundingClientRect();


  createEscapeHeart(
    oldRect
  );


  if (!isFloating) {

    noBtn.classList.add(
      "floating"
    );

    noBtn.style.left =
      oldRect.left + "px";

    noBtn.style.top =
      oldRect.top + "px";

    isFloating = true;
  }


  const width =
    noBtn.offsetWidth;

  const height =
    noBtn.offsetHeight;


  const padding =
    window.innerWidth < 520
      ? 14
      : 20;


  const maxX =
    Math.max(
      padding,
      window.innerWidth -
      width -
      padding
    );


  const maxY =
    Math.max(
      padding,
      window.innerHeight -
      height -
      padding
    );


  const yesRect =
    yesBtn.getBoundingClientRect();


  let newX = padding;
  let newY = padding;

  let attempts = 0;


  do {

    newX =
      padding +
      Math.random() *
      Math.max(
        1,
        maxX - padding
      );


    newY =
      padding +
      Math.random() *
      Math.max(
        1,
        maxY - padding
      );


    attempts++;

  } while (

    (
      Math.hypot(
        newX - oldRect.left,
        newY - oldRect.top
      ) < 130

      ||

      overlapsRect(
        newX,
        newY,
        width,
        height,
        yesRect,
        24
      )
    )

    &&

    attempts < 120
  );


  const speed =
    Math.max(
      0.055,
      0.17 -
      escapeCount * 0.012
    );


  noBtn.style.setProperty(
    "--escape-speed",
    speed + "s"
  );


  noBtn.style.left =
    newX + "px";

  noBtn.style.top =
    newY + "px";


  const messageIndex =
    Math.min(
      escapeCount,
      noMessages.length - 1
    );


  noBtn.textContent =
    noMessages[messageIndex];


  const teaseIndex =
    Math.min(
      Math.floor(
        escapeCount / 2
      ),
      teaseMessages.length - 1
    );


  teaseText.textContent =
    teaseMessages[teaseIndex];
}


/* =========================
   NO BUTTON: IMPOSSIBLE TO PRESS
========================= */

function cancelNoEvent(event) {

  event.preventDefault();
  event.stopPropagation();

}


function escapeNo(event) {

  cancelNoEvent(event);

  moveNoButton();

}


/* Desktop: run away before a click can happen */
noBtn.addEventListener(
  "mouseenter",
  moveNoButton
);


/* Mobile Safari / iPhone */
noBtn.addEventListener(
  "touchstart",
  escapeNo,
  {
    passive: false,
    capture: true
  }
);


/* Android + modern mobile browsers */
noBtn.addEventListener(
  "pointerdown",
  (event) => {

    cancelNoEvent(event);

    if (
      event.pointerType !==
      "mouse"
    ) {

      moveNoButton();

    }

  },
  true
);


/* Never allow a real mouse press */
noBtn.addEventListener(
  "mousedown",
  cancelNoEvent,
  true
);


/* Never allow a completed click */
noBtn.addEventListener(
  "click",
  cancelNoEvent,
  true
);


/* Block long press / context menu */
noBtn.addEventListener(
  "contextmenu",
  cancelNoEvent,
  true
);


/* Block double-click too */
noBtn.addEventListener(
  "dblclick",
  cancelNoEvent,
  true
);


/* Keyboard fallback */
noBtn.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      escapeNo(event);

    }

  },
  true
);


/* Don't let the button keep keyboard focus */
noBtn.setAttribute(
  "tabindex",
  "-1"
);


/* =========================
   CONFETTI
========================= */

function launchConfetti() {

  confettiLayer.innerHTML =
    "";


  const colors = [
    "#b7375a",
    "#e9a8ba",
    "#f3c8d4",
    "#8f2744",
    "#ffffff",
    "#d8b36b"
  ];


  for (
    let i = 0;
    i < 78;
    i++
  ) {

    const piece =
      document.createElement(
        "span"
      );


    piece.className =
      "confetti";


    piece.style.left =
      Math.random() *
      100 +
      "vw";


    piece.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    piece.style.width =
      6 +
      Math.random() *
      7 +
      "px";


    piece.style.height =
      9 +
      Math.random() *
      11 +
      "px";


    piece.style.setProperty(
      "--fall-time",
      2.4 +
      Math.random() *
      2.4 +
      "s"
    );


    piece.style.setProperty(
      "--drift",
      -80 +
      Math.random() *
      160 +
      "px"
    );


    piece.style.setProperty(
      "--rotation",
      -540 +
      Math.random() *
      1080 +
      "deg"
    );


    piece.style.animationDelay =
      Math.random() *
      0.55 +
      "s";


    confettiLayer.appendChild(
      piece
    );
  }


  window.setTimeout(
    () => {
      confettiLayer.innerHTML =
        "";
    },
    5600
  );
}


/* =========================
   YES ❤️
========================= */

yesBtn.addEventListener(
  "click",
  () => {

    noBtn.style.display =
      "none";


    const today =
      new Date();


    yesDate.textContent =
      today.toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );


    showScreen(
      proposalScreen,
      successScreen
    );


    window.setTimeout(
      launchConfetti,
      220
    );

  }
);


/* =========================
   KEEP FLOATING NO
   INSIDE SCREEN ON RESIZE
========================= */

window.addEventListener(
  "resize",
  () => {

    if (!isFloating) {
      return;
    }


    const rect =
      noBtn.getBoundingClientRect();


    const padding = 14;


    const safeX =
      Math.min(
        Math.max(
          padding,
          rect.left
        ),
        window.innerWidth -
        rect.width -
        padding
      );


    const safeY =
      Math.min(
        Math.max(
          padding,
          rect.top
        ),
        window.innerHeight -
        rect.height -
        padding
      );


    noBtn.style.left =
      safeX + "px";

    noBtn.style.top =
      safeY + "px";

  }
);
