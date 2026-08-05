const LOGO_PATHS = `
  <path d="M 596 452 L 588 462 L 513 598 L 446 717 L 446 727 L 448 731 L 456 737 L 470 738 L 471 739 L 666 739 L 675 736 L 679 732 L 682 723 L 681 718 L 679 714 L 674 709 L 669 707 L 489 707 L 488 706 L 494 697 L 604 498 L 606 497 L 838 856 L 837 857 L 512 857 L 507 859 L 502 864 L 500 868 L 499 873 L 502 882 L 508 887 L 515 889 L 863 889 L 870 887 L 878 880 L 881 875 L 882 868 L 879 860 L 616 454 L 609 450 L 602 450 Z"/>
  <path d="M 226 869 L 227 876 L 229 880 L 233 884 L 242 887 L 245 886 L 250 887 L 385 887 L 393 885 L 399 879 L 401 874 L 400 864 L 395 858 L 389 855 L 271 855 L 270 854 L 591 312 L 967 874 L 976 884 L 979 885 L 987 885 L 992 883 L 997 878 L 999 874 L 999 865 L 996 859 L 793 556 L 790 553 L 732 465 L 729 462 L 671 374 L 668 371 L 605 276 L 600 271 L 596 269 L 583 270 L 575 276 L 512 384 L 485 428 L 483 433 L 472 450 L 470 455 L 459 472 L 457 477 L 446 494 L 444 499 L 433 516 L 431 521 L 391 587 L 389 592 L 378 609 L 376 614 L 365 631 L 363 636 L 352 653 L 350 658 L 339 675 L 337 680 L 284 768 L 282 773 L 271 790 L 269 795 L 258 812 L 256 817 L 245 834 L 243 839 L 229 861 Z"/>
`;

function placeholderMarkSvg(className) {
  return `<svg class="${className}" viewBox="206 249 813 660" xmlns="http://www.w3.org/2000/svg">${LOGO_PATHS}</svg>`;
}

function screenshotBlock(filename, className) {
  const div = document.createElement("div");
  div.className = className;
  const img = document.createElement("img");
  img.src = `assets/screenshots/${filename}`;
  img.alt = "";
  img.loading = "lazy";
  img.onerror = () => {
    div.innerHTML = placeholderMarkSvg("placeholder-mark");
  };
  div.appendChild(img);
  return div;
}

async function loadProject(slug) {
  const res = await fetch(`data/projects/${slug}.json`);
  if (!res.ok) return null;
  return res.json();
}

async function renderProjectGrid() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  const slugsRes = await fetch("data/projects/index.json");
  const slugs = slugsRes.ok ? await slugsRes.json() : [];

  const projects = (await Promise.all(slugs.map(loadProject))).filter(Boolean);

  if (projects.length === 0) {
    grid.innerHTML = `<p>More projects coming soon.</p>`;
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = `project.html?slug=${encodeURIComponent(project.slug)}`;

    const shot = screenshotBlock(project.screenshots?.[0], "card-screenshot");
    card.appendChild(shot);

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `<h3>${project.title}</h3>${
      project.tagline ? `<p class="card-tagline">${project.tagline}</p>` : ""
    }<p class="card-teaser">${project.teaser}</p>`;
    card.appendChild(body);

    grid.appendChild(card);
  });
}

async function renderProjectDetail() {
  const root = document.getElementById("project-detail-root");
  if (!root) return;

  const slug = new URLSearchParams(window.location.search).get("slug");
  const project = slug ? await loadProject(slug) : null;

  if (!project) {
    root.innerHTML = `<div class="detail-empty"><h1>Project not found</h1><p><a href="index.html">Back to home</a></p></div>`;
    return;
  }

  document.title = `${project.title} — Jay Egan`;

  const sectionLabels = {
    problem: "The Problem",
    build: "What I Built",
    technical: "Technical Details",
    learning: "What I Learned",
    next: "What's Next",
  };

  const screenshotsHtml = (project.screenshots || [])
    .map(() => `<div class="shot-slot"></div>`)
    .join("");

  root.innerHTML = `
    <div class="project-detail-header">
      <h1>${project.title}</h1>
      ${project.tagline ? `<p class="detail-tagline">${project.tagline}</p>` : ""}
      <p class="teaser">${project.teaser}</p>
    </div>
    <div class="detail-screenshots" id="detail-screenshots"></div>
    <div class="detail-sections">
      ${Object.entries(sectionLabels)
        .map(([key, label]) => {
          const text = project.sections?.[key];
          if (!text) return "";
          return `<div class="detail-section"><h2>${label}</h2><p>${text}</p></div>`;
        })
        .join("")}
    </div>
    <div class="detail-links">
      ${project.demoUrl ? `<a class="btn-demo" href="${project.demoUrl}" target="_blank" rel="noopener">Live Demo</a>` : ""}
      ${project.repoUrl ? `<a class="btn-repo" href="${project.repoUrl}" target="_blank" rel="noopener">Source Code</a>` : ""}
    </div>
  `;

  const screenshotsRoot = document.getElementById("detail-screenshots");
  (project.screenshots || []).forEach((filename) => {
    screenshotsRoot.appendChild(screenshotBlock(filename, "card-screenshot"));
  });
}

function setFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

async function renderTestimonials() {
  const rotator = document.getElementById("quote-rotator");
  if (!rotator) return;

  const res = await fetch("data/testimonials.json");
  const quotes = res.ok ? await res.json() : [];
  if (quotes.length === 0) return;

  const textEl = document.getElementById("quote-text");
  const attributionEl = document.getElementById("quote-attribution");
  const dotsEl = document.getElementById("quote-dots");
  const fadeMs = 300;

  let index = 0;

  function show(i) {
    index = i;
    textEl.classList.add("fading");
    attributionEl.classList.add("fading");
    setTimeout(() => {
      textEl.textContent = quotes[index].quote;
      attributionEl.textContent = quotes[index].attribution;
      textEl.classList.remove("fading");
      attributionEl.classList.remove("fading");
      [...dotsEl.children].forEach((dot, i) => dot.classList.toggle("active", i === index));
    }, fadeMs);
  }

  quotes.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "quote-dot";
    dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
    dot.addEventListener("click", () => show(i));
    dotsEl.appendChild(dot);
  });

  textEl.textContent = quotes[0].quote;
  attributionEl.textContent = quotes[0].attribution;
  dotsEl.children[0].classList.add("active");
}

setFooterYear();
renderProjectGrid();
renderProjectDetail();
renderTestimonials();
