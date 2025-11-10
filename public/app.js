const API_BASE = "http://localhost:5000/api/rules";
const TOKEN = localStorage.getItem("token") || ""; 
const resultEl = document.getElementById("result");
const apiStatusEl = document.getElementById("api-status");
const triggerTypeEl = document.getElementById("triggerType");
const actionTypeEl = document.getElementById("actionType");
const triggerValueWrapper = document.getElementById("triggerValueWrapper");

const tgBlock = document.getElementById("actionTelegram");
const httpBlock = document.getElementById("actionHttp");
const createHint = document.getElementById("createHint");

async function checkApi() {
  try {
    const res = await fetch("http://localhost:5000/api/rules", {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    if (res.ok) {
      apiStatusEl.textContent = "API: online";
      apiStatusEl.style.background = "rgba(0, 196, 140, 0.12)";
      apiStatusEl.style.borderColor = "rgba(0, 196, 140, 0.5)";
    } else {
      apiStatusEl.textContent = "API: unauthorized";
      apiStatusEl.style.background = "rgba(255, 93, 93, 0.05)";
      apiStatusEl.style.borderColor = "rgba(255, 93, 93, 0.4)";
    }
  } catch (err) {
    apiStatusEl.textContent = "API: offline";
    apiStatusEl.style.background = "rgba(255, 93, 93, 0.05)";
    apiStatusEl.style.borderColor = "rgba(255, 93, 93, 0.4)";
  }
}

checkApi();

document.getElementById("createBtn").addEventListener("click", createRule);
document.getElementById("triggerBtn").addEventListener("click", triggerRule);
document.getElementById("clearLog").addEventListener("click", () => {
  resultEl.textContent = "Waiting for actions...";
});

triggerTypeEl.addEventListener("change", () => {
  const v = triggerTypeEl.value;
  if (v === "time") {
    triggerValueWrapper.classList.remove("hidden");
  } else if (v === "event") {
    triggerValueWrapper.classList.remove("hidden");
  } else {
    triggerValueWrapper.classList.add("hidden");
  }
});

actionTypeEl.addEventListener("change", () => {
  const v = actionTypeEl.value;
  tgBlock.classList.add("hidden");
  httpBlock.classList.add("hidden");
  if (v === "telegram") {
    tgBlock.classList.remove("hidden");
  }
  if (v === "http_request") {
    httpBlock.classList.remove("hidden");
  }
});

async function createRule() {
  const name = document.getElementById("name").value.trim();
  const triggerType = triggerTypeEl.value;
  const actionType = actionTypeEl.value;

  // базовий body
  const body = {
    name: name || "Untitled rule",
    triggerType,
    actionType,
    actionConfig: {},
    isActive: true
  };

  // додатково для telegram
  if (actionType === "telegram") {
    const chatId = document.getElementById("tgChatId").value.trim();
    const message = document.getElementById("tgMessage").value.trim();
    body.actionConfig = {
      chatId,
      message: message || "🔔 Rule triggered"
    };
  }

  // додатково для http_request
  if (actionType === "http_request") {
    const url = document.getElementById("httpUrl").value.trim();
    const method = document.getElementById("httpMethod").value;
    body.actionConfig = {
      url,
      method
    };
  }

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    showResult(data);

    if (res.ok) {
      createHint.textContent = "Rule created successfully.";
      createHint.style.color = "#4ade80";
      document.getElementById("ruleId").value = data._id || "";
    } else {
      createHint.textContent = data.message || "Error creating rule.";
      createHint.style.color = "#f87171";
    }
  } catch (err) {
    showResult({ error: err.message });
    createHint.textContent = "Network error.";
    createHint.style.color = "#f87171";
  }
}

async function triggerRule() {
  const id = document.getElementById("ruleId").value.trim();
  if (!id) {
    showResult({ error: "Rule ID is required" });
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/${id}/trigger`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ source: "ui" })
    });
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult({ error: err.message });
  }
}

function showResult(data) {
  resultEl.textContent = JSON.stringify(data, null, 2);
}
