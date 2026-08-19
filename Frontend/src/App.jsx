import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setMessage("Uploading...");

      console.log("Connecting to backend...");

      const response = await fetch(
    "https://cloud-file-storage-system-1-pe4h.onrender.com/upload",
  {
    method: "POST",
    body: formData,
  }
);

      console.log("Backend response:", response.status);

      const data = await response.json();

      console.log("Backend data:", data);

      if (response.ok) {
        setMessage("✅ File uploaded successfully!");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("BACKEND CONNECTION ERROR:", error);
      setMessage("❌ Could not connect to backend.");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>☁️ Cloud File Storage</h1>
        <p>Store and manage your files securely</p>
      </header>

      <main>
        <section className="upload-box">
          <h2>Upload File</h2>

          <input
            type="file"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <p>
              Selected file: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <button onClick={handleUpload}>
            Upload File
          </button>

          {message && <p>{message}</p>}
        </section>

        <section className="files-box">
          <h2>My Files</h2>

          <div className="file-item">
            <span>📄 resume.pdf</span>

            <div>
              <button>Download</button>
              <button>Delete</button>
            </div>
          </div>

          <div className="file-item">
            <span>🖼️ photo.jpg</span>

            <div>
              <button>Download</button>
              <button>Delete</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;