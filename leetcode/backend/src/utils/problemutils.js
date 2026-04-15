const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
// src/utils/language.js
const getlanguagebyid = (lang) => {
  const map = {
    cpp: 54,
    c: 50,
    java: 62,
    python: 71
  };
  return map[lang];
};

module.exports = { getlanguagebyid };


const TEMP_DIR = path.join(__dirname, "../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const runCppWithDocker = (code, input = "") => {
  return new Promise((resolve) => {
    const uniqueId = Date.now() + "_" + Math.random().toString(36).slice(2);

    const cppFile = path.join(TEMP_DIR, `main_${uniqueId}.cpp`);
    const exeFile = `main_${uniqueId}`;

    fs.writeFileSync(cppFile, code);

  const command = `
docker run --rm \
--cpus="1" \
--memory="256m" \
--network=none \
-v ${TEMP_DIR}:/app \
-w /app \
gcc:latest \
sh -c "g++ ${path.basename(cppFile)} -o ${exeFile} && printf '%b' '${input}' | ./${exeFile}"
`;

    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      // cleanup
      try {
        fs.unlinkSync(cppFile);
        fs.unlinkSync(path.join(TEMP_DIR, exeFile));
      } catch (_) {}

      if (error) {
        if (error.killed) {
          return resolve({
            status: "error",
            output: "Time Limit Exceeded"
          });
        }

        return resolve({
          status: "error",
          output: stderr ? stderr.toString() : "Runtime Error"
        });
      }

      resolve({
        status: "success",
        output: stdout.toString().trim()
      });
    });
  });
};

module.exports = { runCppWithDocker,getlanguagebyid };
