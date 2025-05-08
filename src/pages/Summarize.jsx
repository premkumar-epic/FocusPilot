import { useState } from "react";
import { motion } from "framer-motion";

const Summarize = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "text/plain" || selectedFile.type === "application/pdf")) {
      setFile(selectedFile);
      setText("");
    } else {
      alert("Please upload a valid TXT or PDF file.");
    }
  };

  const handleSummarize = () => {
    setLoading(true);
    setSummary("");
    // Simulate summarization (replace with actual API call in production)
    setTimeout(() => {
      if (file) {
        setSummary(`Summary of ${file.name}: This is a placeholder summary of the uploaded file. In a real app, an NLP service would process the file content.`);
      } else if (text) {
        setSummary(`Summary of text: This is a placeholder summary of your input text: "${text.substring(0, 50)}...". In a real app, an NLP service would summarize this.`);
      } else {
        setSummary("Please provide text or upload a file to summarize.");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#F8F8E1] rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-[#FF90BB] mb-4">Summarize Text or PDF</h2>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#8ACCD5] mb-2">Paste Text</h3>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setFile(null); }}
          placeholder="Paste your text here..."
          className="w-full p-3 border border-[#8ACCD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF90BB] transition bg-[#FFC1DA] h-32"
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#8ACCD5] mb-2">Or Upload File (TXT/PDF)</h3>
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="w-full p-3 border border-[#8ACCD5] rounded-lg bg-[#FFC1DA]"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSummarize}
        disabled={loading}
        className={`w-full p-3 rounded-lg text-white transition ${
          loading ? "bg-gray-400" : "bg-[#FF90BB] hover:bg-[#8ACCD5]"
        }`}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </motion.button>
      {summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-4 bg-[#FFC1DA] rounded-lg"
        >
          <h3 className="text-lg font-medium text-[#FF90BB] mb-2">Summary</h3>
          <p className="text-gray-600">{summary}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Summarize;