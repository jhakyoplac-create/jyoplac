const demoTabs = document.querySelectorAll("[data-demo-tab]");
const demoPanels = document.querySelectorAll("[data-demo-panel]");
const demoLinks = document.querySelectorAll("[data-demo-link]");
const liveDemo = document.querySelector(".live-demo");

function activateDemo(name) {
  if (!liveDemo) return;
  liveDemo.dataset.activeDemo = name;

  demoTabs.forEach((tab) => {
    const isActive = tab.dataset.demoTab === name;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  demoPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.demoPanel === name);
  });
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateDemo(tab.dataset.demoTab));
});

demoLinks.forEach((link) => {
  link.addEventListener("click", () => {
    activateDemo(link.dataset.demoLink);
  });
});
