async function refreshApp() {
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.update(); // перевіряє нову версію SW
    }
  }
  window.location.reload();
}

export default function RefreshButton() {
  return <button onClick={refreshApp}>🔄 Оновити</button>;
}
