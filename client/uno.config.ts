import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'
import presetChinese from "unocss-preset-chinese";

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none'],
  ],
  theme: {
    extend: {
      colors: {
        'regalblue': '#243c5a',
      },
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
        chi: '微软雅黑'
      },
    }),
    presetChinese({
      extendTheme: false, // 不扩展主题对象
      themeKey: 'customFontFamily', // 使用自定义的主题键
      chineseType: "traditional", // 指定文本为简体中文
    })
  ],
  
})
