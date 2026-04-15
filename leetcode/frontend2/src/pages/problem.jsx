import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosclient";
import ChatAi from "./chatai";


const ProblemPage = () => {

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");

  const editorRef = useRef(null);
  const { problemId } = useParams();

  /* ===============================
        FETCH PROBLEM
  =============================== */

  useEffect(() => {

    const fetchProblem = async () => {

      try {
        setLoading(true);

        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );

        setProblem(response.data);

        const starterCode =
          response.data.startcode?.find(
            (sc) => sc.language === "cpp"
          )?.initialcode || "// Write your code here";

        setCode(starterCode);

      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchProblem();

  }, [problemId]);

  /* ===============================
       CHANGE CODE WHEN LANGUAGE CHANGES
  =============================== */

  useEffect(() => {

    if (problem) {

      const starterCode =
        problem.startcode?.find(
          (sc) => sc.language === selectedLanguage
        )?.initialcode || "// Write your code here";

      setCode(starterCode);
    }

  }, [selectedLanguage, problem]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  /* ===============================
           RUN CODE
  =============================== */

  const handleRun = async () => {

    try {
      setLoading(true);
      setRunResult(null);

      const response = await axiosClient.post(
        `/submission/run/${problemId}`,
        {
          code,
          language: selectedLanguage
        }
      );

      setRunResult(response.data);
      setActiveRightTab("testcase");

    } catch (error) {

      console.error("Run error:", error);

      setRunResult({
        success: false,
        error: "Internal server error"
      });

    } finally {
      setLoading(false);
    }
  };

  /* ===============================
         SUBMIT CODE
  =============================== */

  const handleSubmitCode = async () => {

    try {
      setLoading(true);
      setSubmitResult(null);

      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code,
          language: selectedLanguage
        }
      );

      setSubmitResult(response.data);
      setActiveRightTab("result");

    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-base-200">

      {/* LEFT PANEL */}
      <div className="w-1/2 flex flex-col border-r border-base-300">

        {/* TABS */}
        <div className="tabs tabs-bordered bg-base-200 px-4">

          <button
            className={`tab ${activeLeftTab === "description" ? "tab-active" : ""}`}
            onClick={() => setActiveLeftTab("description")}
          >
            Description
          </button>

          <button
            className={`tab ${activeLeftTab === "editorial" ? "tab-active" : ""}`}
            onClick={() => setActiveLeftTab("editorial")}
          >
            Editorial
          </button>

          <button
            className={`tab ${activeLeftTab === "solutions" ? "tab-active" : ""}`}
            onClick={() => setActiveLeftTab("solutions")}
          >
            Solutions
          </button>

          <button
            className={`tab ${activeLeftTab === "submissions" ? "tab-active" : ""}`}
            onClick={() => setActiveLeftTab("submissions")}
          >
            Submissions
          </button>

          <button
            className={`tab ${activeLeftTab === "chatAI" ? "tab-active" : ""}`}
            onClick={() => setActiveLeftTab("chatAI")}
          >
            Chat AI
          </button>

        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* DESCRIPTION */}
          {activeLeftTab === "description" && problem && (
            <div>
              <h1 className="text-2xl font-bold mb-3">
                {problem.title}
              </h1>

              <p className="mb-4 text-base-content/80">
                {problem.description}
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">
                Examples
              </h3>

              {problem.visibletestcases?.map((example, index) => (
                <div key={index} className="bg-base-300 p-4 rounded-lg mb-4">

                  <p className="font-mono text-sm">
                    <span className="font-semibold">
                      Example {index + 1}
                    </span>
                  </p>

                  <p className="font-mono text-sm mt-2">
                    <strong>Input:</strong> {example.input}
                  </p>

                  <p className="font-mono text-sm">
                    <strong>Output:</strong> {example.output}
                  </p>

                  <p className="text-sm mt-2 text-base-content/70">
                    <strong>Explanation:</strong> {example.explanation}
                  </p>

                </div>
              ))}
            </div>
          )}

          {/* EDITORIAL */}
          {activeLeftTab === "editorial" && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-4">Editorial</h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {'Editorial is here for the problem'}
              </div>
            </div>
          )}

          {/* SOLUTIONS */}
          {activeLeftTab === "solutions" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Solutions</h2>

              <div className="space-y-6">
                {problem?.referenceSolution?.map((solution, index) => (
                  <div key={index} className="border border-base-300 rounded-lg">
                    <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                      <h3 className="font-semibold">
                        {problem?.title} - {solution.language}
                      </h3>
                    </div>

                    <pre className="p-4 text-sm overflow-x-auto">
                      {solution.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMISSIONS */}
          {activeLeftTab === "submissions" && (
            <div>
              <h2 className="text-xl font-bold">Submissions</h2>
              <p>Your submissions will appear here</p>
            </div>
          )}
     

       {activeLeftTab === "chatAI" && problem && (
  <ChatAi problem={problem} />
)}
          {/* CHAT AI */}
          {activeLeftTab === "chatAI" && (
      
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  
    
              </div>
              
            </div>
            
            
          )}

        </div>
      </div>
      
      

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex flex-col">

        {/* RIGHT TABS */}
        <div className="tabs tabs-bordered bg-base-200 px-4">

          <button
            className={`tab ${activeRightTab === "code" ? "tab-active" : ""}`}
            onClick={() => setActiveRightTab("code")}
          >
            Code
          </button>

          <button
            className={`tab ${activeRightTab === "testcase" ? "tab-active" : ""}`}
            onClick={() => setActiveRightTab("testcase")}
          >
            Testcase
          </button>

          <button
            className={`tab ${activeRightTab === "result" ? "tab-active" : ""}`}
            onClick={() => setActiveRightTab("result")}
          >
            Result
          </button>

        </div>

        {/* LANGUAGE */}
        <div className="bg-base-300 px-4 py-2">
          <select
            className="select select-sm select-bordered"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
          </select>
        </div>

        {/* EDITOR */}
        {activeRightTab === "code" && (
          <div className="flex-1">
            <Editor
              height="100%"
              language="cpp"
              value={code}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true
              }}
            />
          </div>
        )}

        {/* TESTCASE */}
        {activeRightTab === "testcase" && (
          <div className="flex-1 p-4 overflow-y-auto">
            {(runResult?.testCases || []).map((tc, i) => (
              <div key={i} className="bg-base-100 p-3 rounded mb-3">
                <div><strong>Input:</strong> {tc.input}</div>
                <div><strong>Expected:</strong> {tc.expected}</div>
                <div><strong>Output:</strong> {tc.output}</div>
                <div className={tc.status === "passed" ? "text-green-600" : "text-red-600"}>
                  {tc.status === "passed" ? "✓ Passed" : "✗ Failed"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESULT */}
        {activeRightTab === "result" && (
          <div className="flex-1 p-4">
            {submitResult ? (
              <div>
                <h3 className="font-bold text-lg">
                  {submitResult.status === "accepted"
                    ? "Accepted"
                    : "Wrong Answer"}
                </h3>

                <p className="mt-2">
                  Testcases Passed: {submitResult.testcasespassed}/{submitResult.testcasestotal}
                </p>
              </div>
            ) : (
              <p>Click submit to evaluate your code</p>
            )}
          </div>
        )}
 

        {/* BUTTONS */}
        <div className="bg-base-300 p-4 flex justify-end gap-2">
          <button className="btn btn-outline btn-primary" onClick={handleRun}>
            Run
          </button>

          <button className="btn btn-primary" onClick={handleSubmitCode}>
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProblemPage;