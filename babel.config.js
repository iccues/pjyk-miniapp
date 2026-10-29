// babel-preset-taro 的选项说明：https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    [
      "taro",
      {
        framework: "vue3",
        ts: true,
        compiler: "webpack5",
      },
    ],
  ],
};
