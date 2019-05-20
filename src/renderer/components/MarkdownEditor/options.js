// markdown高亮支持
import 'codemirror/mode/markdown/markdown'
// 回车后自动填充list
import 'codemirror/addon/edit/continuelist'
// 选中行高亮
import 'codemirror/addon/selection/active-line'

export default {
  // codemirror options
  mode: {
    name: 'markdown',
    xml: false
  },
  autofocus: true,
  extraKeys: { 'Enter': 'newlineAndIndentContinueMarkdownList' },
  styleActiveLine: { nonEmpty: false },
  lineWrapping: true,
  breaks: true,
  xhtmlOut: true,
  showCursorWhenSelecting: true,
  viewportMargin: Infinity
  // more codemirror options, 更多 codemirror 的高级配置...
}
