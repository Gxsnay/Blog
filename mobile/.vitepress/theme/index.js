import DefaultTheme from "vitepress/theme";
import "./custom.styl";

// figlet -f big "Gxsnay"
console.log(
  `%c
   _____
  / ____|
 | |  ____  _____ _ __   __ _ _   _
 | | |_ \\ \\/ / __| '_ \\ / _\` | | | |
 | |__| |>  <\\__ \\ | | | (_| | |_| |
  \\_____/_/\\_\\___/_| |_|\\__,_|\\__, |
                               __/ |
                              |___/
`,
  "color: #42b983"
);
console.log(`%c微信/微博, 可添加：%cGxsnay`, "color: red", "color: #42b983");
export default DefaultTheme;
