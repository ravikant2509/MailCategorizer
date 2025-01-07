// Predefined Labels
const labels = [
  "Internal Communication",
  "External Communication",
  "Contains Sensitive Data",
  "Only for Authorized Recipients"
];

// Track already labeled emails
const labeledEmails = new WeakSet();

// Check if Email is External
function checkIfExternalEmail(composeArea) {
  // Get the sender's email dynamically
  const senderElement = document.querySelector('span[email]');
  const senderEmail = senderElement ? senderElement.getAttribute("email").toLowerCase() : "";
  const senderDomain = senderEmail.split("@")[1]; // Extract sender's domain

  if (!senderDomain) {
    console.log("Sender's email or domain could not be determined.");
    return false; // Fallback
  }

  console.log("Sender Email:", senderEmail);
  console.log("Sender Domain:", senderDomain);

  // Get recipients from To, CC, and BCC fields
  const recipientSelectors = [
    'textarea[aria-label="To"]',
    'textarea[aria-label="Cc"]',
    'textarea[aria-label="Bcc"]'
  ];

  const recipients = recipientSelectors
    .map((selector) => {
      const field = document.querySelector(selector);
      return field ? field.value.toLowerCase() : "";
    })
    .filter((value) => value !== "") // Remove empty fields
    .join(","); // Combine all recipients into a single string

  if (!recipients) {
    console.log("No recipients found. Skipping external check.");
    return false; // No recipients
  }

  console.log("All Recipients:", recipients);

  // Split recipients by comma and extract domains
  const recipientDomains = recipients.split(",").map((email) => {
    const parts = email.trim().split("@");
    return parts.length > 1 ? parts[1] : null; // Extract domain part
  });

  console.log("Recipient Domains:", recipientDomains);

  // Check if any recipient domain is different from the sender's domain
  const isExternal = recipientDomains.some((domain) => domain && domain !== senderDomain);

  console.log("Is External:", isExternal);
  return isExternal;
}

// Suggest Label Based on GDPR Rules
function suggestLabel(composeArea) {
  try {
    const emailBody = composeArea.innerText.toLowerCase();

    console.log("Email Body:", emailBody);

    const sensitivePatterns = [
      /\bconfidential\b/i,
      /\bpassword\b/i,
      /\b\d{10}\b/, // Phone Number
      /\b\d{8}\b/, // UK Bank Account
      /[A-Z]{2}\d{6}[A-D]{1}/, // National Insurance
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email Address
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/ // Date of Birth
    ];

    const containsSensitiveData = sensitivePatterns.some((pattern) =>
      pattern.test(emailBody)
    );

    if (containsSensitiveData) {
      console.log("Suggestion: Contains Sensitive Data");
      return "Contains Sensitive Data";
    }

    const isExternal = checkIfExternalEmail(composeArea);

    if (isExternal) {
      console.log("Suggestion: External Communication");
      return "External Communication";
    }

    console.log("Suggestion: Internal Communication");
    return "Internal Communication";
  } catch (error) {
    console.error("Error in suggestLabel:", error);
    return null; // Handle any unexpected errors gracefully
  }
}

// Add Label to Email Body
function addLabelToEmail(composeArea, selectedLabel) {
  const labelHTML = `<div style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 10px;">
                        Sender of this Email has categorized this email as <span style="color: blue;">${selectedLabel}</span>
                     </div>`;

  if (labeledEmails.has(composeArea)) {
    console.log("Label already added to this email. Skipping...");
    return;
  }

  composeArea.innerHTML = labelHTML + composeArea.innerHTML;

  const inputEvent = new Event("input", { bubbles: true });
  composeArea.dispatchEvent(inputEvent);

  labeledEmails.add(composeArea);
  console.log(`Label added: ${selectedLabel}`);
}

// Display Label Selection Popup
function displayLabelSelectionPopup(composeArea) {
  return new Promise((resolve) => {
    let existingPopup = document.querySelector("#labelSelectionPopup");
    if (existingPopup) {
      console.log("Popup already open.");
      return;
    }

    const suggestedLabel = suggestLabel(composeArea);

    const popup = document.createElement("div");
    popup.id = "labelSelectionPopup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.zIndex = "9999";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.border = "1px solid black";
    popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    popup.style.borderRadius = "10px";

    const title = document.createElement("h3");
    title.textContent = "Select a Label for this Email";
    popup.appendChild(title);

    if (suggestedLabel) {
      const suggestion = document.createElement("p");
      suggestion.textContent = `Suggested Label: ${suggestedLabel}`;
      suggestion.style.fontWeight = "bold";
      suggestion.style.color = "blue";
      popup.appendChild(suggestion);
    }

    labels.forEach((label) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.margin = "5px";
      button.style.padding = "10px";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      button.style.background = "lightblue";
      button.onclick = () => {
        addLabelToEmail(composeArea, label);
        document.body.removeChild(popup);
        resolve();
      };
      popup.appendChild(button);
    });

    document.body.appendChild(popup);
  });
}

// Intercept Gmail's Send Button
function interceptSendButton(sendButton, composeArea) {
  sendButton.addEventListener(
    "click",
    async (event) => {
      if (labeledEmails.has(composeArea)) {
        console.log("Email already labeled. Proceeding with sending...");
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      console.log("Send button clicked. Displaying label selection popup...");
      await displayLabelSelectionPopup(composeArea);

      console.log("Label selected. Sending email...");
      sendButton.click();
    },
    true
  );
}

// Monitor Gmail UI for Compose and Send Buttons
function monitorSendButton() {
  const observer = new MutationObserver(() => {
    const composeArea = document.querySelector('div[aria-label="Message Body"]');
    const sendButton = document.querySelector('div[role="button"][data-tooltip*="Send"]');

    if (composeArea && sendButton) {
      console.log("Compose area and Send button found. Attaching listener...");
      interceptSendButton(sendButton, composeArea);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("Monitoring for Gmail UI changes...");
}

// Initialize the Script
function init() {
  console.log("Initializing MailCategorizer with GDPR Suggestions...");
  monitorSendButton();
}

init();
