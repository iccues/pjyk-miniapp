export {};

// 模板里直接写 view、image 等小程序组件，类型来自 @tarojs/components
declare module "vue" {
  export interface GlobalComponents extends JSX.IntrinsicElements {}
}
