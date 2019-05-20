import markdownIt from 'markdown-it'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItIns from 'markdown-it-ins'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItMark from 'markdown-it-mark'
import markdownItContainer from 'markdown-it-container'
import markdownItRegexp from 'markdown-it-regexp'
import markdownItEmoji from 'markdown-it-emoji'

import markdownItMermaid from './markdown-it-mermaid'
import markdownItKatex from './markdown-it-katex'
import markdownItLineNumber from './markdown-it-line-number'

import highlight from 'highlight.js'

import 'highlight.js/styles/arduino-light.css'

highlight.initHighlightingOnLoad()

const md = markdownIt({
  breaks: true,
  typographer: true,
  xhtmlOut: true,
  highlight (code) {
    return highlight.highlightAuto(code).value
  }
}).use(markdownItTaskLists)
  .use(markdownItFootnote)
  .use(markdownItIns)
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItAbbr)
  .use(markdownItMark)
  .use(markdownItContainer, 'success')
  .use(markdownItContainer, 'info')
  .use(markdownItContainer, 'danger')
  .use(markdownItContainer, 'warning')
  .use(markdownItEmoji)
  /**
   *自定义插件
   */
  .use(markdownItMermaid)
  .use(markdownItKatex)
  .use(markdownItLineNumber)
  /**
   * fa图标
   */
  .use(markdownItRegexp(
    /(:fa-(.*):)/,
    (match) => {
      return `<i class="fa ${match[0].slice(1, -1)}"></i>`
    }))

export default md
