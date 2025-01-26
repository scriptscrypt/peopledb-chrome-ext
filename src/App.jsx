// src/App.jsx

import ContactsManager from "./components/contactsManager";

function App() {
  // Check if we're running as an extension popup
  const isExtension = chrome?.extension != null;

  return (
    <div className={`${isExtension ? 'extension' : 'development'}`}>
      <ContactsManager />
    </div>
  );
}

export default App;
