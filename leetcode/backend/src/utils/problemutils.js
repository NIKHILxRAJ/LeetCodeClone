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

const runCppWithDocker = (code) => {

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

    const exeFile =
      `main_${uniqueId}`;

    fs.writeFileSync(cppFile, code);

    const command = `
docker run --rm \
-v ${TEMP_DIR}:/app \
-w /app \
gcc:13 \
sh -c "g++ ${path.basename(cppFile)} -o ${exeFile} && ./${exeFile}"
`;

    exec(

      command,

      {
        timeout: 15000
      },

      (error, stdout, stderr) => {

        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);
        console.log("ERROR:", error);

        /* CLEANUP */

        try {

          fs.unlinkSync(cppFile);

          const exePath =
            path.join(TEMP_DIR, exeFile);

          if (fs.existsSync(exePath)) {
            fs.unlinkSync(exePath);
          }

        } catch (_) {}

        /* HANDLE ERROR */

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
              error.message ||
              "Runtime Error"
          });
        }

        /* SUCCESS */

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