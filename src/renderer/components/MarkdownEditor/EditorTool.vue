<template>
    <div class="tool">
        <i class="fas fa-bold" @click="insertText('bold')" title="加粗"></i>
        <i class="fas fa-italic" @click="insertText('italic')" title="斜体"></i>
        <i class="fas fa-underline" @click="insertText('underline')" title="下划线"></i>
        <i class="fas fa-strikethrough" @click="insertText('strikethrough')" title="删除线"></i>
        <i class="fas fa-list" @click="insertText('list')" title="插入无序列表"></i>
        <i class="far fa-check-square" @click="insertText('todo')" title="插入代办列表"></i>
        <i class="fas fa-quote-left" @click="insertText('quote')" title="插入引用"></i>
        <i class="fas fa-link" @click="insertText('link')" title="插入链接"></i>
        <span class="split">|</span>
        <i class="fas fa-minus" @click="insertText('line')" title="插入分割线"></i>
        <i class="fas fa-table" @click="insertText('table')" title="插入表格"></i>
        <i class="fas fa-code" @click="insertText('code')" title="插入代码块"></i>
        <i class="fas fa-image" @click="insertText('image')" title="插入图片"></i>
        <span class="split">|</span>
        <i class="fas fa-superscript" @click="insertText('formula-inline')" title="插入行内公式"></i>
        <i class="fas fa-square-root-alt" @click="insertText('formula')" title="插入公式"></i>
        <i class="fas fa-arrow-right" @click="insertText('flow')" title="插入流程图"></i>
        <i class="fas fa-exchange-alt" @click="insertText('seq')" title="插入序列图"></i>
        <i class="fas fa-check-circle" @click="insertText('success')" title="插入成功消息"></i>
    </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: {
      cm: Object
    },
    computed: {},
    mounted () {
    },
    methods: {
      uploadImage (e) {
        console.log(e)
      },
      insertText (type) {
        let doc = this.cm.getDoc()
        let currentLine = doc.getCursor().line
        let line = currentLine
        if (this.isNewLine(type)) {
          let position = {line: currentLine, ch: doc.getLine(currentLine).length}
          // 这些类型必需插入新行展示
          if (doc.getLine(currentLine) !== '') {
            doc.replaceRange('\n', position)
            line++
          }
          let newPosition = {line: line, ch: 0}
          let content = this.insertContent(type)
          let lines = content.split('\n').length
          doc.replaceRange(content, newPosition)
          doc.setCursor({line: line + lines, ch: 3})
        } else {
          // 对当前行
          if (doc.getSelection() !== '' && this.isReplace(type)) {
            // 有选中内容并且该类型可以替换，则替换
            let text = doc.getSelection()
            if (text.startsWith(this.replaceContent(type)) && text.endsWith(this.replaceContent(type))) {
              text = text.slice(this.replaceContent(type).length, -this.replaceContent(type).length)
            } else {
              text = this.replaceContent(type) + text + this.replaceContent(type)
            }
            doc.replaceSelection(text)
          } else {
            // 否则插入
            let position = {line: currentLine, ch: doc.getCursor().ch}
            let content = this.insertContent(type)
            doc.replaceRange(content, position)
          }
        }
        this.cm.focus()
      },
      /**
       * 是否可以替换，isNewLine is false 才有
       */
      isReplace (type) {
        switch (type) {
          case 'formula-inline':
          case 'link':
            return false
          case 'bold':
          case 'italic':
          case 'underline':
          case 'strikethrough':
            return true
        }
      },
      /**
       * 是否插入新行
       * @param type
       * @returns {boolean}
       */
      isNewLine (type) {
        switch (type) {
          case 'code':
          case 'list':
          case 'table':
          case 'formula':
          case 'flow':
          case 'seq':
          case 'success':
          case 'line':
          case 'todo':
          case 'quote':
          case 'image':
            return true
          case 'formula-inline':
          case 'bold':
          case 'italic':
          case 'underline':
          case 'strikethrough':
          case 'link':
            return false
        }
      },
      /**
       * isReplace is true 才有
       * @param type
       * @returns {*}
       */
      replaceContent (type) {
        switch (type) {
          case 'bold':
            return '**'
          case 'italic':
            return '*'
          case 'underline':
            return '++'
          case 'strikethrough':
            return '~~'
        }
      },
      insertContent (type) {
        switch (type) {
          case 'bold':
            return '**粗体**'
          case 'italic':
            return '*斜体*'
          case 'underline':
            return '++下划线++'
          case 'strikethrough':
            return '~~删除线~~'
          case 'link':
            return '[百度](https://www.baidu.com)'
          case 'image':
            return '![百度](https://www.baidu.com/img/bd_logo1.png)'
          case 'formula-inline':
            return '`$E=mc^2$`'
          case 'line':
            return '---'
          case 'todo':
            return '- [ ] '
          case 'quote':
            return '> '
          case 'code':
            return `\`\`\`java
String text = "Hello World";
\`\`\``
          case 'list':
            return '- '
          case 'table':
            return `表头1 | 表头2 | 表头3
-|-|-
列 | 1 | 2
列 | 1 | 2`
          case 'formula':
            return `\`\`\`katex
E=mc^2
\`\`\``
          case 'flow':
            return `\`\`\`mermaid
graph LR
昨天-->今天
\`\`\``
          case 'seq':
            return `\`\`\`mermaid
sequenceDiagram
A->>B: 我们不一样
B->>A: 有啥不一样
\`\`\``
          case 'success':
            return `:::success
你成功了！
:::`
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .tool {
        display: inline-block;
    }

    .split {
        padding: 0 6px;
        color: #3a8ee6;
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
