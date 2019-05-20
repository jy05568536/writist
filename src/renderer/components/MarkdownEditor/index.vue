<template>
    <div id="main" class="wrapper">
        <!-- 工具栏 -->
        <div class="header">
            <editor-tool :cm="toolCm"></editor-tool>
            <!--<button @click="exportPdf">导出PDF</button>-->
            <!--<button @click="save">保存</button>-->
            <span v-show="!saveStatus" style="color: white"><i class="el-icon-loading"></i>自动保存</span>
        </div>
        <!-- 编辑区域 -->
        <div class="editor" ref="editor">
            <div class="left" @mouseover="currentTab=1" @scroll="leftScroll" ref="left">
                <div ref="leftChild">
                    <codemirror ref="cm" v-model="code" :options="cmOptions" @paste="onPaste"
                                @inputRead="onInputRead"
                                @cursorActivity="onCursorActivity"></codemirror>
                </div>
            </div>
            <div class="right" @mouseover="currentTab=2" @scroll="rightScroll" ref="right">
                <div ref="rightChild" class="md-container markdown-body" v-html="compiledMarkdown"></div>
            </div>
        </div>
        <!-- 底部字数统计 -->
        <div class="footer">
            <span style="margin-left:10px">Markdown 行:<strong> {{line}} </strong>列:<strong> {{ch}}</strong></span>
            <span style="float:right;margin-right: 10px">
        字数:<strong> {{counter.words}} </strong>
        公式:<strong> {{counter.katexs}} </strong>
        图表:<strong> {{counter.mermaids}} </strong>
      </span>
        </div>
    </div>
</template>

<script>
  import md from './markdown-it'
  import util from '../../lib/util'
  import EditorTool from './EditorTool'
  import cmOptions from './options'
  import '@fortawesome/fontawesome-free/css/all.min.css'
  import 'katex/dist/katex.min.css'
  import { codemirror } from '../VueCodeMirror'
  import fs from 'fs'
  import { clipboard } from 'electron'
  import uuid from 'uuid'
  import _ from 'lodash'

  export default {
    components: {
      EditorTool,
      codemirror
    },
    data () {
      return {
        code: '',
        // 同步滚动条
        currentTab: 0,
        // 编辑器行列显示
        line: 0,
        ch: 0,
        toolCm: null,
        cmOptions,
        saveStatus: true
      }
    },
    props: {
      text: String
    },
    computed: {
      current: {
        get () {
          return this.$store.state.Editor.current
        }
      },
      compiledMarkdown: {
        get () {
          return md.render(this.code)
        }
      },
      cm: {
        get () {
          return this.$refs.cm.codemirror
        }
      },
      counter: {
        get () {
          let dom = util.parseDom(this.compiledMarkdown)
          return {
            words: dom.innerText.length,
            katexs: dom.querySelectorAll('.katex').length,
            mermaids: dom.querySelectorAll('.mermaid').length
          }
        }
      }
    },
    watch: {
      current (newObj, oldObj) {
        let that = this
        if (newObj == null) {
          // 新增文档
          that.code = ''
        } else if (oldObj == null || newObj._id !== oldObj._id) {
          fs.readFile(newObj.fileName, 'utf8', (err, data) => {
            if (err) throw err
            that.code = data
          })
        }
      },
      code (newStr, oldStr) {
        if (newStr !== '' && newStr !== oldStr) {
          this.saveStatus = false
          this.debounceSave()
        }
      }
    },
    mounted () {
      this.toolCm = this.cm
      this.code = this.text

      // 高度参数，减去titleBar、toolBar和footBar
      let heightParam = 70
      /**
       * 设置最大高度，出现自定义滚动条
       * @type {mounted}
       */
      const that = this
      that.$refs.editor.style.height = `${document.body.clientHeight - heightParam}px`
      // that.$refs.right.style.height = `${document.body.clientHeight - heightParam}px`
      window.onresize = () => {
        that.$refs.editor.style.height = `${document.body.clientHeight - heightParam}px`
        // that.$refs.right.style.height = `${document.body.clientHeight - heightParam}px`
      }

      /**
       * 设置codemirror高度
       */
      let cm = document.querySelector('.CodeMirror')
      let sr = cm.querySelector('.CodeMirror-scroll')
      cm.style.minHeight = this.$refs.left.offsetHeight - heightParam + 'px'
      sr.style.minHeight = this.$refs.left.offsetHeight - heightParam + 'px'

      // 放抖动保存
      this.debounceSave = _.debounce(this.save, 500)
    },
    methods: {
      onPaste (cm, e) {
        let clipboardImage = clipboard.readImage()
        if (!clipboardImage.isEmpty()) {
          let fileName = uuid.v1()
          let path = './data/pic/' + fileName
          fs.writeFile(path, clipboardImage.toPNG(), (err) => {
            if (err) throw err
            console.log('文件已被保存')
            let doc = this.cm.getDoc()
            let currentLine = doc.getCursor().line
            let line = currentLine
            let position = {line: currentLine, ch: doc.getLine(currentLine).length}
            if (doc.getLine(currentLine) !== '') {
              doc.replaceRange('\n', position)
              line++
            }
            let newPosition = {line: line, ch: 0}
            let content = `![图片](${path})`
            let lines = content.split('\n').length
            doc.replaceRange(content, newPosition)
            doc.setCursor({line: line + lines, ch: 3})
          })
        }
      },
      onInputRead (cm, changeObj) {
        // 先注释，后期做双冒号表情提
        //      let text = cm.getDoc().getLine(changeObj.from.line)
        //      let chr = text.charAt(changeObj.from.line)
        //      if (changeObj.origin === '+input' && changeObj.text[0] === ':' && chr === ':') {
        //        console.log('ok')
        //      }
      },
      onCursorActivity () {
        this.line = this.cm.getDoc().getCursor().line
        this.ch = this.cm.getDoc().getCursor().ch
      },
      exportPdf (e) {
        console.log(this.$store.state.Editor.current._id)
        // test
        fs.readFile('./test/test.json', 'utf8', (err, data) => {
          if (err) throw err
          let json = JSON.parse(data)
          let result = {
            'Location': []
          }
          json['Location'].forEach((item, index) => {
            if (item.length > 3) {
              if (item[3] !== 0) item[3] = parseInt(item[3])
              if (item[4] !== 0) item[4] = parseInt(item[4])
              if (item[5] !== 0) item[5] = parseInt(item[5])
              if (item[6] !== 0) item[6] = parseInt(item[6])
              if (item[7] !== 0) item[7] = parseInt(item[7])
              if (item[8] !== 0) item[8] = parseInt(item[8])
            }
            result['Location'].push(item)
          })
          console.log(result)
          fs.writeFile('./test/testnew.json', JSON.stringify(result), (err) => {
            if (err) throw err
          })
        })
      },
      /**
       * 保存文档
       */
      save () {
        let titleCode = this.cm.getDoc().getLine(this.cm.getDoc().firstLine())
        // 只取文字
        if (titleCode === '') {
          return
        }
        let title = md.parse(titleCode, {})[1].content
        this.$store.dispatch('saveDoc', {title: title, doc: this.code})
        this.saveStatus = true
      },
      /**
       * 以下为滚动条处理
       */
      leftScroll () {
        // 完美滚动条同步，后面在研究
        if (this.currentTab !== 1) {
          return
        }
        let line
        let dom
        let lines = this.$refs.left.querySelectorAll('.CodeMirror-line')
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].getBoundingClientRect().top - 50 > 0) {
            line = i
            dom = this.$refs.right.querySelector('.source-line[data-source-line="' + line + '"]')
            if (dom) {
              break
            }
          }
        }
        if (this.$refs.left.scrollTop === 0) {
          this.$refs.right.scrollTop = 0
        } else if ((this.$refs.left.scrollTop + this.$refs.left.clientHeight) === this.$refs.left.scrollHeight) {
          this.$refs.right.scrollTop = this.$refs.right.scrollHeight - this.$refs.right.clientHeight
        } else {
          this.$refs.right.scrollTop = dom.offsetTop - 5 - 50
        }
      },
      rightScroll () {
        if (this.currentTab !== 2) {
          return
        }
        let line
        let lines = this.$refs.right.querySelectorAll('.source-line')
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].getBoundingClientRect().top > 0) {
            line = Number(lines[i].getAttribute('data-source-line'))
            break
          }
        }
        if (this.$refs.right.scrollTop === 0) {
          this.$refs.left.scrollTop = 0
        } else if ((this.$refs.right.scrollTop + this.$refs.right.clientHeight) === this.$refs.right.scrollHeight) {
          this.$refs.left.scrollTop = this.$refs.left.scrollHeight - this.$refs.left.clientHeight
        } else {
          let range = this.cm.cursorCoords({line: line - 1, ch: 0}, 'local')
          this.$refs.left.scrollTop = range.top
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import '../../style/github-markdown.css';

    body {
        overflow: hidden;
    }

    .wrapper {
        height: 100%;
        overflow: hidden;
    }

    .header {
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        width: 100%;
        background: #409eff;
    }

    .left {
        height: 100%;
        width: 50%;
        padding: 15px;
        float: left;
        box-sizing: border-box;
        overflow-y: auto;
        border-right: 1px ridge #f0f0f0;
    }

    .right {
        height: 100%;
        width: 50%;
        padding: 15px;
        box-sizing: border-box;
        float: left;
        overflow-y: auto;
    }

    .md-container {
        height: auto;
        width: 100%;
        display: inline-block;
    }

    .footer {
        height: 20px;
        color: white;
        font-size: 12px;
        line-height: 20px;
        position: fixed;
        width: 100%;
        max-width: 100%;
        z-index: 10;
        bottom: 0;
        left: auto;
        background: #409eff;
    }

    /*滚动条样式*/
    ::-webkit-scrollbar { /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
    }

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.2);
    }

    ::-webkit-scrollbar-track { /*滚动条里面轨道*/
        border-radius: 0;
        background: #f0f0f0;
    }

    .fa, .far, .fas {
        font-size: 16px;
        padding: 0 6px;
        color: #d9d9d9;
    }

    .fa:hover, .far:hover, .fas:hover {
        color: white;
    }
</style>
