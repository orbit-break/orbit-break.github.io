(() => {
  "use strict";
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const draft = document.querySelector("#email-draft");
  const copy = document.querySelector("#copy-message");

  // A mailto draft keeps support compatible with static GitHub Pages hosting.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `[OrbitBreak · ${data.get("topic")}] ${data.get("subject").trim()}`;
    const body = [
      data.get("message").trim(), "", "---",
      `Name: ${data.get("name").trim() || "Not supplied"}`,
      `Reply email: ${data.get("email").trim() || "Use sender address"}`,
      `Platform: ${data.get("platform")}`,
      `Game version: ${data.get("version").trim() || "Not supplied"}`
    ].join("\n");
    draft.value = `To: ${form.dataset.recipient}\nSubject: ${subject}\n\n${body}`;
    document.querySelector("#email-fallback").hidden = false;
    status.textContent = "Your draft is ready. Send it in your email app, or copy it below. No message has been sent yet.";
    window.location.href = `mailto:${form.dataset.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(draft.value);
      status.textContent = "Message copied. Paste it into an email and send it when ready.";
    } catch {
      draft.focus();
      draft.select();
      status.textContent = "Select and copy the prepared message below, then paste it into your email app.";
    }
  });
})();
