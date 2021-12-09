const { logger } = require("./src/logger");
const { compile } = require("nexe");
const path = require("path");
const execSync = require("child_process").execSync;

async function runBuild() {
  let options;
  options = {
    targetNode: "mac-x64-14.9.0",
    targetDir: "twitch_chat_transfer_to_discord_for_mac",
    name: "twitch_chat_transfer_to_discord",
  };

  await makeReleaseFiles(options);

  options = {
    targetNode: "windows-x64-14.5.0",
    targetDir: "twitch_chat_transfer_to_discord_for_win",
    name: "twitch_chat_transfer_to_discord",
  };
  await makeReleaseFiles(options);
}

async function makeReleaseFiles(options) {
  const targetNode = options.targetNode;
  const targetDir = options.targetDir;
  const name = options.name;

  logger.info("clean up dist");
  let command;

  command = `rm -rf ${path.join(__dirname, `./dist/${targetDir}`)}`;
  logger.info(command);
  logger.info(execSync(command).toString());

  const dirList = [
    { name: "./", addKeepFile: false },
    { name: "./node_modules", addKeepFile: false },
    { name: "./config", addKeepFile: false },
  ];

  dirList.forEach((dir) => {
    command = `mkdir -p ${path.join(
      __dirname,
      `./dist/${targetDir}/${dir.name}`
    )}`;
    logger.info(command);
    logger.info(execSync(command).toString());

    if (dir.addKeepFile) {
      command = `touch ${path.join(
        __dirname,
        `./dist/${targetDir}/${dir.name}/.keep`
      )}`;
      logger.info(command);
      logger.info(execSync(command).toString());
    }
  });

  await compile({
    input: path.join(__dirname, "./main.js"),
    // build: true, // required to use patches
    target: targetNode,
    name: name,
    // loglevel: 'info',Node
    output: `./dist/${targetDir}/${name}`,
    resource: [path.join(__dirname, "./src/**/*")],
  })
    .then(() => {
      logger.info("success build for mac");
    })
    .then(() => {
      logger.info("adding release files for mac");

      const copyFiles = [
        { name: "./config/default.js.sample", option: "" },

        // for test of build artifacts
        // {name: './config/default.js', option: ''},
      ];

      copyFiles.forEach((target) => {
        command = `cp ${target.option} ${path.join(
          __dirname,
          target.name
        )} ${path.join(__dirname, `./dist/${targetDir}`, target.name)}`;
        logger.info(command);
        logger.info(execSync(command).toString());
      });
    })
    .then(() => {
      logger.info("success output release files for mac");
    });
}

runBuild();
