import { useState } from "react";
import { setApiKey } from "../utils/apiKey";
import ConfirmationModal from "../components/confirmationModal";

const Settings = () => {
  const [apiKey, setApiKeyState] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleSave = () => {
    setError("");
    setSuccess("");
    if (apiKey) {
      setApiKey(apiKey)
        .then(() => {
          setSuccess("API key stored securely.");
          setApiKeyState("");
        })
        .catch((error) => {
          setError(`Error saving API key: ${error.message}`);
        });
    } else {
      setError("Please enter an API key");
    }
  };

  const handleReset = () => {
    setShowConfirmationModal(true);
  };

  const confirmReset = () => {
    chrome.storage.local.clear(() => {
      setSuccess("Local storage cleared.");
    });
    setSuccess("Application data cleared.");
    setShowConfirmationModal(false);
  };

  const cancelReset = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to reset the application data? This action cannot be undone."
          onCancel={cancelReset}
          onConfirm={confirmReset}
        />
      )}
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold mb-6">Settings</h2>
        <div className="bg-blue-950 shadow-md rounded-lg p-6 w-full">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
              {success}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder="Enter YouTube API Key"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950 text-white"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
          <div className="w-full mt-4">
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Application Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
