const moduleNames = process.env.MODULES.split(",");
const modules = moduleNames.map((name) => require(`./${name}`));

exports.handler = (event, context, callback) => {
  modules.forEach((module) => {
    const { handler } = module;
    handler(event, context, callback);
  });
};
