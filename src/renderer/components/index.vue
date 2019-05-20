<template>
    <div class="wrapper">
        <transition mode="out-in">
            <file-explorer ref="explorer" class="explorer" v-if="explorerVisible"></file-explorer>
        </transition>
        <i class="el-icon-tickets side" @click="explorerVisible = !explorerVisible">
            <div>我的文档</div>
        </i>
        <markdown-editor :text="text"/>
    </div>
</template>

<script>
  import MarkdownEditor from './MarkdownEditor'
  import FileExplorer from './FileExplorer'
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

  export default {
    name: 'app',
    components: {
      MarkdownEditor,
      FileExplorer,
      CollapseTransition
    },
    data () {
      return {
        text: '',
        explorerVisible: false
      }
    },
    mounted () {
      this.$store.dispatch('getFirstDoc')
    },
    methods: {
      toggle () {
        console.log(this.explorerVisible)
      }
    }
  }
</script>
<style>
    html, body, .wrapper {
        height: 100%;
        font-family: Menlo, "Ubuntu Mono", Consolas, "Courier New", "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
    }

    body {
        margin: 0;
    }

    .side {
        background: #409eff;
        color: white;
        padding: 10px 3px;
        position: fixed;
        z-index: 999;
        bottom: 40px;
        cursor: pointer;
    }

    .side div {
        padding-top: 3px;
        width: 12px;
        margin: 0 auto;
        line-height: 12px;
        font-size: 12px;
    }

    .explorer {
        height: 100%;
        float: left;
        width: 300px;
        box-sizing: border-box;
        overflow-y: auto;
        border-right: 1px ridge #f0f0f0;
    }

    /*滚动条样式*/
    ::-webkit-scrollbar { /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.2);
    }

    ::-webkit-scrollbar-track { /*滚动条里面轨道*/
        border-radius: 0;
        background: #f0f0f0;
    }
</style>
