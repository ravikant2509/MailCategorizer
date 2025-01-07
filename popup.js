document.getElementById("exportLogs").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "exportLogs" });
});
