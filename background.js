chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "logData") {
    chrome.storage.local.get("detectedData", (result) => {
      const detectedData = result.detectedData || [];
      detectedData.push(message.data);
      chrome.storage.local.set({ detectedData });
      console.log("MailCategorizer: Data logged successfully.");
    });
  } else if (message.action === "exportLogs") {
    chrome.storage.local.get("detectedData", (result) => {
      const data = result.detectedData || [];
      const csvContent =
        "data:text/csv;charset=utf-8," +
        data.map((e) => `${e.type},${e.value}`).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "MailCategorizer_sensitive_data_log.csv");
      link.click();
      console.log("MailCategorizer: Logs exported successfully.");
    });
  }
});
