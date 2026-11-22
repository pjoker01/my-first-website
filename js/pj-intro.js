(() => {
  const intro = document.getElementById("pjIntro");
  if (!intro) return;

  const root = document.documentElement;
  const skip = document.getElementById("pjIntroSkip");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    intro.classList.add("is-opening");
    window.setTimeout(() => {
      intro.classList.add("is-done");
      intro.setAttribute("aria-hidden", "true");
      intro.hidden = true;
      root.classList.remove("pj-intro-active");
    }, 660);
  };

  if (reduced) {
    intro.hidden = true;
    root.classList.remove("pj-intro-active");
    return;
  }

  let alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem("pjIntroSeen") === "1";
    if (!alreadySeen) sessionStorage.setItem("pjIntroSeen", "1");
  } catch (_) {}

  if (alreadySeen || !root.classList.contains("pj-intro-active")) {
    intro.hidden = true;
    root.classList.remove("pj-intro-active");
    return;
  }

  if (skip) skip.addEventListener("click", finish);
  window.setTimeout(finish, 520);
  window.setTimeout(() => {
    if (!finished) finish();
  }, 1750);
})();
