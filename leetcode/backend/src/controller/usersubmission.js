const Problem = require("../model/problems");
const Submission = require("../model/submission");
const User = require("../model/user");

const { runCppWithDocker } = require("../utils/problemutils");

function compareTwoSum(a,b){
  const x = a.replace(/[\[\]\s]/g,'').split(',');
  const y = b.replace(/[\[\]\s]/g,'').split(',');
  return (x[0]===y[0] && x[1]===y[1]) || (x[0]===y[1] && x[1]===y[0]);
}
/* ================================
   SUBMIT CODE (Hidden Testcases)
================================ */
const submitcode = async (req, res) => {
  try {
    const userid = req.result._id;
    const problemid = req.params.id;
    let { code, language } = req.body;

    if (!userid || !problemid || !code || !language) {
      return res.status(400).send("some field is missing");
    }

    language = language.toLowerCase().trim();
    if (language === "c++") language = "cpp";

    if (language !== "cpp") {
      return res.status(400).send("Only C++ is supported currently");
    }

    const problem = await Problem.findById(problemid);
    if (!problem) return res.status(404).send("Problem not found");

    const submission = await Submission.create({
      userid,
      problemid,
      code,
      language,
      status: "pending",
      testcasespassed: 0,
      testcasestotal: problem.hiddentestcases.length
    });

    let passed = 0;
    let status = "accepted";
    let errormessage = "";

    for (const testcase of problem.hiddentestcases) {
      const result = await runCppWithDocker(code, testcase.input);

       if (
  result.status === "success" &&
   compareTwoSum(result.output, testcase.output)
) {
        passed++;
      } else {
        status = "wrong";
        errormessage = result.output;
        break;
      }
    }

    submission.status = status;
    submission.testcasespassed = passed;
    submission.errormessage = errormessage || null;
    await submission.save();

    if (status === "accepted") {
      const user = await User.findById(userid);
      if (!user.problemsolved.includes(problemid)) {
        user.problemsolved.push(problemid);
        await user.save();
      }
    }

    res.status(201).send(submission);

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

/* ================================
   RUN CODE (Visible Testcases)
================================ */
const runcode = async (req, res) => {
  try {
    const userid = req.result._id;
    const problemid = req.params.id;
    let { code, language } = req.body;

    if (!userid || !problemid || !code || !language) {
      return res.status(400).send("some field is missing");
    }

    language = language.toLowerCase().trim();
    if (language === "c++") language = "cpp";

    if (language !== "cpp") {
      return res.status(400).send("Only C++ is supported currently");
    }

    const problem = await Problem.findById(problemid);
    if (!problem) return res.status(404).send("Problem not found");

    const results = [];

    for (const testcase of problem.visibletestcases) {
      const result = await runCppWithDocker(code, testcase.input);

      results.push({
        input: testcase.input,
        expected: testcase.output,
        output: result.output,
       status:
  result.status === "success" &&
  compareTwoSum(result.output, testcase.output)
    ? "passed"
    : "failed"
     });}

  res.status(200).json({
  success: true,
  testCases: results
});

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { submitcode, runcode };
