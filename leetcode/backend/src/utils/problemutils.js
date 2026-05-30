const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/* ===============================
      LANGUAGE IDS
=============================== */

const getlanguagebyid = (lang) => {

  const map = {
    cpp: 54,
    c: 50,
    java: 62,
    python: 71
  };

  return map[lang];
};

/* ===============================
      TEMP DIRECTORY
=============================== */

const TEMP_DIR =
  path.join(__dirname, "../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

/* ===============================
      RUN CPP CODE
=============================== */

const runCppWithDocker = (code, input = "") => {

  return new Promise((resolve) => {

    const uniqueId =
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2);

    const cppFile =
      path.join(
        TEMP_DIR,
        `main_${uniqueId}.cpp`
      );

    const inputFile =
      path.join(
        TEMP_DIR,
        `input_${uniqueId}.txt`
      );

    const exeFile =
      `main_${uniqueId}`;

    fs.writeFileSync(cppFile, code);
    fs.writeFileSync(inputFile, input);

    const command = `
docker run --rm \
-v ${TEMP_DIR}:/app \
-w /app \
gcc:13 \
sh -c "g++ ${path.basename(cppFile)} -o ${exeFile} && ./${exeFile} < ${path.basename(inputFile)}"
`;

    exec(
      command,
      { timeout: 15000 },
      (error, stdout, stderr) => {

        try {

          fs.unlinkSync(cppFile);

          if (fs.existsSync(inputFile)) {
            fs.unlinkSync(inputFile);
          }

          const exePath =
            path.join(TEMP_DIR, exeFile);

          if (fs.existsSync(exePath)) {
            fs.unlinkSync(exePath);
          }

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
            output:
              stderr?.toString() ||
              error.message
          });
        }

        resolve({
          status: "success",
          output:
            stdout.toString().trim()
        });
      }
    );
  });
};

module.exports = {
  runCppWithDocker,
  getlanguagebyid
};